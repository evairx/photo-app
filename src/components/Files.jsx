import React, { useEffect, useState, useRef, useContext } from "react";
import { SelectContext } from "../context/SelectContext";
import { NavLink } from "react-router-dom";
import useMediaQuery from "@/hook/useMediaQuery";
import fileData from "../../data.json";

import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 1008px) {
    gap: .700rem;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0;
  }

  
  @keyframes skeleton-loadings {
    0% {
      background-color: var(--skeleton-color);
      opacity: 0.2;
    }

    100% {
      background-color: var(--skeleton-color-100);
      opacity: 0.3;
    }
  }
`

const ContentCard = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: .700rem;
  margin-bottom: 1.5rem;
  

  @media (max-width: 600px) {
    gap: .100rem;
  }
`

const Card = styled.div`
  width: 183px;
  height: 183px;
  position: relative;
  padding: .100rem;
  overflow: hidden;
  border-radius: 5px;
  border: 2px solid transparent;
  transition: border-color .500s;

  ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) && `
    display: flex;
    justify-content: center;
    align-items: center;
    background-color:rgba(255, 255, 255, 0.07);
  `}

  &:hover > figure > picture > img{
    transform: ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) ? 'scale(1)' : 'scale(1.1)'};

    @media (max-width: 790px) {
      transform: scale(1);
    }
  }

  &:hover > div {
    opacity: 1;
  }

  &:hover {
    border-color: ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) ? 'transparent' : 'rgb(255, 255, 255)'};
  }

  @media (max-width: 1008px) {
    width: 160px;
    height: 160px;
  }

  @media (max-width: 790px) {
    width: 148px;
    height: 148px;
  }

  @media (max-width: 600px) {
    width: 180px;
    height: 185px;

    // disable all hover
    &:hover > figure > picture > img{
      transform: scale(1);
    }
  
  }

  @media (max-width: 430px) {
    width: 142.2px;
    height: 142.2px;
  }

  @media (max-width: 414px) {
    width: 126.2px;
    height: 126.2px;
  }

  @media (max-width: 412px) {
    width: 135.9px;
    height: 135.9px;
  }

  @media (max-width: 390px) {
    width: 128.9px;
    height: 128.9px;
  }

  @media (max-width: 375px) {
    width: 112.5px;
    height: 112.5px;
  }

  @media (max-width: 360px) {
    width: 118.9px;
    height: 118.9px;
  }
`

const Figure = styled.figure`
  width: ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) ? '85%' : '100%'};
  height: ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) ? '85%' : '100%'};
  overflow: hidden;
  transition: ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) ? 'all .300s' : 'none'};
  
  ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) && `
    border: 2px solid #fff;
  `}

  img {
    width: 100%;
    height: 100%;
    transition: transform .400s;
    object-fit: cover;
    object-position: center;
    user-drag: none; /* Evita que la imagen sea arrastrable */
    pointer-events: none; /* Evita la interacción con el puntero */
    user-select: none; /* Evita que se seleccione la imagen */
    -webkit-user-drag: none; /* Para compatibilidad con navegadores WebKit */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
`


const HeaderCard = styled.div`
  position: absolute;
  top:0;
  right:0;
  z-index: 999;
  width: 100%;
  height: 30%;
  background: ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) ? 'transparent' : 'linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.56) 50%,rgba(0, 0, 0, 0.86) 90%)'};
  padding: .500rem;
  opacity: ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) ? 1 : 0};
  transition: all .300s;
`

const ButtonCheck = styled.button`
  background-color: ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) ? 'rgb(44, 44, 44)' : 'transparent'};
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: all .300s;
  cursor: pointer;
  width: 24px;
  height: 24px;
  background-image: ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) ? 
    `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_440_21)'%3E%3Cpath d='M8.56002 3.68994C7.4681 4.14193 6.47588 4.80454 5.64001 5.63994' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M3.69 8.56006C3.23656 9.65036 3.0021 10.8192 3 12.0001' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M3.69 15.4399C4.14199 16.5319 4.8046 17.5241 5.64 18.3599' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M8.56 20.3101C9.6503 20.7635 10.8192 20.998 12 21.0001' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M15.44 20.31C16.5319 19.858 17.5241 19.1954 18.36 18.36' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M20.31 15.44C20.7634 14.3497 20.9979 13.1808 21 12' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M20.31 8.56002C19.858 7.4681 19.1954 6.47588 18.36 5.64001' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M15.44 3.69C14.3497 3.23656 13.1808 3.0021 12 3' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='12' cy='12' r='7' fill='%23D9D9D9'/%3E%3Cpath d='M9 12L11 14L15 10' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_440_21'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A")`
    : 
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' class='icon icon-tabler icons-tabler-outline icon-tabler-circle-dashed-check'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M8.56 3.69a9 9 0 0 0 -2.92 1.95' /%3E%3Cpath d='M3.69 8.56a9 9 0 0 0 -.69 3.44' /%3E%3Cpath d='M3.69 15.44a9 9 0 0 0 1.95 2.92' /%3E%3Cpath d='M8.56 20.31a9 9 0 0 0 3.44 .69' /%3E%3Cpath d='M15.44 20.31a9 9 0 0 0 2.92 -1.95' /%3E%3Cpath d='M20.31 15.44a9 9 0 0 0 .69 -3.44' /%3E%3Cpath d='M20.31 8.56a9 9 0 0 0 -1.95 -2.92' /%3E%3Cpath d='M15.44 3.69a9 9 0 0 0 -3.44 -.69' /%3E%3Cpath d='M9 12l2 2l4 -4' /%3E%3C/svg%3E")`}};
  background-repeat: no-repeat;
  background-position: 55% calc(50% - 0px);

  .button-check:hover {
    opacity: 1;
    background-repeat: no-repeat;
    background-position: 55% calc(50% - 0px);
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_440_21)'%3E%3Cpath d='M8.56002 3.68994C7.4681 4.14193 6.47588 4.80454 5.64001 5.63994' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M3.69 8.56006C3.23656 9.65036 3.0021 10.8192 3 12.0001' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M3.69 15.4399C4.14199 16.5319 4.8046 17.5241 5.64 18.3599' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M8.56 20.3101C9.6503 20.7635 10.8192 20.998 12 21.0001' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M15.44 20.31C16.5319 19.858 17.5241 19.1954 18.36 18.36' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M20.31 15.44C20.7634 14.3497 20.9979 13.1808 21 12' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M20.31 8.56002C19.858 7.4681 19.1954 6.47588 18.36 5.64001' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M15.44 3.69C14.3497 3.23656 13.1808 3.0021 12 3' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='12' cy='12' r='7' fill='%23D9D9D9'/%3E%3Cpath d='M9 12L11 14L15 10' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_440_21'%3E%3Crect width='24' height='24' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
  }
`

const Info = styled.span`
  position: absolute;
  background: rgba(0, 0, 0, 0.47);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  padding: .200rem .600rem;
  bottom:.300rem;
  right:.200rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: .400rem;
  z-index: 999;
  display: ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) ? 'none' : 'flex'};
  animation: fadeIn .600s;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const Duration = styled.p`
  color: #fff;
  font-size: .8850rem;
  font-weight: 600;
`

const ImageLoading = styled.div`
  opacity: 0.7;
  animation: skeleton-loadings .5s linear infinite alternate;
  width: 183px;
  height: 183px;
  background-color: var(--skeleton-color);

  @media (max-width: 1008px) {
    width: 160px;
    height: 160px;
  }

  @media (max-width: 790px) {
    width: 148px;
    height: 148px;
  }

  @media (max-width: 600px) {
    width: 180px;
    height: 185px;
  
  }

  @media (max-width: 430px) {
    width: 142.2px;
    height: 142.2px;
  }

  @media (max-width: 414px) {
    width: 136.9px;
    height: 136.9px;
  }

  @media (max-width: 412px) {
    width: 135.9px;
    height: 135.9px;
  }

  @media (max-width: 390px) {
    width: 128.9px;
    height: 128.9px;
  }

  @media (max-width: 375px) {
    width: 123.5px;
    height: 123.5px;
  }

  @media (max-width: 360px) {
    width: 118.9px;
    height: 118.9px;
  }
`

const DateTitle = styled.span`
  color: rgba(216, 213, 213, 0.82);
  font-size: 1.060rem;
  font-weight: 600;
  margin-bottom: .600rem;
  display: flex;
  align-items: center;
  gap: .400rem;
`

const DataTitleLoading = styled.div`
  opacity: 0.7;
  animation: skeleton-loadings .5s linear infinite alternate;
  width: 120px;
  height: 20px;
  background-color: var(--skeleton-color);
  margin: .600rem 0;

  @media (max-width: 600px) {
    margin: .900rem 1.600rem;
  }
`

const SelectBtn = styled.button`
  background-color: transparent;
  border: none;
  margin-top: .050rem;
  width: 24px;
  height: 24px;
  background-image: ${({ checked })=> checked ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='icon icon-tabler icons-tabler-outline icon-tabler-deselect'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12 8h3a1 1 0 0 1 1 1v3' /%3E%3Cpath d='M16 16h-7a1 1 0 0 1 -1 -1v-7' /%3E%3Cpath d='M12 20v.01' /%3E%3Cpath d='M16 20v.01' /%3E%3Cpath d='M8 20v.01' /%3E%3Cpath d='M4 20v.01' /%3E%3Cpath d='M4 16v.01' /%3E%3Cpath d='M4 12v.01' /%3E%3Cpath d='M4 8v.01' /%3E%3Cpath d='M8 4v.01' /%3E%3Cpath d='M12 4v.01' /%3E%3Cpath d='M16 4v.01' /%3E%3Cpath d='M20 4v.01' /%3E%3Cpath d='M20 8v.01' /%3E%3Cpath d='M20 12v.01' /%3E%3Cpath d='M20 16v.01' /%3E%3Cpath d='M3 3l18 18' /%3E%3C/svg%3E")`: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='icon icon-tabler icons-tabler-outline icon-tabler-select-all'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M8 8m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z' /%3E%3Cpath d='M12 20v.01' /%3E%3Cpath d='M16 20v.01' /%3E%3Cpath d='M8 20v.01' /%3E%3Cpath d='M4 20v.01' /%3E%3Cpath d='M4 16v.01' /%3E%3Cpath d='M4 12v.01' /%3E%3Cpath d='M4 8v.01' /%3E%3Cpath d='M4 4v.01' /%3E%3Cpath d='M8 4v.01' /%3E%3Cpath d='M12 4v.01' /%3E%3Cpath d='M16 4v.01' /%3E%3Cpath d='M20 4v.01' /%3E%3Cpath d='M20 8v.01' /%3E%3Cpath d='M20 12v.01' /%3E%3Cpath d='M20 16v.01' /%3E%3Cpath d='M20 20v.01' /%3E%3C/svg%3E")`};
  background-repeat: no-repeat;
  background-position: 50% 50%;
  cursor: pointer;
  transition: all .300s;
  opacity: ${({ checked })=> checked ? 1 : .5};
  animation: fadeIn .800s;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: .5;
    }
  }


  &:hover {
    opacity: 1;
  }
`

const Files = () => {
  const [decryptedFiles, setDecryptedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedFiles, setSelectedFiles } = useContext(SelectContext);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const didFetchRef = useRef(false);
  const touchTimerRef = useRef(null);
  const libsodiumRef = useRef(null);
  const blobUrlsRef = useRef([]);

  
  useEffect(() => {
    libsodiumRef.current = new Worker(
      new URL('../workers/libsodiumWorker.js', import.meta.url), 
      { type: 'module' }
    );

    const decryptThumbnails = async () => {
      if (didFetchRef.current) return;
      didFetchRef.current = true;
    
      const decryptedResults = [];
    
      for (const { id, name, userId, key, type, duration, date } of fileData) {
        try {
          // Verificar si la miniatura ya está en el Cache Storage
          const cachedThumbnail = await caches.match(id);
          if (cachedThumbnail) {

            const cachedArrayBuffer = await cachedThumbnail.arrayBuffer();
            const uint8Array = new Uint8Array(cachedArrayBuffer);
    
            // Convert key to Uint8Array
            const keyUint = await new Promise((res, rej) => {
              libsodiumRef.current.onmessage = ({ data }) =>
                data.type === 'toUint8Array' ? res(data.data) : rej(data.error);
              libsodiumRef.current.postMessage({ type: 'toUint8Array', data: { base64: key } });
            });
    
            // Desencriptar la miniatura desde el cache
            const decryptedThumbnail = await new Promise((res, rej) => {
              libsodiumRef.current.onmessage = ({ data }) =>
                data.type === 'decryptThumbnail' ? res(data.data) : rej(data.error);
              libsodiumRef.current.postMessage({
                type: 'decryptThumbnail',
                data: { thumbnailUint8Array: uint8Array, thumbnailKey: keyUint },
              });
            });

            const decryptTitle = await new Promise((res, rej) => {
              libsodiumRef.current.onmessage = ({ data }) =>
                data.type === 'decryptText' ? res(data.data) : rej(data.error);
              libsodiumRef.current.postMessage({
                type: 'decryptText',
                data: { key: keyUint, encryptedText: name },
              });
            });
    
            // Crear URL Blob a partir de la miniatura desencriptada
            const blob = new Blob([decryptedThumbnail], { type: 'image/webp' });
            const thumbnailUrl = URL.createObjectURL(blob);
    
            decryptedResults.push({
              id,
              thumbnailUrl,
              decryptTitle,
              type,
              duration,
              date,
            });
    
            continue;
          }
    
          // Fetch encrypted thumbnail (si no está en el cache)
          console.log('get miniature server');  // Log cuando obtenemos desde el servidor
    
          const response = await fetch(`http://localhost:3000/get?id=${userId}&album=thumbnails&file=${id}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const arrayBuffer = await response.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
    
          // Convert key to Uint8Array
          const keyUint = await new Promise((res, rej) => {
            libsodiumRef.current.onmessage = ({ data }) =>
              data.type === 'toUint8Array' ? res(data.data) : rej(data.error);
            libsodiumRef.current.postMessage({ type: 'toUint8Array', data: { base64: key } });
          });
    
          // Desencriptar la miniatura
          const decryptedThumbnail = await new Promise((res, rej) => {
            libsodiumRef.current.onmessage = ({ data }) =>
              data.type === 'decryptThumbnail' ? res(data.data) : rej(data.error);
            libsodiumRef.current.postMessage({
              type: 'decryptThumbnail',
              data: { thumbnailUint8Array: uint8Array, thumbnailKey: keyUint },
            });
          });

          const decryptTitle = await new Promise((res, rej) => {
            libsodiumRef.current.onmessage = ({ data }) =>
              data.type === 'decryptText' ? res(data.data) : rej(data.error);
            libsodiumRef.current.postMessage({
              type: 'decryptText',
              data: { key: keyUint, encryptedText: name },
            });
          });
    
          // Crear URL Blob a partir de la miniatura desencriptada
          const blob = new Blob([decryptedThumbnail], { type: 'image/webp' });
          const thumbnailUrl = URL.createObjectURL(blob);
    
          // Guardar la miniatura encriptada en Cache Storage
          const cache = await caches.open('thumbnails');
          const request = new Request(id); // Usamos el ID como clave
          const responseBlob = new Response(arrayBuffer); // Guardamos el ArrayBuffer en lugar del Blob
          cache.put(request, responseBlob);
    
          decryptedResults.push({
            id,
            thumbnailUrl,
            decryptTitle,
            type,
            duration,
            date,
          });
        } catch (error) {
          console.error(`Error decrypting thumbnail for ${name}:`, error);
        }
      }
    
      setDecryptedFiles(decryptedResults);
      setLoading(false);
    };

    decryptThumbnails();

    // Cleanup function
    return () => {
      // Revoke all blob URLs
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      blobUrlsRef.current = [];

      // Terminate web worker
      if (libsodiumRef.current) {
        libsodiumRef.current.terminate();
        libsodiumRef.current = null;
      }
    };
  }, []);

  const handleSelectFile = (e, id) => {
    if (e?.preventDefault) e.preventDefault();
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((fileId) => fileId !== id)
        : [...prevSelected, id]
    );
  };

  const handleTouchStart = (e, id) => {
    if (!selectedFiles.length) {
      touchTimerRef.current = setTimeout(() => {
        handleSelectFile(null, id);
      }, 500);
    }
  };
  
  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
    }
  };
  
  const handleTouchMove = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
    }
  };

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const timeString = h > 0 
        ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` 
        : `${m}:${String(s).padStart(2, '0')}`;

    return timeString;
  }
  
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const diffInMs = today.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0);
    const diffInDays = Math.floor(diffInMs / (1000 * 3600 * 24));

    if (diffInDays === 0) {
        return 'Hoy';
    } else if (diffInDays === 1) {
        return 'Ayer';
    } else if (diffInDays === 2) {
        return date.toLocaleDateString('es-ES', { weekday: 'long' });
    } else if (diffInDays <= 6) {
        return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }) + '.';
    } else if (date.getFullYear() === today.getFullYear()) {
        return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }) + '.';
    } else {
        return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    }
  }

  const groupedByDate = decryptedFiles.reduce((acc, file) => {
    const dateOnly = file.date.split(' ')[0];
    if (!acc[dateOnly]) acc[dateOnly] = [];
    acc[dateOnly].push(file);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort((a, b) =>
    Math.abs(new Date(a) - new Date()) - Math.abs(new Date(b) - new Date())
  );

  return (
    <Container>
      {loading ? (
        <>
          <div>
            <DataTitleLoading/>
            <ContentCard>
              {Array.from({ length: fileData.length }).map((_, index) => (
                <ImageLoading key={index} />
              ))}
            </ContentCard>
          </div>
        </>
      ) : (
        <>
          {sortedDates.map((date) => (
            <div key={date}>
              <DateTitle>
                {!isMobile && selectedFiles.length > 0 && 
                  <SelectBtn
                    aria-label="select"
                    aria-pressed={groupedByDate[date].every(({ id }) => selectedFiles.includes(id))}
                    checked={groupedByDate[date].every(({ id }) => selectedFiles.includes(id))}
                    onClick={() => {
                      const filesFromSameDate = groupedByDate[date].map(({ id }) => id);
    
                      setSelectedFiles((prevSelected) => {
                        const isAllSelected = filesFromSameDate.every((id) => prevSelected.includes(id));
    
                        if (isAllSelected) {
                          return prevSelected.filter((id) => !filesFromSameDate.includes(id));
                        } else {
                          return Array.from(new Set([...prevSelected, ...filesFromSameDate]));
                        }
                      });
                    }}
                  />}
                {formatDate(groupedByDate[date][0].date)}
              </DateTitle>
              <ContentCard
                selectedFiles={selectedFiles}
                idParams={groupedByDate[date][0].id}
              >
                {groupedByDate[date].map(({ id,decryptTitle, thumbnailUrl, type, duration }) => (
                  <NavLink 
                    to={`/photo/${id}`} 
                    viewTransition
                    key={id}
                    onClick={(e) => {
                      if (selectedFiles.length > 0) handleSelectFile(e, id);
                    }}
                    onTouchStart={(e) => handleTouchStart(e, id)}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchMove}
                  >
                    <Card
                      idParams={id}
                      selectedFiles={selectedFiles}
                    >
                      <HeaderCard
                        selectedFiles={selectedFiles}
                        idParams={id}
                      >
                        <ButtonCheck 
                          selectedFiles={selectedFiles}
                          idParams={id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectFile(e, id);
                          }}
                          className="button-check"
                        />
                      </HeaderCard>
                      {type === "video" && (
                        <Info
                          role="group"
                          selectedFiles={selectedFiles}
                          idParams={id}
                        >
                          <Duration>{formatTime(duration)}</Duration>
                          <PlaySvg />
                        </Info>
                      )}
                      <Figure
                        idParams={id}
                        selectedFiles={selectedFiles}
                      >
                        <picture>
                          <source
                            srcSet={thumbnailUrl}
                            type="image/webp"
                          />
                          <img
                            src={thumbnailUrl}
                            alt={decryptTitle}
                            loading="lazy"
                          />
                        </picture>
                      </Figure>
                    </Card>
                  </NavLink>
                ))}
              </ContentCard>
            </div>
          ))}
        </>
      )}
    </Container>
  );
};

export default Files;

const PlaySvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={21}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm-1.306-6.154 4.72-2.787c.781-.462.781-1.656 0-2.118l-4.72-2.787C9.934 7.706 9 8.29 9 9.214v5.573c0 .923.934 1.507 1.694 1.059Z"
      clipRule="evenodd"
    />
  </svg>
)