import { createFFmpeg } from '../utils/ffmpeg.js';
import { fetchFile } from "@ffmpeg/util";
import { generateThumbnailFFmpeg } from '../services/thumbnail.js';

let ffmpeg = null;

self.onmessage = async (e) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'init':
      try {
        ffmpeg = await createFFmpeg();
        self.postMessage({ type: 'ready', payload: true });
      } catch (error) {
        console.error(error);
        self.postMessage({ type: 'error', payload: 'Failed to load FFmpeg' });
      }
      break;

    case 'generateThumbnail':
      if (!ffmpeg) {
        self.postMessage({ type: 'error', payload: 'FFmpeg not initialized' });
        return;
      }
      try {
        const { file } = payload;
    
        const thumbnailBlob = await generateThumbnailFFmpeg(ffmpeg, fetchFile, file);

        self.postMessage({ 
          type: 'complete', 
          payload: thumbnailBlob
        });
      } catch (error) {
        console.error(error);
        self.postMessage({ 
          type: 'error', 
          payload: 'Error processing file' 
        });
      }
      break;
  }
};