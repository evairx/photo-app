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
            case 'encryptFile':
                    try {
                        const { file, fileId, fileKey } = data;
                        const CHUNK_SIZE = 1024 * 1024 * 4; // 4MB chunks
                        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
                        const reader = new FileReader();
                        let offset = 0;
                        let encryptionState = null;
                        let header = null;
                        let processedChunks = 0;
                
                        const readNextChunk = () => {
                            if (processedChunks >= totalChunks) {
                                console.log(`All chunks processed: ${processedChunks}/${totalChunks}`);
                                self.postMessage({
                                    type: 'encryptFile',
                                    data: {
                                        header,
                                        fileId,
                                        totalChunks
                                    }
                                });
                                return;
                            }
                
                            const slice = file.slice(offset, Math.min(offset + CHUNK_SIZE, file.size));
                            reader.readAsArrayBuffer(slice);
                        };
                
                        reader.onload = async function (e) {
                            try {
                                const chunk = new Uint8Array(e.target.result);
                                const chunkNumber = processedChunks;
                                const isFinal = chunkNumber === totalChunks - 1;
                                
                                const progressHandler = (progress) => {
                                    self.postMessage({ 
                                        type: 'encryptProgress', 
                                        data: { progress } 
                                    });
                                };
                
                                const result = await libsodium.encryptFile(
                                    chunk,
                                    fileKey,
                                    fileId,
                                    chunkNumber,
                                    totalChunks,
                                    isFinal,
                                    encryptionState,
                                    progressHandler
                                );
                
                                if (chunkNumber === 0) {
                                    encryptionState = result.state;
                                    header = result.header;
                                } else {
                                    encryptionState = result.state;
                                }
                
                                offset += CHUNK_SIZE; // Asegura que no haya saltos en la lectura
                                processedChunks++;
                                readNextChunk();
                            } catch (error) {
                                console.error(`Encryption error on chunk ${processedChunks}:`, error);
                                self.postMessage({
                                    type: 'error',
                                    error: `Encryption error: ${error.message}`
                                });
                            }
                        };
                
                        reader.onerror = (error) => {
                            console.error('File reading error:', error);
                            self.postMessage({
                                type: 'error',
                                error: `File reading error: ${error}`
                            });
                        };
                
                        // Iniciar la lectura del primer chunk
                        readNextChunk();
                    } catch (error) {
                        console.error('Worker error:', error);
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
            case 'generateMasterKey':
                try {
                    const { masterKeyBase64, masterKeyBytes }= await libsodium.generateMasterKey();
                    self.postMessage({ type: 'generateMasterKey', data: { masterKeyBase64, masterKeyBytes } });
                } catch (error) {
                    console.log('worker error:', error);
                    self.postMessage({ type: 'error', error: error.message });
                }
                break;
            case 'generateRecoveryKey':
                try {
                    const { recoveryKeyBase64, recoveryKeyBytes } = await libsodium.generateRecoveryKey();
                    self.postMessage({ type: 'generateRecoveryKey', data: { recoveryKeyBase64, recoveryKeyBytes } });
                } catch (error) {
                    console.log('worker error:', error);
                    self.postMessage({ type: 'error', error: error.message });
                }
                break;
            case 'generateSalt':
                try {
                    const salt = await libsodium.generateSalt();
                    self.postMessage({ type: 'generateSalt', data: salt });
                } catch (error) {
                    console.log('worker error:', error);
                    self.postMessage({ type: 'error', error: error.message });
                }
                break;
            case 'deriveKeyEncryption':
                try {
                    const { password, salt } = data;
                    const keyEncryptionKey = await libsodium.deriveKeyEncryption(password, salt);
                    self.postMessage({ type: 'deriveKeyEncryption', data: keyEncryptionKey });
                } catch (error) {
                    console.log('worker error:', error);
                    self.postMessage({ type: 'error', error: error.message });
                }
                break;
            case 'generateNonce':
                try {
                    const nonce = await libsodium.generateNonce();
                    self.postMessage({ type: 'generateNonce', data: nonce });
                } catch (error) {
                    console.log('worker error:', error);
                    self.postMessage({ type: 'error', error: error.message });
                }
                break;
            case 'encryptKey':
                try {
                    const { keyEncryption, nonce, key } = data;
                    const encryptedKey = await libsodium.encryptKey(keyEncryption, nonce, key );
                    self.postMessage({ type: 'encryptKey', data: encryptedKey });
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