import * as Style from "../ui/Menus/slideMenu"
import { useState, useEffect} from "react";
import { NavLink } from "react-router-dom";
import useMediaQuery from "@/hook/useMediaQuery";
import { useTranslation } from 'react-i18next';
import { TrashSvg, TrashSvgActive, PhotoSvg, PhotoActiveSvg, AlbumSvg, AlbumActiveSvg, OcultSvg, OcultSvgActive, CloudSvg} from '@/ui/icons'

export default function SldieMenu({ url }) {
    const [storage, setStorage] = useState(0);
    const [totalStorage, setTotalStorage] = useState(0);
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 1008px)');

    const [open, setOpen] = useState(true);

    useEffect(() => {
        const storage = 3070901616.6
        const totalStorage = 5368709120;
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

    function handleMenu() {
        setOpen(!open);
        console.log(open)
    }
    
    return (
        <>
        <Style.Menu isMobile={isMobile} isOpen={open}>
            <Style.Header isOpen={open}>
                <Style.ButtonSlide isOpen={open} onClick={handleMenu}/>
            </Style.Header>
            <Style.Title isOpen={open}>{t('sideMenu.Home.title')}</Style.Title>
            <NavLink to="/" viewTransition>
                <Style.Button active={url === '/'}>
                    {url === "/" ? <PhotoActiveSvg />: <PhotoSvg />}
                    <Style.ButtonText isMobile={isMobile} open={open}>{t('sideMenu.Home.content.Photos')}</Style.ButtonText>
                </Style.Button>
            </NavLink>
            {open ? 
                <Style.TitleCollection>{t('sideMenu.Collections.title')}</Style.TitleCollection> : 
                <Style.Bar/> 
            }
            <Style.ButtonContainer>
                <NavLink to="/albums" viewTransition>
                    <Style.Button active={url === '/albums'}>
                    {url === "/albums" ? <AlbumActiveSvg /> : <AlbumSvg />}
                        <Style.ButtonText open={open}>{t('sideMenu.Collections.content.Albums')}</Style.ButtonText>
                    </Style.Button>
                </NavLink>
                <NavLink to="/hidden" viewTransition>
                    <Style.Button active={url === '/hidden'}>
                        {url === "/hidden" ? <OcultSvgActive /> : <OcultSvg />}
                        <Style.ButtonText open={open}>{t('sideMenu.Collections.content.HiddenFolder')}</Style.ButtonText>
                    </Style.Button>
                </NavLink>
                <NavLink to="/trash" viewTransition>
                    <Style.Button active={url === '/trash'}>
                        {url === "/trash" ? <TrashSvgActive /> : <TrashSvg />}
                        <Style.ButtonText open={open}>{t('sideMenu.Collections.content.Trash')}</Style.ButtonText>
                    </Style.Button>
                </NavLink>
            </Style.ButtonContainer>
            <Style.ContentButton isMobile={isMobile} open={open}>
                <Style.ContentCloud>
                    <CloudSvg/>
                </Style.ContentCloud>
                <div style={{width: isMobile ? open ? '100%':'0' : '100%'}}>
                    <Style.BarStorageContent isMobile={isMobile} open={open}>
                        <Style.BarProgress percentage={getPercentage()}/>
                    </Style.BarStorageContent>
                    <Style.TextStorage isMobile={isMobile} open={open} percentage={getPercentage()}>
                        {formatBytes(storage)} {t('sideMenu.Storage.of')} {formatBytes(totalStorage)} {t('sideMenu.Storage.used')}
                    </Style.TextStorage>
                </div>
            </Style.ContentButton>
        </Style.Menu>
        </>
    )
}


const SliderBarleft = () => (
    <svg  xmlns="http://www.w3.org/2000/svg"  width={28}  height={28}  viewBox="0 0 24 24"  fill="none"  stroke="#fff"  strokeWidth={1.5}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-layout-sidebar-left-collapse"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M9 4v16" /><path d="M15 10l-2 2l2 2" /></svg>
  )