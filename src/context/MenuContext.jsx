import React, { createContext } from 'react';
import useCloseOutside from '../hook/useCloseOutside';

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const [refOpen, open, toggleOpen] = useCloseOutside(false);
    
    return (
        <MenuContext.Provider value={{
            refOpen, open, toggleOpen
        }}>
            {children}
        </MenuContext.Provider>
    );
}