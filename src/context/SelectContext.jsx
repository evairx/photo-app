import React, { createContext, useState } from 'react';

export const SelectContext = createContext();

export const SelectProvider = ({ children }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    return (
        <SelectContext.Provider value={{
            selectedFiles, setSelectedFiles
        }}>
            {children}
        </SelectContext.Provider>
    );
}