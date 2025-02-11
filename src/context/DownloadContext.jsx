import React, { createContext, useState } from 'react';

export const DownloadContext = createContext();

export const DownloadProvider = ({ children }) => {
    const [downloads, setDownloads ] = useState([]);
    const [downloading, setDownloading ] = useState(false);
    const [cancelDownload, setCancelDownload] = useState(false);

    return (
        <DownloadContext.Provider value={{
            downloads, setDownloads,
            downloading, setDownloading,
            cancelDownload, setCancelDownload
        }}>
            {children}
        </DownloadContext.Provider>
    );
}