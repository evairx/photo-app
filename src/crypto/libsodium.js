import sodium from 'libsodium-wrappers-sumo';

/* 
*   This function converts a base64 string to a Uint8Array.
*/
export const toUint8Array = async (base64) => {
    await sodium.ready;
    return sodium.from_base64(base64);
}

export const toBase64 = async (uint8Array) => {
    await sodium.ready;
    return sodium.to_base64(uint8Array);
}

export const generateKey = async () => {
    await sodium.ready;
    return sodium.crypto_secretstream_xchacha20poly1305_keygen()
}

/*
*   This function encrypts a text using the XChaCha20-Poly1305 algorithm.
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

export const encryptFileInChunks = async (file, key, progressCallback) => {
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
        
        // Calcula el progreso y llama al callback si existe
        const progress = Math.floor(((i + 1) / totalChunks) * 90);
        if (progressCallback && typeof progressCallback === 'function') {
            progressCallback(progress);
        }
    }
  
    return { encryptedBlob: new Blob(encryptedChunks, { type: file.type }), header };
};
  
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