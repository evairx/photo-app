import * as libsodium from '@/crypto/libsodium';
import { getFileType } from '@/utils/fileTypeDetector';

self.onmessage = async (event) => {
  const { userId, albumId, id, key, header, apiUrl } = event.data;

  try {
    const uint8Key = await libsodium.toUint8Array(key);
    const uint8Header = await libsodium.toUint8Array(header);

    const response = await fetchFile(apiUrl, userId, albumId, id);

    const decryptedBlob = await processFileDecryption(response, uint8Key, uint8Header);

    self.postMessage({ type: 'complete', blob: decryptedBlob });
  } catch (error) {
    console.error("[Worker] Error en el proceso:", error.message);
    self.postMessage({ type: 'error', error: error.message });
  }
};

async function fetchFile(apiUrl, userId, albumId, id) {
  const response = await fetch(
    `${apiUrl}/get?id=${userId}&album=${albumId}&file=${id}`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error en la descarga: ${response.statusText}`);
  }

  return response;
}

async function processFileDecryption(response, key, header) {
    const BASE_CHUNK_SIZE = 4 * 1024 * 1024;
    const reader = response.body.getReader();
    const chunks = [];
    let receivedLength = 0;
    let pendingData = new Uint8Array(0);
    let state = null;
    let totalSize = parseInt(response.headers.get('Content-Length') || '0');
    let hasFoundFinalTag = false;
    let lastProgress = 0;

    self.postMessage({ 
        type: 'progress', 
        progress: 0,
        bytesProcessed: 0,
        totalBytes: totalSize
    });

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (value) {
                totalSize = totalSize || value.length;
                pendingData = concatenateArrays(pendingData, value);
            }

            const shouldProcess = pendingData.length >= BASE_CHUNK_SIZE || done;

            if (shouldProcess && pendingData.length > 0) {
                try {
                    const result = await libsodium.decryptWithChunks(
                        pendingData,
                        state,
                        key,
                        header,
                        BASE_CHUNK_SIZE,
                        done
                    );

                    state = result.newState;
                    chunks.push(...result.newChunks);
                    receivedLength += result.bytesProcessed;
                    pendingData = result.remainingData;

                    const currentProgress = Math.round((receivedLength / totalSize) * 100);
                    if (currentProgress > lastProgress) {
                        lastProgress = currentProgress;
                        self.postMessage({ 
                            type: 'progress', 
                            progress: Math.min(currentProgress, 100),
                            bytesProcessed: receivedLength,
                            totalBytes: totalSize
                        });
                    }

                    if (result.foundFinalTag) {
                        hasFoundFinalTag = true;
                        self.postMessage({ 
                            type: 'progress', 
                            progress: 100,
                            bytesProcessed: receivedLength,
                            totalBytes: totalSize
                        });
                        break;
                    }
                } catch (error) {
                    throw error;
                }
            }

            if (done) {
                break;
            }
        }

        if (!hasFoundFinalTag) {
            throw new Error('Decryption incomplete - final tag not found');
        }
        
        const fileType = getFileType(chunks);
        const blob = new Blob(chunks, { type: fileType });
        return URL.createObjectURL(blob);
    } catch (error) {
        throw new Error(`Decryption failed: ${error.message}`);
    }
}

function concatenateArrays(array1, array2) {
  const result = new Uint8Array(array1.length + array2.length);
  result.set(array1, 0);
  result.set(array2, array1.length);
  return result;
}