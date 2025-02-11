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
 * Generates a random key using the XChaCha20-Poly1305 algorithm.
 * @returns {Promise<Uint8Array>} The generated key as a Uint8Array.
 */
export const generateKey = async () => {
    await sodium.ready;
    return sodium.crypto_secretstream_xchacha20poly1305_keygen()
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
    const keyArray = new Uint8Array(key);
    const { state, header } = sodium.crypto_secretstream_xchacha20poly1305_init_push(keyArray);
    const encryptedData = sodium.crypto_secretstream_xchacha20poly1305_push(
        state,
        new TextEncoder().encode(text),
        null,
        sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
    );
    return sodium.to_base64(new Uint8Array([...header, ...encryptedData]));
};

/**
 * Decrypt strings using the decryptText(key, "3rtd-_1IPHbblT_j8Z9...") function,
 * using the XChaCha20-Poly1305 algorithm from libsodium.
 * @param {Uint8Array} key - The key used to decrypt the text base64.
 * @param {string} encryptedText - The encrypted text to be decrypted.
 * @returns {Promise<string>} The decrypted text.
 */
export const decryptText = async (key, encryptedText) => {
    await sodium.ready;
    const keyArray = new Uint8Array(key);
    const encryptedData = sodium.from_base64(encryptedText);
    const header = encryptedData.slice(0, sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES);
    const data = encryptedData.slice(sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES);
    const state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, keyArray);
    const { message, tag } = sodium.crypto_secretstream_xchacha20poly1305_pull(state, data, null);
    if (tag !== sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL) {
        throw new Error('El texto no contiene la etiqueta FINAL esperada.');
    }
    return new TextDecoder().decode(message);
}

/**
 *  This function is used to encrypt files, but is being used for photos and videos using 4MB Chunks,
 *  passing the @file parameter, @key and the @progressCallback function. 
 *  This will return the blob and header file already encrypted.
 *  
 *  @param {File} file - The file to be encrypted.
 *  @param {Uint8Array} key - The key used to encrypt the file.
 *  @param {function} progressCallback - A callback function to follow the progress of encryption from web worker.
 *  @returns {Promise<{ encryptedBlob: Blob, header: Uint8Array }>} The encrypted file as a Blob and the header as a Uint8Array.
 */
export const encryptFile = async (file, key, progressCallback) => {
    await sodium.ready;
    const chunkSize = 1024 * 1024 * 4
    const totalChunks = Math.ceil(file.size / chunkSize);
    const { state, header } = sodium.crypto_secretstream_xchacha20poly1305_init_push(key);
    const encryptedChunks = [header]; 
  
    for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        const arrayBuffer = await chunk.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
  
        const tag = i === totalChunks - 1
            ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
            : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;
  
        const encryptedChunk = sodium.crypto_secretstream_xchacha20poly1305_push(state, uint8Array, null, tag);
        encryptedChunks.push(encryptedChunk);

        const progress = Math.floor(((i + 1) / totalChunks) * 90);
        if (progressCallback && typeof progressCallback === 'function') {
            progressCallback(progress);
        }
    }
  
    return { encryptedBlob: new Blob(encryptedChunks, { type: file.type }), header };
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
    return URL.createObjectURL(blob);
}

export const generateMasterKey = async () => {
    await sodium.ready;
    const masterKeyBytes = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);
    const masterKeyBase64 = sodium.to_base64(masterKeyBytes);
    return { masterKeyBase64, masterKeyBytes };
}

export const generateRecoveryKey = async () => {
    await sodium.ready;
    const recoveryKeyBytes = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);
    const recoveryKeyBase64 = sodium.to_base64(recoveryKeyBytes);
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