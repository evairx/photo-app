import { useState, useEffect, useRef } from 'react';

const useCloseOutside = (initialState) => {
  const [open, setOpen] = useState(initialState);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      // Agregamos el event listener solo cuando `open` es true
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Limpiamos el event listener cuando el componente se desmonta o `open` cambia
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]); // Dependencia: `open`

  const toggleOpen = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return [ref, open, toggleOpen];
};

export default useCloseOutside;