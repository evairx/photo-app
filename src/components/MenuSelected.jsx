import React, { useContext,useRef, useEffect } from 'react'
import { SelectContext } from '@/context/SelectContext';
import { DownloadContext } from '@/context/DownloadContext';
import { toUint8Array , decryptText } from '@/crypto/libsodium';
import fileData from '../../data.json'
import useMediaQuery from '@/hook/useMediaQuery'
import * as Style from '@/ui/Menus/menuSelected'

import { CloseSvg, TrashSvg, HiddenSvg, DownloadSvg, FavoriteSvg } from '@/ui/icons'

export default function MenuSelected() {
    const { selectedFiles, setSelectedFiles } = useContext(SelectContext);
    const { setDownloads, downloading, setDownloading } = useContext(DownloadContext);
    const isMobile = useMediaQuery('(max-width: 600px)')
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
    }, []); 
    

    const handleDelete = () => {
        console.log('Delete items:', selectedFiles)
    }

    const DecryptAndDownloadItem = async () => {
        setDownloading(true);
        let filesProcessedCount = 0;
        
        const progressData = await Promise.all(
            selectedFiles.map(async (id) => {
                const file = fileData.find(item => item.id === id);
                if (!file) return null;
    
                const key = await toUint8Array(file.key);
                const filename = await decryptText(key, file.name);
    
                return {
                    id,
                    filename,
                    decryptProgress: 0,
                    fetchProgress: 0,
                    url: null
                };
            })
        );
    
        setDownloads({ progressData, filesProcessed: filesProcessedCount, totalPercentage: 0 });
    
        const updateTotalPercentage = () => {
            const totalProgress = progressData.reduce((acc, file) => {
                const fileProgress = (file.fetchProgress + file.decryptProgress) / 2;
                return acc + fileProgress;
            }, 0) / progressData.length;
    
            setDownloads(prev => ({
                ...prev,
                progressData: [...progressData],
                totalPercentage: Number(totalProgress).toFixed(2),
                filesProcessed: filesProcessedCount
            }));
        };
    
        const fetchWithProgress = async (url, i) => {
            const response = await fetch(url);
            const reader = response.body.getReader();
            const contentLength = +response.headers.get('Content-Length');
            let receivedLength = 0;
            let chunks = [];
    
            while(true) {
                const {done, value} = await reader.read();
                
                if (done) break;
                chunks.push(value);
                receivedLength += value.length;
                progressData[i].fetchProgress = Math.round((receivedLength / contentLength) * 100);
                updateTotalPercentage();
            }
    
            return new Blob(chunks);
        };
    
        for (let i = 0; i < selectedFiles.length; i++) {
            const id = selectedFiles[i];
            const file = fileData.find(item => item.id === id);
            
            const key = await new Promise((res, rej) => {
                libsodiumRef.current.onmessage = ({ data }) => 
                    data.type === 'toUint8Array' ? res(data.data) : rej(data.error);
                libsodiumRef.current.postMessage({ type: 'toUint8Array', data: { base64: file.key } });
            });
    
            const filename = progressData[i].filename;
    
            const res = `http://192.168.1.2:3000/get?id=${file.userId}&album=${file.albumId}&file=${filename}`;
            const encryptedBlob = await fetchWithProgress(res, i);
    
            const header = await new Promise((res, rej) => {
                libsodiumRef.current.onmessage = ({ data }) => 
                    data.type === 'toUint8Array' ? res(data.data) : rej(data.error);
                libsodiumRef.current.postMessage({ type: 'toUint8Array', data: { base64: file.header } });
            });
    
            const url = await new Promise((resolve, reject) => {
                libsodiumRef.current.onmessage = ({ data }) => {
                    switch (data.type) {
                        case 'decryptProgress':
                            progressData[i].decryptProgress = data.data.progress;
                            updateTotalPercentage();
                            break;
                        case 'decryptFile':
                            progressData[i].decryptProgress = 100;
                            progressData[i].url = data.data;
                            progressData[i].fetchProgress = 100;
                            updateTotalPercentage();
                            resolve(data.data);
                            break;
                        case 'error':
                            reject(data.error);
                            break;
                    }
                };        
    
                libsodiumRef.current.postMessage({ type: 'decryptFile', data: { encryptedBlob, key, header } });
            });
            
            progressData[i].url = url;
            filesProcessedCount++;
            updateTotalPercentage();
        }
    
        for (const { url, filename } of progressData) {
            if (url) {
                const a = document.createElement('a');
                a.href = url;
                a.setAttribute('download', filename);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }
    
        setDownloading(false);
    };
    
    return (
        <>
            <Style.MenuSelected>
                <Style.Content>
                    <Style.MenuButton onClick={() => setSelectedFiles([])}>
                        <CloseSvg/>
                        <p>{selectedFiles.length}</p>
                    </Style.MenuButton>
                    {!isMobile && <Style.TextSelected>{selectedFiles.length} seleccionada</Style.TextSelected>}
                </Style.Content>
                 <Style.Content>
                    <Style.MenuButton>
                        <FavoriteSvg/>
                    </Style.MenuButton>
                    <Style.MenuButton downloading={downloading} onClick={downloading ? null : DecryptAndDownloadItem}>
                        <DownloadSvg/>
                    </Style.MenuButton>
                    <Style.MenuButton>
                        <HiddenSvg/>
                    </Style.MenuButton>
                    <Style.MenuButton onClick={handleDelete}>
                        <TrashSvg/>
                    </Style.MenuButton>
                </Style.Content>
            </Style.MenuSelected>
            {isMobile && <Style.Space/>}
        </>
    )
}