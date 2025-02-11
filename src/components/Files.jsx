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
  

  @media (max-width: 600px) {
    gap: .100rem;
  }
`

const Card = styled.div`
  width: 183px;
  height: 183px;
  position: relative;
  overflow: hidden; 
  background-color:rgb(43, 60, 97);

  ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) && `
    display: flex;
    justify-content: center;
    align-items: center;
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

const Figure = styled.figure`
  width: ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) ? '85%' : '100%'};
  height: ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) ? '85%' : '100%'};
  border-radius: ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) ? '1.5rem' : '0'};
  overflow: hidden;
  transition: ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) ? 'all .300s' : 'none'};

  img {
    width: 100%;
    height: 100%;
    transition: transform .400s;
    object-fit: cover;
    object-position: center;
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
  background-color: ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) ? 'rgb(43, 60, 97)' : 'transparent'};
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  opacity: ${({ selectedFiles, idParams }) => 
    selectedFiles.includes(idParams) ? 1 : 0.5}; // Cambia la opacidad según el id
  transition: all .300s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`

const OverLay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.25);
  width: 100%;
  height: 100%;
  transition: all .400s;
  z-index:22
`

const Info = styled.div`
  position: absolute;
  top: .600rem;
  right: .600rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: .400rem;
  z-index: 999;
  display: ${({ selectedFiles, idParams }) => selectedFiles.includes(idParams) ? 'none' : 'flex'};
`

const Duration = styled.p`
  color: #fff;
  font-size: .9850rem;
  font-weight: 600;
  margin-bottom: 2px;
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
  color: rgba(255, 255, 255, 0.82);
  font-size: 1.060rem;
  font-weight: 600;
  padding: .600rem 0;
  display: flex;
  align-items: center;
  gap: .400rem;

  @media (max-width: 600px) {
    padding: .900rem 1.600rem;
  }
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

const Files = () => {
  const [decryptedFiles, setDecryptedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedFiles, setSelectedFiles} = useContext(SelectContext);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const didFetchRef = useRef(false);
  const touchTimerRef = useRef(null);
  const libsodiumRef = useRef(null);

  useEffect(() => {
    libsodiumRef.current = new Worker(
      new URL('../workers/libsodiumWorker.js', import.meta.url), 
      { type: 'module' }
    );

    const decryptThumbnails = async () => {
      if (didFetchRef.current) return;
      didFetchRef.current = true;

      const decryptedResults = [];

      for (const { id, name, userId ,key, type, duration, date } of fileData) {
        try {

          const keyUint = await new Promise((res, rej) => {
            libsodiumRef.current.onmessage = ({ data }) => 
              data.type === 'toUint8Array' ? res(data.data) : rej(data.error);
            libsodiumRef.current.postMessage({ type: 'toUint8Array', data: { base64: key } });
          });

          const nameDecrypted = await new Promise((res, rej) => {
            libsodiumRef.current.onmessage = ({ data }) => 
              data.type === 'decryptText' ? res(data.data) : rej(data.error);
            libsodiumRef.current.postMessage({ type: 'decryptText', data: { key: keyUint, encryptedText: name } });
          });

          const response = await fetch(`http://192.168.1.2:3000/get?id=${userId}&album=thumbnails&file=${nameDecrypted}.webp`);
          const arrayBuffer = await response.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);

          const decryptedThumbnailUrl = await new Promise((res, rej) => {
            libsodiumRef.current.onmessage = ({ data }) => 
              data.type === 'decryptThumbnail' ? res(data.data) : rej(data.error);
            libsodiumRef.current.postMessage({ type: 'decryptThumbnail', data: { thumbnailUint8Array: uint8Array, thumbnailKey: keyUint } });
          });

          decryptedResults.push({
            id,
            decryptedThumbnailUrl,
            name: nameDecrypted,
            type,
            duration,
            date
          });
        } catch (error) {
          console.error(`Error desencriptando el thumbnail de ${name}:`, error);
        }
      }

      setDecryptedFiles(decryptedResults);
      
      setLoading(false);

      return () => {
        if (libsodiumRef.current) {
          libsodiumRef.current.terminate();
          libsodiumRef.current = null;
        }
      };
    };

    decryptThumbnails();
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
                {!isMobile && selectedFiles.length > 0 && <input
                  type="checkbox"
                  checked={groupedByDate[date].every(({ id }) => selectedFiles.includes(id))}
                  readOnly
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
                {groupedByDate[date].map(({ id, name, decryptedThumbnailUrl, type, duration }) => (
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
                        >
                          <SelectSvg color={selectedFiles.includes(id) ? 'rgb(2, 120, 255)': '#fff'}/>
                        </ButtonCheck>
                      </HeaderCard>
                       <OverLay />
                      {type === "video" && (
                        <Info
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
                          <img
                            src={decryptedThumbnailUrl}
                            alt={`Thumbnail de ${name}`}
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
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
    <path
      fill="#fff"
      d="m10 16.5 6-4.5-6-4.5v9ZM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Z"
    />
  </svg>
)

const SelectSvg = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
    <path
      fill={color}
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9Z"
    />
  </svg>
)