import { generateThumbnailCanvas } from "./thumbnail";

let worker = null;
let ffmpeg = null;

const getWorkers = () => {
  if (!worker || !ffmpeg) {
      worker = new Worker(new URL('../workers/libsodiumWorker.js', import.meta.url), { type: 'module' });
      ffmpeg = new Worker(new URL('../workers/ffmpegWorker.js', import.meta.url), { type: 'module' });
  }
  return { worker, ffmpeg };
};

const cleanupWorkers = () => {
  if (worker && ffmpeg) {
      worker.terminate();
      worker = null;
      ffmpeg.terminate();
      ffmpeg = null;
  }
};

export const selectFile = async (setProgress,setSate, setFileName, setFinishedUpload) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/png,image/jpg,image/jpeg,image/webp,video/mp4,video/x-matroska,video/avi,video/quicktime';

  input.addEventListener('change', async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    try {
      setFileName(selectedFile.name);
      setProgress(0);
      setSate('');
      setFinishedUpload(false);

      const { worker, ffmpeg } = getWorkers();
      let useFallback = false;
      let thumbnailBlob;

      try {
        ffmpeg.postMessage({ type: 'init' });
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('FFmpeg initialization timeout'));
          }, 5000);

          ffmpeg.onmessage = ({ data }) => {
            if (data.type === 'ready') {
              clearTimeout(timeout);
              resolve(data.payload);
            } else if (data.type === 'error') {
              clearTimeout(timeout);
              reject(new Error(data.payload));
            }
          };
        });

        thumbnailBlob = await new Promise((resolve, reject) => {
          ffmpeg.onmessage = ({ data }) => {
            if (data.type === 'complete') {
              resolve(data.payload);
            } else if (data.type === 'error') {
              reject(new Error(data.payload));
            }
          };
          ffmpeg.postMessage({ type: 'generateThumbnail', payload: { file: selectedFile } });
        });

      } catch (error) {
        console.log('FFmpeg failed, using canvas fallback:', error);
        useFallback = true;
      }

      if (useFallback || !thumbnailBlob) {
        try {
          thumbnailBlob = await generateThumbnailCanvas(selectedFile);
        } catch (error) {
          console.error('Fallback thumbnail generation failed:', error);
          throw new Error('Could not generate thumbnail');
        }
      }
      
      let duration = '';
      if (selectedFile.type.startsWith('video')) {
        duration = await getVideoDuration(selectedFile);
      }

      if (!thumbnailBlob) {
        console.log('Error processing thumbnail');
        setSate('Miniatura no procesada');
        setProgress(100);
      }

      const key = await new Promise((resolve, reject) => {
        worker.onmessage = ({ data }) => 
          data.type === 'generateKey' ? resolve(data.data) : reject(data.error);
        worker.postMessage({ type: 'generateKey' });
      });
      
      const data = await new Promise((resolve, reject) => {
        worker.onmessage = ({ data }) => {
            switch (data.type) {
                case 'encryptProgress': 
                    setProgress(data.data.progress);
                    setSate('Encriptando archivo...');
                    break;
                case 'encryptFileInChunks':
                    resolve(data.data);
                    break;
                case 'error':
                    reject(data.error);
                    break;
            }
        };
        
        worker.postMessage({ 
            type: 'encryptFileInChunks', 
            data: { 
                file: selectedFile, 
                fileKey: key
            } 
        });
      });

      console.log(data)
    
      const thumbnailArrayBuffer = await thumbnailBlob.arrayBuffer();
      const thumbnailUint8Array = new Uint8Array(thumbnailArrayBuffer);
      
      let encryptedThumbnailBlob = await new Promise((resolve, reject) => {
        worker.onmessage = ({ data }) => 
          data.type === 'encryptedThumbnail' ? resolve(data.data) : reject(data.error);
        worker.postMessage({ type: 'encryptedThumbnail', data: { thumbnailUint8: thumbnailUint8Array, keyThumb: key } });
      });;

      const keyString = await new Promise((resolve, reject) => {
        worker.onmessage = ({ data }) => 
          data.type === 'toBase64' ? resolve(data.data) : reject(data.error);
        worker.postMessage({ type: 'toBase64', data: { uint8Array: key} });
      })

      const HeaderString = await new Promise((resolve, reject) => {
        worker.onmessage = ({ data }) => 
          data.type === 'toBase64' ? resolve(data.data) : reject(data.error);
        worker.postMessage({ type: 'toBase64', data: { uint8Array: data.header} });
      })
      
      const lastModifiedDate = new Date(selectedFile.lastModified);
      const formattedDate = lastModifiedDate.toISOString().replace('T', ' ').replace('Z', '');

      const encryptedBlob = data.encryptedBlob;

      await uploadEncryptedFile(worker,encryptedBlob,encryptedThumbnailBlob, selectedFile, HeaderString, keyString, duration,setProgress, setSate, setFinishedUpload, formattedDate);
      cleanupWorkers();
    } catch (error) {
      cleanupWorkers();
      console.error('Error processing file:', error);
      setSate(error.message);
      setFileName(error.message);
      setProgress(100);
      alert(`Error processing file: ${JSON.stringify(error.error)}`);
    }
  });

  input.click();
};

const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve(video.duration);
    };
    video.onerror = () => {
      reject('Error reading video duration');
    };
    video.src = URL.createObjectURL(file);
  });
};

const uploadEncryptedFile = async (worker, encryptedBlob,encryptedThumbnailBlob, file, HeaderString, keyString, duration, setProgress, setSate, setFinishedUpload, formattedDate) => {
  const uploadUrl = 'http://192.168.1.2:3000/upload/b33acc19-3cf7-4912-915c-584c6affe7de/test';
  const thumbnailUploadUrl = 'http://192.168.1.2:3000/upload/b33acc19-3cf7-4912-915c-584c6affe7de/thumbnails';

  const formData = new FormData();
  setSate('Subiendo archivo...');
  setProgress(90);
  formData.append('file', encryptedBlob, file.name);

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  const thumbnailFormData = new FormData();
  thumbnailFormData.append('file', encryptedThumbnailBlob, `${file.name}.webp`);

  await fetch(thumbnailUploadUrl, {
    method: 'POST',
    body: thumbnailFormData,
  });

  const key = await new Promise((resolve, reject) => {
    worker.onmessage = ({ data }) => 
      data.type === 'toUint8Array' ? resolve(data.data) : reject(data.error);
    worker.postMessage({ type: 'toUint8Array', data: { base64: keyString } });
  });

  const nameEncrypted = await new Promise((resolve, reject) => {
    worker.onmessage = ({ data }) => 
      data.type === 'encryptText' ? resolve(data.data) : reject(data.error);
    worker.postMessage({ type: 'encryptText', data: { key, text: file.name } });
  });

  const sizeEncrypted = await new Promise((resolve, reject) => {
    worker.onmessage = ({ data }) => 
      data.type === 'encryptText' ? resolve(data.data) : reject(data.error);
    worker.postMessage({ type: 'encryptText', data: { key, text: file.size.toString() } });
  });

  if (response.ok) {
    const res = {
      id: 1,
      name: nameEncrypted,
      albumId: 'test',
      userId: 'b33acc19-3cf7-4912-915c-584c6affe7de',
      type: file.type.includes('image') ? 'image' : 'video',
      size: sizeEncrypted,
      duration: duration || 0,
      delete: false,
      hidden: false,
      key: keyString,
      header: HeaderString,
      date: formattedDate,
    }
    console.log(res)
    setSate(JSON.stringify(res));
    setProgress(100);
    setFinishedUpload(true);
    console.log('File uploaded successfully');
  } else {
    setSate('Error')
    setProgress(100);
    console.error('File upload failed');
  }
};
