import React, { useState, useEffect, useRef } from 'react';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const libsodiumRef = useRef(null);

  useEffect(() => {
    libsodiumRef.current = new Worker(
      new URL('../workers/libsodiumWorker.js', import.meta.url), 
      { type: 'module' }
    );

    return () => {
      if (libsodiumRef.current) {
          libsodiumRef.current.terminate();
          libsodiumRef.current = null;
      }
   };
  } , []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { masterKeyBytes } = await new Promise((res, rej) => {
        libsodiumRef.current.onmessage = ({ data }) => 
            data.type === 'generateMasterKey' ? res(data.data) : rej(data.error);
        libsodiumRef.current.postMessage({ type: 'generateMasterKey' });
      });

      const { recoveryKeyBytes } = await new Promise((res, rej) => {
        libsodiumRef.current.onmessage = ({ data }) => 
            data.type === 'generateRecoveryKey' ? res(data.data) : rej(data.error);
        libsodiumRef.current.postMessage({ type: 'generateRecoveryKey' });
      });

      const salt = await new Promise((res, rej) => {
        libsodiumRef.current.onmessage = ({ data }) => 
            data.type === 'generateSalt' ? res(data.data) : rej(data.error);
        libsodiumRef.current.postMessage({ type: 'generateSalt' });
      });

      const keyEncryptionKey =  await new Promise((res, rej) => {
        libsodiumRef.current.onmessage = ({ data }) => 
            data.type === 'deriveKeyEncryption' ? res(data.data) : rej(data.error);
        libsodiumRef.current.postMessage({ type: 'deriveKeyEncryption', data: { password, salt } });
      });

      const nonce = await new Promise((res, rej) => {
        libsodiumRef.current.onmessage = ({ data }) => 
            data.type === 'generateNonce' ? res(data.data) : rej(data.error);
        libsodiumRef.current.postMessage({ type: 'generateNonce' });
      });

      const recoveryNonce = await new Promise((res, rej) => {
        libsodiumRef.current.onmessage = ({ data }) => 
            data.type === 'generateNonce' ? res(data.data) : rej(data.error);
        libsodiumRef.current.postMessage({ type: 'generateNonce' });
      });

      const encryptedMasterKey = await new Promise((res, rej) => {
        libsodiumRef.current.onmessage = ({ data }) => 
            data.type === 'encryptKey' ? res(data.data) : rej(data.error);
        libsodiumRef.current.postMessage({ type: 'encryptKey', data: { keyEncryption: masterKeyBytes, nonce, key: keyEncryptionKey } });
      });

      const encryptedMasterKeyBase64 = await new Promise((res, rej) => {
        libsodiumRef.current.onmessage = ({ data }) => 
            data.type === 'toBase64' ? res(data.data) : rej(data.error);
        libsodiumRef.current.postMessage({ type: 'toBase64', data: { uint8Array: encryptedMasterKey } });
      });


      const encryptedMasterKeyRecovery = await new Promise((res, rej) => {
        libsodiumRef.current.onmessage = ({ data }) => 
            data.type === 'encryptKey' ? res(data.data) : rej(data.error);
        libsodiumRef.current.postMessage({ type: 'encryptKey', data: { keyEncryption: masterKeyBytes, nonce: recoveryNonce, key: recoveryKeyBytes } });
      });

      const encryptedMasterKeyRecoveryBase64 = await new Promise((res, rej) => {
        libsodiumRef.current.onmessage = ({ data }) => 
            data.type === 'toBase64' ? res(data.data) : rej(data.error);
        libsodiumRef.current.postMessage({ type: 'toBase64', data: { uint8Array: encryptedMasterKeyRecovery } });
      });

      // Convert salt and nonces to Base64
      const saltBase64 = await new Promise((res, rej) => {
        libsodiumRef.current.onmessage = ({ data }) => 
            data.type === 'toBase64' ? res(data.data) : rej(data.error);
        libsodiumRef.current.postMessage({ type: 'toBase64', data: { uint8Array: salt } });
      });

      const nonceBase64 = await new Promise((res, rej) => {
        libsodiumRef.current.onmessage = ({ data }) => 
            data.type === 'toBase64' ? res(data.data) : rej(data.error);
        libsodiumRef.current.postMessage({ type: 'toBase64', data: { uint8Array: nonce } });
      });

      const recoveryNonceBase64 = await new Promise((res, rej) => {
        libsodiumRef.current.onmessage = ({ data }) => 
            data.type === 'toBase64' ? res(data.data) : rej(data.error);
        libsodiumRef.current.postMessage({ type: 'toBase64', data: { uint8Array: recoveryNonce} });
      });

      // This data should be sent to your backend to store in the database
      console.log({
        username,
        password,
        masterKey: encryptedMasterKeyBase64,
        recoveryKey: encryptedMasterKeyRecoveryBase64,
        salt: saltBase64,
        nonce: nonceBase64,
        recoveryNonce: recoveryNonceBase64
      });

      setLoading(false);

    } catch (error) {
      console.error('Error during encryption:', error);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>Create User</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button 
            type="submit"
            style={{
              background: '#007bff',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Loading...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;