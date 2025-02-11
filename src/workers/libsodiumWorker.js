import * as libsodium from '@/crypto/libsodium'

self.onmessage = async (event) => {
    const { type, data } = event.data;
    try {
        switch (type) {
            case 'toUint8Array':
                try {
                    const { base64 } = data;
                    const uint8Array = await libsodium.toUint8Array(base64);
                    self.postMessage({ type: 'toUint8Array', data: uint8Array });
                } catch (error) {
                    console.log('worker error:', error);
                    self.postMessage({ type: 'error', error: error.message });
                }
                break;
            case 'toBase64':
                try {
                    const { uint8Array } = data;
                    const base64 = await libsodium.toBase64(uint8Array);
                    self.postMessage({ type: 'toBase64', data: base64 });
                } catch (error) {
                    console.log('worker error:', error);
                    self.postMessage({ type: 'error', error: error.message });
                }
                break;
            case 'generateKey':
                try {
                    const keyGenerated = await libsodium.generateKey();
                    self.postMessage({ type: 'generateKey', data: keyGenerated });
                } catch (error) {
                    console.log('worker error:', error);
                    self.postMessage({ type: 'error', error: error.message });
                }
                break;
            case 'encryptText':
                try {
                    const { key, text } = data;
                    const encryptedText = await libsodium.encryptText(key, text);
                    self.postMessage({ type: 'encryptText', data: encryptedText });
                } catch (error) {
                    console.log('worker error:', error);
                    self.postMessage({ type: 'error', error: error.message });
                }
                break;
            case 'decryptText':
                try {
                    const { key, encryptedText } = data;
                    const decryptedText = await libsodium.decryptText(key, encryptedText);
                    self.postMessage({ type: 'decryptText', data: decryptedText });
                } catch (error) {
                    console.log('worker error:', error);
                    self.postMessage({ type: 'error', error: error.message });
                }
                break;
            case 'decryptFile':
                try {
                    const { encryptedBlob, key, header } = data;

                    const progressHandler = (progress) => {
                        self.postMessage({ 
                            type: 'decryptProgress', 
                            data: { progress } 
                        });
                    };
                    
                    const decryptedFile = await libsodium.decryptFile(encryptedBlob, key, header, progressHandler);
                    self.postMessage({ type: 'decryptFile', data: decryptedFile });
                } catch (error) {
                    console.log('worker error:', error);
                    self.postMessage({ type: 'error', error: error.message });
                }
                break;
            case 'encryptFileInChunks':
                try {
                    const { file, fileKey } = data;
                    const reader = new FileReader();

                    reader.onload = async function () {
                        const progressHandler = (progress) => {
                            self.postMessage({ 
                                type: 'encryptProgress', 
                                data: { progress } 
                            });
                        };
                        
                        const data = await libsodium.encryptFileInChunks(
                            file, 
                            fileKey, 
                            progressHandler
                        );

                        self.postMessage({ 
                            type: 'encryptFileInChunks', 
                            data: data 
                        });
                    };

                    reader.readAsArrayBuffer(file);
                } catch (error) {
                    console.log('worker error:', error);
                    self.postMessage({ type: 'error', error: error.message });
                }
                break;
            case 'encryptedThumbnail':
                try {
                    const { thumbnailUint8, keyThumb } = data;
                    const encryptedThumbnail = await libsodium.encryptedThumbnail(thumbnailUint8, keyThumb);
                    self.postMessage({ type: 'encryptedThumbnail', data: encryptedThumbnail });
                } catch (error) {
                    console.log('worker error:', error);
                    self.postMessage({ type: 'error', error: error.message });
                }
                break;
            case 'decryptThumbnail':
                try {
                    const { thumbnailUint8Array, thumbnailKey } = data;
                    const decryptedThumbnail = await libsodium.decryptThumbnail(thumbnailUint8Array, thumbnailKey);
                    self.postMessage({ type: 'decryptThumbnail', data: decryptedThumbnail });
                } catch (error) {
                    console.log('worker error:', error);
                    self.postMessage({ type: 'error', error: error.message });
                }
                break;
            default:
                self.postMessage({ type: 'error', error: 'Invalid message type' });
        }
    } catch (error) {
        self.postMessage({ type: 'error', error: error.message });
    }
};