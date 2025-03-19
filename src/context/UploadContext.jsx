import React, { useState, createContext } from 'react';

export const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [upload, setUpload] = useState({
    state: false,
    content: [],
    filesProcessed: 0,
    totalProgress: 0,
    error: false
  });

  return (
    <UploadContext.Provider value={{
      upload, setUpload
    }}>
      {children}
    </UploadContext.Provider>
  );
};
