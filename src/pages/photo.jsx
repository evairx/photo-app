import React, { useState, useEffect, useRef } from 'react';
import { useLoaderData } from "react-router-dom";
import FileData from '@/../data.json';
import { useFile } from '@/hook/useFile';
import { useThumbnail } from '../hook/useThumbnail';
import Player from '@/components/Player';
import * as Style from '@/ui/pages/photoStyles'
import GlobalStyles from '@/global';

import { FileError } from '@/ui/icons';

const Photo = () => {
    const { id } = useLoaderData();
    const file = FileData.find(item => item.id === id);
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [fileUrl, setFileUrl] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [error, setError] = useState(false);
    const libsodiumRef = useRef(null);

    const {
        file: thumbnailFile,
        loading: thumbnailLoading,
        error: thumbnailError
    } = useThumbnail({
        userId: file.userId,
        id: file.id,
        key: file.key,
    });

    const { 
        file: serverFile, 
        loading: serverLoading, 
        progress: serverProgress,
        error: serverError 
    } = useFile({
        id: file.id,
        albumId: file.albumId,
        userId: file.userId,
        key: file.key,
        header: file.header
    });

    useEffect(() => {
        setLoadingProgress(serverProgress);

        const fetchData = async () => {
            try {
                if (serverError) setError(true);
                setThumbnailUrl(thumbnailFile);
                if (serverFile?.blob) {
                    setFileUrl(serverFile.blob);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(true);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, serverFile, serverProgress, serverError, thumbnailLoading, thumbnailFile]);

    return (
        <>
            <GlobalStyles theme={'dark'}/>
            <Style.Content>
                {error ? (
                    <Style.ContentImage>
                        <Style.Alert>
                            <p>Error al cargar el archivo</p>
                        </Style.Alert>
                        <Style.Image src={thumbnailUrl} alt="thumbnail" style={{filter: 'blur(3px)', opacity: '.5'}}/>
                        <Style.SvgContent>
                            <FileError/>
                        </Style.SvgContent>
                    </Style.ContentImage> 
                ) : loading || serverLoading ? (
                    <Style.ContentImage>
                        <Style.Alert>
                            Desencriptando - {loadingProgress}% <Style.Loader/>
                        </Style.Alert>
                        {thumbnailUrl && <Style.Image src={thumbnailUrl} alt="thumbnail" style={{filter: 'blur(3px)', opacity: '.5'}}/>}
                    </Style.ContentImage>
                ) : file.type === "image" ? (
                    <Style.ContentImage>
                        <Style.Image src={fileUrl}/>
                    </Style.ContentImage>
                ) : file.type === "video" ? (
                    <Player src={fileUrl} />
                ) : (
                    <p>Formato no soportado</p>
                )}
            </Style.Content>
        </>
    );
};

export default Photo;
