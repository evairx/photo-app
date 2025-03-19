import React, { useState, useEffect } from 'react';
import sodium from 'libsodium-wrappers-sumo';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingRecoveryKey, setIsUsingRecoveryKey] = useState(false);

  useEffect(() => {
    const initSodium = async () => {
      await sodium.ready;
      setIsLoading(false);
    };
    initSodium();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Note: In a real application, you would fetch these values from your backend
      const saltBase64 = "zvC5Q7iQHcJljIIdffJ7qw";
      const nonceBase64 = "Fi9JmvCRwxgrOgXGmD_U7NASPdPHZiC3";
      const encryptedMasterKey = "SEIzGatnyLACkQbwwxNm4JiHjG_Tt78vog-3SltmVC4F0rt86jVhtPmfjGPYvHJ8";
      const recoveryKeyNonce = "9C7XS4ZHvNguv2eLpnaFDrcrWxPejHs3"; // Add your stored recovery key nonce here
      const encryptedMasterKeyRecovery = "XoBD3zl2aHYiyhNAVp3Fde3JgJGR0aTl9cABgWSCCS5nVF6FfK3kz8WfiJ901NPB"; // Add your stored encrypted master key recovery here
    
      const salt = sodium.from_base64(saltBase64);
      const nonce = sodium.from_base64(nonceBase64);

      let decryptedMasterKeyBytes;

      if (isUsingRecoveryKey) {
        try {
          const recoveryKeyBytes = sodium.from_base64(password);
          const recoveryKeyNonceBytes = sodium.from_base64(recoveryKeyNonce); // Add this line
          decryptedMasterKeyBytes = sodium.crypto_secretbox_open_easy(
            sodium.from_base64(encryptedMasterKeyRecovery),
            recoveryKeyNonceBytes, // Use the converted nonce
            recoveryKeyBytes
          );
        } catch (error) {
          console.error('Recovery key error:', error);
          throw new Error('Invalid recovery key');
        }
      } else {
        const keyEncryptionKey = sodium.crypto_pwhash(
          sodium.crypto_secretbox_KEYBYTES,
          password,
          salt,
          sodium.crypto_pwhash_OPSLIMIT_SENSITIVE,
          sodium.crypto_pwhash_MEMLIMIT_SENSITIVE,
          sodium.crypto_pwhash_ALG_ARGON2ID13
        );

        decryptedMasterKeyBytes = sodium.crypto_secretbox_open_easy(
          sodium.from_base64(encryptedMasterKey),
          nonce,
          keyEncryptionKey
        );
      }

      console.log({
        username,
        decryptedMasterKey: sodium.to_base64(decryptedMasterKeyBytes)
      });

    } catch (error) {
      console.error('Error during decryption:', error);
      alert(error.message || 'Invalid password/recovery key or decryption error');
    }
  };

  if (isLoading) {
    return <div>Loading encryption library...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
            <label style={{ display: 'block', marginBottom: '5px' }}>
              {isUsingRecoveryKey ? 'Recovery Key:' : 'Password:'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>
              <input
                type="checkbox"
                checked={isUsingRecoveryKey}
                onChange={(e) => setIsUsingRecoveryKey(e.target.checked)}
              />
              Use Recovery Key
            </label>
          </div>
          <button 
            type="submit"
            style={{
              background: '#28a745',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;