export const generateThumbnailFFmpeg = async (ffmpeg, fetchFile, file) => {
    const fileData = await fetchFile(file);
    await ffmpeg.writeFile("input", fileData);

    if (isVideo(file)) {
        await ffmpeg.exec([
            '-i', 'input',
            '-ss', '00:00:01.000',
            '-frames:v', '1',
            '-vf', 'scale=200:200:force_original_aspect_ratio=increase,crop=200:200',
            '-c:v', 'libwebp',
            '-lossless', '0',
            '-quality', '80',
            '-compression_level', '6',
            '-preset', 'picture',
            '-loop', '0',
            '-vsync', '0',
            '-f', 'webp',
            'thumbnail.webp'
          ]);
    } else {
        await ffmpeg.exec([
            '-i', 'input',
            '-vf', 'scale=200:200:force_original_aspect_ratio=increase,crop=200:200',
            '-c:v', 'libwebp',
            '-lossless', '0',
            '-quality', '80',
            '-compression_level', '6',
            '-preset', 'picture',
            '-loop', '0',
            '-vsync', '0',
            '-f', 'webp',
            'thumbnail.webp'
          ]);
    }

    const thumbnailData = await ffmpeg.readFile('thumbnail.webp');
    const thumbnailBlob = new Blob([thumbnailData], { type: 'image/webp' });

    await ffmpeg.deleteFile('input');
    await ffmpeg.deleteFile('thumbnail.webp');

    return thumbnailBlob;
}

export const generateThumbnailCanvas = async (file) => {
    console.log('[canvas]: Using canvas to generate thumbnail');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = 200;
    canvas.height = 200;

    let progress = 0;
    const updateProgress = (value) => {
        progress = value;
        console.log(`[canvas]: Progress ${progress}%`);
    };

    updateProgress(10);

    if (isVideo(file)) {
        const video = document.createElement('video');
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        video.setAttribute('crossOrigin', 'anonymous');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.src = URL.createObjectURL(file);

        await new Promise((resolve, reject) => {
            let hasResolved = false;
            const timeoutId = setTimeout(() => {
                if (!hasResolved) {
                    cleanupVideo();
                    reject(new Error('Video loading timeout'));
                }
            }, 10000);

            const cleanupVideo = () => {
                URL.revokeObjectURL(video.src);
                clearTimeout(timeoutId);
                video.removeAttribute('src');
                video.load();
            };

            const processFrame = () => {
                if (!hasResolved) {
                    try {
                        const aspectRatio = video.videoWidth / video.videoHeight;
                        let sourceWidth = video.videoWidth;
                        let sourceHeight = video.videoHeight;
                        let sourceX = 0;
                        let sourceY = 0;

                        if (aspectRatio > 1) {
                            sourceWidth = sourceHeight;
                            sourceX = (video.videoWidth - sourceWidth) / 2;
                        } else {
                            sourceHeight = sourceWidth;
                            sourceY = (video.videoHeight - sourceHeight) / 2;
                        }

                        updateProgress(50);
                        context.clearRect(0, 0, 200, 200);
                        context.drawImage(
                            video,
                            sourceX, sourceY,
                            sourceWidth, sourceHeight,
                            0, 0,
                            200, 200
                        );
                        
                        hasResolved = true;
                        cleanupVideo();
                        updateProgress(70);
                        resolve();
                    } catch (error) {
                        cleanupVideo();
                        reject(error);
                    }
                }
            };

            video.onloadeddata = () => { video.currentTime = 1; };
            video.onseeked = processFrame;
            video.oncanplay = processFrame;

            video.onerror = () => {
                cleanupVideo();
                reject(new Error(`Video error: ${video.error?.message || 'Unknown error'}`));
            };
        });
    } else {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = URL.createObjectURL(file);

        await new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                URL.revokeObjectURL(img.src);
                reject(new Error('Image loading timeout'));
            }, 10000);

            img.onload = () => {
                try {
                    const aspectRatio = img.width / img.height;
                    let sourceWidth = img.width;
                    let sourceHeight = img.height;
                    let sourceX = 0;
                    let sourceY = 0;

                    if (aspectRatio > 1) {
                        sourceWidth = sourceHeight;
                        sourceX = (img.width - sourceWidth) / 2;
                    } else {
                        sourceHeight = sourceWidth;
                        sourceY = (img.height - sourceHeight) / 2;
                    }

                    updateProgress(50);
                    context.clearRect(0, 0, 200, 200);
                    context.drawImage(
                        img,
                        sourceX, sourceY,
                        sourceWidth, sourceHeight,
                        0, 0,
                        200, 200
                    );
                    
                    URL.revokeObjectURL(img.src);
                    clearTimeout(timeoutId);
                    updateProgress(70);
                    resolve();
                } catch (error) {
                    URL.revokeObjectURL(img.src);
                    clearTimeout(timeoutId);
                    reject(error);
                }
            };

            img.onerror = (error) => {
                URL.revokeObjectURL(img.src);
                clearTimeout(timeoutId);
                reject(error);
            };
        });
    }

    return new Promise((resolve, reject) => {
        try {
            const isWebPSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            const format = isWebPSupported ? 'image/webp' : 'image/jpeg';
            const quality = format === 'image/webp' ? 0.8 : 0.9;

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        updateProgress(100);
                        const blobURL = URL.createObjectURL(blob);
                        console.log(`[canvas]: Thumbnail generated: ${blobURL}`);
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create thumbnail blob'));
                    }
                },
                format,
                quality
            );
        } catch (error) {
            reject(error);
        }
    });
};


const isVideo = (file) => {
    return file.type.startsWith('video/');
};