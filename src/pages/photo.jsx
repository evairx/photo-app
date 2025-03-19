import React, { useState, useEffect, useRef } from 'react';
import { useLoaderData } from "react-router-dom";
import FileData from '../../data.json';
import Player from '@/components/Player';
import PlayerLoading from '../components/PlayerLoading';

import styled from "@emotion/styled";

const Content = styled.div`
    height: 100dvh;
    background-color: #000;
`

const Image = styled.img`
    max-width: 100%;
    max-height: 100%;
`

const ContentImage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100dvh; 
`

const Photo = () => {
    const { id } = useLoaderData();
    const file = FileData.find(item => item.id === id);
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [textSatatus, setTextStatus] = useState('');
    const [nameFile, setNameFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [error, setError] = useState(false);
    const libsodiumRef = useRef(null);

    useEffect(() => {
        libsodiumRef.current = new Worker(
            new URL('../workers/libsodiumWorker.js', import.meta.url), 
            { type: 'module' }
        );
    
        const fetchData = async () => {
            try {
                await fetchAndDecryptFile();
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(true);
                setLoading(false);
            }
        };
    
        fetchData();
    
        return () => {
            if (libsodiumRef.current) {
                libsodiumRef.current.terminate();
                libsodiumRef.current = null;
            }
         };
    }, [id]);

    function formatBytes(bytes, decimals = 2) {
        if (bytes <= 0) return '0 MB';
    
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let i = 0;

        let sizeInMB = bytes / Math.pow(k, 2);
    
        while (sizeInMB >= k && i < sizes.length - 1) {
            sizeInMB /= k;
            i++;
        }
    
        return `${parseFloat(sizeInMB.toFixed(dm))} ${sizes[i]}`;
    }

    const fetchAndDecryptFile = async () => {
        try {
            const keyUint = await new Promise((res, rej) => {
                libsodiumRef.current.onmessage = ({ data }) => 
                    data.type === 'toUint8Array' ? res(data.data) : rej(data.error);
                libsodiumRef.current.postMessage({ type: 'toUint8Array', data: { base64: file.key } });
            });
    
            const key = new Uint8Array(keyUint);
    
            const nameFile = await new Promise((res, rej) => {
                libsodiumRef.current.onmessage = ({ data }) => 
                    data.type === 'decryptText' ? res(data.data) : rej(data.error);
                libsodiumRef.current.postMessage({ type: 'decryptText', data: { key, encryptedText: file.name } });
            });
    
            const response = await fetch(`http://localhost:3000/get?id=${file.userId}&album=${file.albumId}&file=${file.id}`);
    
            if (response.ok) {
                const reader = response.body.getReader();
                const contentLength = +response.headers.get('Content-Length');
                let receivedLength = 0;
                const chunks = [];
    
                while(true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    
                    chunks.push(value);
                    receivedLength += value.length;
                    const downloadProgress = Math.round((receivedLength / contentLength) * 50);
                    setLoadingProgress(downloadProgress);
                    setTextStatus(`Cargando: ${formatBytes(receivedLength)} of ${formatBytes(contentLength)}`);
                }
    
                const encryptedBlob = new Blob(chunks);
    
                const headerUint = await new Promise((res, rej) => {
                    libsodiumRef.current.onmessage = ({ data }) => 
                        data.type === 'toUint8Array' ? res(data.data) : rej(data.error);
                    libsodiumRef.current.postMessage({ type: 'toUint8Array', data: { base64: file.header } });
                });
    
                const header = new Uint8Array(headerUint);
    
                const decryptedBlob = await new Promise((resolve, reject) => {
                    libsodiumRef.current.onmessage = ({ data }) => {
                        switch (data.type) {
                            case 'decryptProgress':
                                console.log('Decrypt progress:', data.data.progress);
                                const decryptProgress = Math.round(50 + (data.data.progress * 0.5));
                                setLoadingProgress(decryptProgress);
                                setTextStatus(`Desencriptando: ${data.data.progress}%`);
                                break;
                            case 'decryptFile':
                                setLoadingProgress(100);
                                resolve(data.data);
                                break;
                            case 'error':
                                reject(data.error);
                                alert('Error decrypting the file: ' + data.error);
                                break;
                        }
                    };        
    
                    libsodiumRef.current.postMessage({ type: 'decryptFile', data: { encryptedBlob, key, header } });
                });

                console.log(encryptedBlob)
    
                setNameFile(nameFile);
                setFileUrl(decryptedBlob);
                setLoading(false);
            } else {
                console.error('Failed to fetch the encrypted file');
                setLoading(false);
                setError(true);
            }
        } catch (error) {
            console.error('Error in fetchAndDecryptFile:', error);
            setLoading(false);
            setError(true);
            alert('Error fetching the file: ' + error.message);
        }
    };

    return (
        <Content>
            {error ? (
                <p>Archivo no encontrado</p>     
            ) : loading ? (
                <PlayerLoading progress={loadingProgress} textSatatus={textSatatus} />
            ) : file.type === "image" ? (
                <ContentImage>
                    <Image src={fileUrl} alt={`Imagen ${nameFile}`} />
                </ContentImage>
            ) : file.type === "video" ? (
                <Player src={fileUrl}/>
            ) : (
                <p>Formato no soportado</p>
            )}
        </Content>
    );
};

export default Photo;