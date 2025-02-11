import * as Style from "../ui/Menus/slideMenu"
import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import useMediaQuery from "@/hook/useMediaQuery";
import { MenuContext } from "@/context/MenuContext";
import { TrashSvg, PhotoSvg, AlbumSvg, OcultSvg, CloudSvg} from '@/ui/icons'

export default function SldieMenu({ url }) {
    const [storage, setStorage] = useState(0);
    const [totalStorage, setTotalStorage] = useState(0);
    const isMobile = useMediaQuery('(max-width: 1008px)');

    const { open, refOpen } = useContext(MenuContext);

    useEffect(() => {
        const storage = 2087239075
        const totalStorage = 5364182400;
        setStorage(storage);
        setTotalStorage(totalStorage);
    }, []);

    function getPercentage() {
        return (storage / totalStorage) * 100;
    }

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
    
    return (
        <>
        {isMobile && <Style.Space/>}
        <Style.Menu isMobile={isMobile} open={open} ref={refOpen}>
            <NavLink to="/" viewTransition>
                <Style.Button active={url === '/'}>
                    <PhotoSvg />
                    <Style.ButtonText isMobile={isMobile} open={open}>Fotos</Style.ButtonText>
                </Style.Button>
            </NavLink>
            {isMobile ? open ? 
                <Style.TitleCollection>Colecciones</Style.TitleCollection> : 
                <Style.Bar/> : 
                <Style.TitleCollection>Colecciones</Style.TitleCollection>
            }
            <Style.ButtonContainer>
                <NavLink to="/albums" viewTransition>
                    <Style.Button active={url === '/albums'}>
                        <AlbumSvg />
                        <Style.ButtonText isMobile={isMobile} open={open}>Álbumes</Style.ButtonText>
                    </Style.Button>
                </NavLink>
                <NavLink to="/hidden" viewTransition>
                    <Style.Button active={url === '/hidden'}>
                        <OcultSvg />
                        <Style.ButtonText isMobile={isMobile} open={open}>Carpeta Oculta</Style.ButtonText>
                    </Style.Button>
                </NavLink>
                <NavLink to="/trash" viewTransition>
                    <Style.Button active={url === '/trash'}>
                        <TrashSvg />
                        <Style.ButtonText isMobile={isMobile} open={open}>Papelera</Style.ButtonText>
                    </Style.Button>
                </NavLink>
            </Style.ButtonContainer>
            <Style.ContentButton isMobile={isMobile} open={open}>
                <Style.Bar isMobile={isMobile}/>
                <Style.ContentCloud>
                    <CloudSvg/>
                    <Style.ButtonText isMobile={isMobile} open={open}>Almacenamiento</Style.ButtonText>
                </Style.ContentCloud>
                <Style.BarStorageContent isMobile={isMobile} open={open}>
                    <Style.BarProgress percentage={getPercentage()}/>
                </Style.BarStorageContent>
                <Style.TextStorage isMobile={isMobile} open={open} percentage={getPercentage()}>
                    Has utilizado {formatBytes(storage)} de {formatBytes(totalStorage)}
                </Style.TextStorage>
            </Style.ContentButton>
        </Style.Menu>
        </>
    )
}