import { generateThumbnailCanvas } from "./thumbnail";
import { nanoid } from 'nanoid';

const calculateTotalProgress = (content) => {
  const validFiles = content.filter(file => !file.uploadError);
  if (validFiles.length === 0) return 0;
  const totalProgress = validFiles.reduce((acc, file) => acc + file.progress, 0);
  return Math.round(totalProgress / validFiles.length); // Redondeamos al entero más cercano
};

const updateFileProgress = (prev, fileIndex, progress) => {
  const newContent = [...prev.content];
  newContent[fileIndex] = {
    ...newContent[fileIndex],
    progress: Math.min(Math.max(progress, 0), 100) // Asegura que el progreso esté entre 0% y 100%
  };
  return {
    ...prev,
    content: newContent,
    totalProgress: calculateTotalProgress(newContent)
  };
};

const shortenFilename = (filename, visibleStart = 15, visibleEnd = 3, separator = "...") => {
  const parts = filename.split(".");
  if (parts.length < 2) return filename;
  const ext = parts.pop();
  const name = parts.join(".");
  if (name.length <= visibleStart + visibleEnd) return filename;
  return name.slice(0, visibleStart) + separator + name.slice(-visibleEnd) + "." + ext;
};

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

// 4GB 
const MAX_FILE_SIZE = 4 * 1024 * 1024 * 1024;

export const selectFile = async (setUpload) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = 'image/png,image/jpg,image/jpeg,image/webp,video/mp4,video/x-matroska,video/avi,video/quicktime';

  input.addEventListener('change', async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (!selectedFiles.length) return;

    const filesWithSizeCheck = selectedFiles.map(file => ({
      file: file,
      fileName: shortenFilename(file.name),
      type: file.type.startsWith('video') ? 'video' : 'image',
      progress: 0,
      uploadError: false,
      finishedUpload: false,
      sizeError: file.size > MAX_FILE_SIZE
    }));

    const isSingleOversizedFile = selectedFiles.length === 1 && filesWithSizeCheck[0].sizeError;

    setUpload({
      state: true,
      content: filesWithSizeCheck.map(({ fileName, type, progress, uploadError, finishedUpload, sizeError }) => ({
        fileName,
        type,
        progress,
        uploadError: sizeError || uploadError,
        finishedUpload,
        errorMessage: sizeError ? 'El rchivo supera el límite' : null
      })),
      filesProcessed: 0,
      totalProgress: 0,
      error: isSingleOversizedFile // Only set error true if single file exceeds limit
    });

    for (let fileIndex = 0; fileIndex < selectedFiles.length; fileIndex++) {
      const { file: selectedFile, sizeError } = filesWithSizeCheck[fileIndex];

      if (sizeError) {
        setUpload(prev => {
          const newContent = [...prev.content];
          newContent[fileIndex] = {
            ...newContent[fileIndex],
            uploadError: true,
            progress: 0,
            errorMessage: 'El rchivo supera el límite'
          };
          return {
            ...prev,
            content: newContent,
            totalProgress: calculateTotalProgress(newContent),
            error: isSingleOversizedFile // Maintain error state based on single file condition
          };
        });
        continue; // Skip to next file if this one is too large
      }

      try {
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
          setUpload(prev => {
            const newContent = [...prev.content];
            newContent[fileIndex] = {
              ...newContent[fileIndex],
              uploadError: true,
              progress: 0
            };
            const allFailed = newContent.every(file => file.uploadError);
            return {
              ...prev,
              content: newContent,
              totalProgress: calculateTotalProgress(newContent),
              error: allFailed
            };
          });
          continue;
        }

        const key = await new Promise((resolve, reject) => {
          worker.onmessage = ({ data }) => 
            data.type === 'generateKey' ? resolve(data.data) : reject(data.error);
          worker.postMessage({ type: 'generateKey' });
        });

        const thumbnailArrayBuffer = await thumbnailBlob.arrayBuffer();
        const thumbnailUint8Array = new Uint8Array(thumbnailArrayBuffer);
        const fileId = nanoid(22);
        
        const encryptedThumbnailBlob = await new Promise((resolve, reject) => {
          worker.onmessage = ({ data }) => 
            data.type === 'encryptedThumbnail' ? resolve(data.data) : reject(data.error);
          worker.postMessage({ 
            type: 'encryptedThumbnail', 
            data: { thumbnailUint8: thumbnailUint8Array, keyThumb: key } 
          });
        });

        const lastModifiedDate = new Date(selectedFile.lastModified);
        const formattedDate = lastModifiedDate.toISOString().replace('T', ' ').replace('Z', '');

        const uploadThumbnail = async () => {
          try {
            const url = 'http://localhost:3000/upload/b33acc19-3cf7-4912-915c-584c6affe7de/thumbnails';
            const thumbnailFormData = new FormData();
            thumbnailFormData.append('file', encryptedThumbnailBlob, `${fileId}`);
            const response = await fetch(url, {
              method: 'POST',
              body: thumbnailFormData,
            });
            return response.ok;
          } catch (error) {
            console.error('Error uploading thumbnail:', error);
            return false;
          }
        };

        const encryptedData = async (header, key) => {
          try {
            const nameEncrypted = await new Promise((resolve, reject) => {
              worker.onmessage = ({ data }) => {
                if (data.type === 'encryptText') {
                  resolve(data.data);
                } else {
                  reject(data.error);
                }
              };
              worker.postMessage({ type: 'encryptText', data: { key, text: selectedFile.name } });
            });

            const sizeEncrypted = await new Promise((resolve, reject) => {
              worker.onmessage = ({ data }) => {
                if (data.type === 'encryptText') {
                  resolve(data.data);
                } else {
                  reject(data.error);
                }
              };
              worker.postMessage({ type: 'encryptText', data: { key, text: selectedFile.size.toString() } });
            });

            const keyString = await new Promise((resolve, reject) => {
              worker.onmessage = ({ data }) => {
                if (data.type === 'toBase64') {
                  resolve(data.data);
                } else {
                  reject(data.error);
                }
              };
              worker.postMessage({ type: 'toBase64', data: { uint8Array: key } });
            });

            const HeaderString = await new Promise((resolve, reject) => {
              worker.onmessage = ({ data }) => {
                if (data.type === 'toBase64') {
                  resolve(data.data);
                } else {
                  reject(data.error);
                }
              };
              worker.postMessage({ type: 'toBase64', data: { uint8Array: header } });
            });

            return { nameEncrypted, sizeEncrypted, keyString, HeaderString };
          } catch (error) {
            console.error('Error in encryptedData:', error);
            throw new Error('Failed to encrypt data');
          }
        };

        const completeUpload = async (header, fileId, fileType, totalChunks, key) => {
            try {
              const chunks = Array.from(
                { length: totalChunks + 1 },
                (_, i) => `${fileId}_${i}`
              );

              let uploadPromise = Promise.resolve();

              if (selectedFile.size > 100 * 1024 * 1024) {
                const eventSource = new EventSource(`http://localhost:8080/multipart-complete/${fileId}`);
        
                uploadPromise = new Promise((resolve, reject) => {
                    eventSource.onmessage = (event) => {
                        const data = JSON.parse(event.data);
                        
                        if (data.progress !== undefined) {
                            setUpload(prev => {
                                const uploadProgress = 50 + Math.round(data.progress * 0.5); // Progreso de subida (50% a 100%)
                                return updateFileProgress(prev, fileIndex, uploadProgress);
                            });
                        }
        
                        if (data.status === 'complete') {
                            eventSource.close();
                            resolve(data.result);
                        }
        
                        if (data.status === 'error') {
                            eventSource.close();
                            reject(new Error(data.message));
                        }
                    };
        
                    eventSource.onerror = (error) => {
                        eventSource.close();
                        reject(new Error('EventSource connection failed'));
                    };
                });
            }
        
            const response = await fetch('http://localhost:8080/multipart-complete', {
              method: 'POST',
                headers: {
                   'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  userId: 'b33acc19-3cf7-4912-915c-584c6affe7de',
                  albumId: 'test',
                  file_id: fileId,
                  chunks: chunks
                })
              });
        
              const result = await uploadPromise;
        
              const thumbnailSuccess = await uploadThumbnail();

              if (!thumbnailSuccess) {
                throw new Error('Failed to upload thumbnail');
              }
        
              const { nameEncrypted, sizeEncrypted, keyString, HeaderString } = await encryptedData(header, key);
        
                const fileData = {
                    id: fileId,
                    name: nameEncrypted,
                    albumId: 'test',
                    userId: 'b33acc19-3cf7-4912-915c-584c6affe7de',
                    type: selectedFile.type.includes('image') ? 'image' : 'video',
                    size: sizeEncrypted,
                    duration: duration || 0,
                    delete: false,
                    hidden: false,
                    key: keyString,
                    header: HeaderString,
                    date: formattedDate,
                };
        
                console.log('Upload completed:', fileData);
        
                setUpload(prev => {
                    const newContent = [...prev.content];
                    newContent[fileIndex] = {
                        ...newContent[fileIndex],
                        progress: 100,
                        finishedUpload: true,
                        uploadError: false
                    };
                    
                    const successfulUploads = prev.filesProcessed + 1;
                    
                    return {
                        ...prev,
                        content: newContent,
                        filesProcessed: successfulUploads,
                        totalProgress: calculateTotalProgress(newContent),
                        error: newContent.every(file => file.uploadError)
                    };
                });
        
            } catch (error) {
              setUpload(prev => {
                  const newContent = [...prev.content];
                  newContent[fileIndex] = {
                      ...newContent[fileIndex],
                      uploadError: true,
                      finishedUpload: false,
                      progress: 0,
                      errorMessage: 'Error to upload'  // Added error message for fetch failures
                  };
                  
                  return {
                      ...prev,
                      content: newContent,
                      totalProgress: calculateTotalProgress(newContent),
                      error: newContent.every(file => file.uploadError)
                  };
              });
              console.error('Error completing upload:', error);
              throw error;
            }
        };

        await new Promise((resolve, reject) => {
          worker.onmessage = ({ data }) => {
              switch (data.type) {
                  case 'encryptProgress':
                    setUpload(prev => {
                      const encryptProgress = Math.round(data.data.progress * 0.5); // Progreso de encriptación (0% a 50%)
                      return updateFileProgress(prev, fileIndex, encryptProgress);
                    });
                      break;
                  case 'encryptFile':
                      completeUpload(
                          data.data.header,
                          data.data.fileId,
                          data.data.fileType,
                          data.data.totalChunks,
                          key
                      ).then(resolve);
                      break;
                  case 'error':
                      reject(data.error);
                      break;
              }
          };
      
          worker.postMessage({
              type: 'encryptFile',
              data: {
                  file: selectedFile,
                  fileId: fileId,
                  fileKey: key
              }
          });
      });

      } catch (error) {
        setUpload(prev => {
          const newContent = [...prev.content];
          newContent[fileIndex] = {
            ...newContent[fileIndex],
            uploadError: true,
            progress: 0
          };
          return {
            ...prev,
            content: newContent,
            totalProgress: calculateTotalProgress(newContent),
            error: newContent.every(file => file.uploadError)
          };
        });
        console.error('Error processing file:', error);
      }
    }

    cleanupWorkers();
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