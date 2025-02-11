import React, { useState, createContext } from 'react';

export const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [state, setState] = useState('');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [uploadError, setUploadError] = useState(false);
  const [finishedUpload , setFinishedUpload] = useState(false);

  return (
    <UploadContext.Provider value={{
      state, setState,
      progress, setProgress,
      fileName, setFileName,
      uploadError, setUploadError,
      finishedUpload, setFinishedUpload
    }}>
      {children}
    </UploadContext.Provider>
  );
};
