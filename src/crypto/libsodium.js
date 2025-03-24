/**
 * This @file contains all necessary functions to encrypt and decrypt data using libsoium.js.
 * All functions will be used in a worker to avoid blocking the main thread.
 * 
 * Docs for the JS library: https://github.com/jedisct1/libsodium.js.
 */
import sodium from 'libsodium-wrappers-sumo';


/**
 * Converts a base64-encoded string to a Uint8Array using libsodium's `from_base64` function.
 * @param {string} data - The base64-encoded string to be converted to a Uint8Array.
 * @returns {Promise<Uint8Array>} The decoded data as a Uint8Array.
 */
export const toUint8Array = async (data) => {
    await sodium.ready;
    return sodium.from_base64(data);
}

/**
 * Converts a Uint8Array to a base64-encoded string using libsodium's `to_base64` function.
 * @param {Uint8Array} uint8Array - The Uint8Array to be converted to a base64 string
 * @returns {Promise<string>} The encoded data as a base64 string.
 */
export const toBase64 = async (uint8Array) => {
    await sodium.ready;
    return sodium.to_base64(uint8Array);
}

/**
 * Generates a new encryption key.
 * @returns {Promise<Uint8Array>} The generated key as a Uint8Array.
 */
export const generateKey = async () => {
    await sodium.ready;
    return sodium.crypto_secretstream_xchacha20poly1305_keygen();
}

/**
 * Encrypt strings using the encryptText(key, “hello world”) function,
 * using the XChaCha20-Poly1305 algorithm from libsodium.
 * @param {Uint8Array} key - The key used to encrypt the text.
 * @param {string} text - The text to be encrypted.
 * @returns {Promise<string>} The encrypted text as a base64-encoded string.
 */
export const encryptText = async (key, text) => {
    await sodium.ready;
    console.log(text)
    const keyArray = new Uint8Array(key);
    const { state, header } = sodium.crypto_secretstream_xchacha20poly1305_init_push(keyArray);
    const encryptedData = sodium.crypto_secretstream_xchacha20poly1305_push(
        state,
        new TextEncoder().encode(text),
        null,
        sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
    );
    return sodium.to_base64(new Uint8Array([...header, ...encryptedData]), sodium.base64_variants.ORIGINAL);
};


export const decryptText = async (key, encryptedText) => {
    await sodium.ready;
    const keyArray = new Uint8Array(key);
    const encryptedDataWithHeader = sodium.from_base64(encryptedText, sodium.base64_variants.ORIGINAL);
    
    // Extraemos el header (nonce) y los datos cifrados
    const header = encryptedDataWithHeader.slice(0, sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES);
    const encryptedData = encryptedDataWithHeader.slice(sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES);
    
    // Inicializamos el estado de desencriptación
    const state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, keyArray);
    
    // Desencriptamos los datos
    const { message, tag } = sodium.crypto_secretstream_xchacha20poly1305_pull(state, encryptedData, null);
    
    if (tag !== sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL) {
        throw new Error("El mensaje no tiene un TAG_FINAL válido, la desencriptación podría estar incompleta o corrupta.");
    }
    
    return new TextDecoder().decode(message);
};


const sendChunk = async (chunk, chunkNumber, totalChunks, fileId, delay = 0) => {
    const formData = new FormData();
    
    // Enhanced chunk info with size information
    const chunkInfo = {
        chunk_number: chunkNumber === -1 ? 0 : chunkNumber + 1, // Adjust numbering to start at 1, header at 0
        total_chunks: totalChunks,
        file_id: fileId,
        chunk_size: chunk.length,
        is_final: chunkNumber === totalChunks - 1,
        is_header: chunkNumber === -1 // Use this to identify header chunk
    };

    console.log(`Uploading chunk ${chunkInfo.chunk_number}/${totalChunks}...`);
    
    formData.append('chunk_info', JSON.stringify(chunkInfo));
    formData.append('chunk', new Blob([chunk]), `${fileId}_${chunkInfo.chunk_number}`);

    try {
        // Esperar antes de subir el chunk para reducir la carga en el servidor
       // await new Promise(resolve => setTimeout(resolve, delay));

        const response = await fetch('http://localhost:8080/multipart', {
            method: 'POST',
            body: formData,
            headers: {
                'X-File-Id': fileId,
                'X-Chunk-Number': chunkInfo.chunk_number.toString(),
                'X-Total-Chunks': totalChunks.toString()
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        
        if (result.status !== 'success') {
            throw new Error(result.message || 'Upload failed');
        }

        return {
            ...result,
            chunkNumber: chunkInfo.chunk_number,
            totalChunks,
            isComplete: result.path !== null
        };
    } catch (error) {
        console.error(`Chunk upload failed (${chunkNumber}/${totalChunks}):`, error);
        throw new Error(`Failed to upload chunk ${chunkNumber}: ${error.message}`);
    }
};

/**
 * This function is used to encrypt files, but is being used for photos and videos using 4MB Chunks,
 * passing the @file parameter, @key and the @progressCallback function. 
 * This will return the blob and header file already encrypted.
 * 
 * @param {Uint8Array} chunk - The current chunk to encrypt
 * @param {Uint8Array} fileKey - The key used to encrypt the file
 * @param {string} fileId - Unique identifier for the file
 * @param {string} fileType - MIME type of the file
 * @param {number} chunkNumber - Current chunk number
 * @param {number} totalChunks - Total number of chunks
 * @param {boolean} isFinal - Whether this is the final chunk
 * @param {Object} state - Encryption state object
 * @param {function} progressCallback - Progress callback function
 * @returns {Promise<{ state: Object, header?: Uint8Array }>} Encryption state and header (for first chunk)
 */
export const encryptFile = async (chunk, fileKey, fileId, chunkNumber, totalChunks, isFinal, state, progressCallback) => {
    await sodium.ready;
    try {
        // Initialize encryption for first chunk (chunk 0)
        if (chunkNumber === 0) {
            const initResult = sodium.crypto_secretstream_xchacha20poly1305_init_push(fileKey);
            state = initResult.state;

            // Send header as special chunk (will be chunk 0)
            await sendChunk(initResult.header, -1, totalChunks, fileId);
            // Process first chunk immediately as chunk 1
            const tag = totalChunks === 1 
                ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
                : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;

            const encryptedChunk = sodium.crypto_secretstream_xchacha20poly1305_push(
                state,
                chunk,
                null,
                tag
            );

            // Send first data chunk
            await sendChunk(encryptedChunk, 0, totalChunks, fileId);
            return {
                state,
                header: initResult.header
            };
        }

        // Skip empty chunks
        if (chunk.length === 0) {
            console.warn(`Skipping empty chunk: ${chunkNumber}/${totalChunks}`);
            return { state };
        }

        // Determine tag for subsequent chunks
        const tag = isFinal 
            ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
            : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;

        // Encrypt the chunk
        const encryptedChunk = sodium.crypto_secretstream_xchacha20poly1305_push(
            state,
            chunk,
            null,
            tag
        );

        // Send encrypted chunk
        await sendChunk(encryptedChunk, chunkNumber, totalChunks, fileId);

        // Calculate and report progress
        const progress = Math.floor((chunkNumber / totalChunks) * 100);
        progressCallback?.(progress);

        return { state };
    } catch (error) {
        console.error('Chunk encryption failed:', error);
        throw new Error(`Encryption failed: ${error.message}`);
    }
};

/**
 * This function is used to decrypt files already encrypted by encryptFile() using 4MB chunks, 
 * passing the parameters @encryptedBlob which is the encrypted file in a blob, 
 * @key the key that will decrypt the file, @header of the file needed to decrypt and 
 * the function @progressCallback that will send the decryption % to the worker
 * 
 * @param {Blob} encryptedBlob - The encrypted file to be decrypted.
 * @param {Uint8Array} key - The key used to decrypt the file.
 * @param {Uint8Array} header - The header of the file needed to decrypt.
 * @param {function} progressCallback - A callback function to follow the progress of decryption from web worker.
 */
export const decryptFile = async (encryptedBlob, key, header, progressCallback) => {
    await sodium.ready;
    const arrayBuffer = await encryptedBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
  
    const extractedHeader = uint8Array.slice(0, sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES);
    if (!sodium.memcmp(header, extractedHeader)) {
        throw new Error('Header mismatch! Encryption and decryption headers do not match.');
    }
  
    const state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(extractedHeader, key);
    const decryptedChunks = [];
    let offset = sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES;
    let tag = sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;
  
    const totalLength = uint8Array.length;
    const chunkSize = 1024 * 1024 * 4 + sodium.crypto_secretstream_xchacha20poly1305_ABYTES;

    for (let i = offset; i < totalLength; i += chunkSize) {
        const currentChunkSize = Math.min(totalLength - i, chunkSize);
        const chunk = uint8Array.slice(i, i + currentChunkSize);
        const result = sodium.crypto_secretstream_xchacha20poly1305_pull(state, chunk);
  
        if (!result) {
            throw new Error('Decryption failed for chunk');
        }
  
        decryptedChunks.push(result.message);
        tag = result.tag;
  
        const progress = Math.floor(((i + currentChunkSize) / totalLength) * 100);
        if (progressCallback && typeof progressCallback === 'function') {
            progressCallback(progress);
        }
  
        if (tag === sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL) break;
    }
  
    const blob = new Blob(decryptedChunks, { type: encryptedBlob.type });
    return URL.createObjectURL(blob);
};

export async function decryptWithChunks(data, state, key, header, baseChunkSize, isFinal) {
    await sodium.ready;
    const HEADERBYTES = sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES;
    const ABYTES = sodium.crypto_secretstream_xchacha20poly1305_ABYTES;
    const chunks = [];
    let bytesProcessed = 0;
    let currentData = data;
    let foundFinalTag = false;

    try {
        if (!(data instanceof Uint8Array)) {
            throw new Error("Invalid data format: expected Uint8Array");
        }
        if (!state) {
            if (!(header instanceof Uint8Array)) {
                throw new Error("Invalid header format: expected Uint8Array");
            }

            if (header.length !== HEADERBYTES) {
                throw new Error(`Header length mismatch: expected ${HEADERBYTES}, got ${header.length}`);
            }

            if (currentData.length >= HEADERBYTES) {
                const extractedHeader = currentData.slice(0, HEADERBYTES);
                if (!sodium.memcmp(header, extractedHeader)) {
                    throw new Error("Header mismatch!");
                }
                currentData = currentData.slice(HEADERBYTES);
            } else {
                throw new Error("Data does not contain enough bytes for the header");
            }

            state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, key);
        }

        const chunkSize = baseChunkSize + ABYTES;

        while (currentData.length >= chunkSize) {
            const chunk = currentData.slice(0, chunkSize);

            try {
                const decryptedResult = sodium.crypto_secretstream_xchacha20poly1305_pull(state, chunk, null);

                if (!decryptedResult || !decryptedResult.message) {
                    throw new Error("Invalid decryption result");
                }

                chunks.push(decryptedResult.message);
                bytesProcessed += decryptedResult.message.byteLength;
                currentData = currentData.slice(chunkSize);

                if (decryptedResult.tag === sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL) {
                    foundFinalTag = true;
                    console.log("[Libsodium] Found final tag");
                    break;
                }
            } catch (error) {
                console.error("[Libsodium] Error al procesar chunk:", { error, chunkLength: chunk.length, isFinal });
                throw new Error(`Chunk processing failed: ${error.message}`);
            }
        }

        if (!foundFinalTag && isFinal && currentData.length > 0) {
            try {
                const finalResult = sodium.crypto_secretstream_xchacha20poly1305_pull(state, currentData, null);
                
                if (finalResult && finalResult.message) {
                    chunks.push(finalResult.message);
                    bytesProcessed += finalResult.message.byteLength;
                    foundFinalTag = finalResult.tag === sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL;
                }
            } catch (error) {
                console.error("[Libsodium] Error en el último fragmento:", error);
                throw new Error("Final chunk processing failed");
            }
        }

        return {
            newChunks: chunks,
            remainingData: currentData,
            bytesProcessed,
            newState: state,
            foundFinalTag
        };
    } catch (error) {
        console.error("[Libsodium] Decryption error:", { error, bytesProcessed, remainingDataSize: currentData?.length, isFinal });
        throw error;
    }
}


export const encryptedThumbnail = async (thumbnailUint8Array, key) => {
    await sodium.ready;
    const { state: thumbnailState, header: thumbnailHeader } = sodium.crypto_secretstream_xchacha20poly1305_init_push(key);
      
    const encryptedThumbnailData = sodium.crypto_secretstream_xchacha20poly1305_push(
        thumbnailState,
        thumbnailUint8Array,
        null,
        sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
    );

    return new Blob([thumbnailHeader, encryptedThumbnailData], { type: 'image/png' })
}

export const decryptThumbnail = async (uint8Array, key) => {
    await sodium.ready;
    const header = uint8Array.slice(
      0,
      sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES
    );
    const encryptedData = uint8Array.slice(
      sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES
    );

    const keyUint8 = new Uint8Array(key);

    const state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(
      header,
      keyUint8
    );
    const { message, tag } =
      sodium.crypto_secretstream_xchacha20poly1305_pull(
        state,
        encryptedData,
        null
      );

    if (tag !== sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL) {
      throw new Error(
        `El archivo ${name} no contiene la etiqueta FINAL esperada.`
      );
    }

    const blob = new Blob([message]);
    return blob;
}

export const generateMasterKey = async () => {
    await sodium.ready;
    const masterKeyBytes = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);
    const masterKeyBase64 = sodium.to_base64(masterKeyBytes, sodium.base64_variants.ORIGINAL);
    return { masterKeyBase64, masterKeyBytes };
}

export const generateRecoveryKey = async () => {
    await sodium.ready;
    const recoveryKeyBytes = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);
    const recoveryKeyBase64 = sodium.to_base64(recoveryKeyBytes, sodium.base64_variants.ORIGINAL);
    return { recoveryKeyBase64, recoveryKeyBytes };
}

export const generateSalt = async () => {
    await sodium.ready;
    return sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
}

export const deriveKeyEncryption = async (password, salt) => {
    await sodium.ready;
    const keyEncryptionKey = sodium.crypto_pwhash(
        sodium.crypto_secretbox_KEYBYTES,
        password,
        salt,
        sodium.crypto_pwhash_OPSLIMIT_SENSITIVE,
        sodium.crypto_pwhash_MEMLIMIT_SENSITIVE,
        sodium.crypto_pwhash_ALG_ARGON2ID13
    );

    return keyEncryptionKey;
}

export const generateNonce = async () => {
    await sodium.ready;
    return sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
}


export const encryptKey = async (data, nonce, key) => {
    await sodium.ready;
    return sodium.crypto_secretbox_easy(data, nonce, key);
}