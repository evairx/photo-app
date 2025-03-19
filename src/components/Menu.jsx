import { useContext } from 'react'
import { UploadContext } from '@/context/UploadContext'
import { MenuContext } from '@/context/MenuContext'
import { selectFile } from '@/services/SelectFile'
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@/hook/useMediaQuery'
import useCloseOutside from '@/hook/useCloseOutside'
import * as Style from '@/ui/Menus/menu'

import { SearchSvg, UserSvg } from '@/ui/icons'

export default function Menu() {
    const [ref, open, setOpen] = useCloseOutside(false);
    const { setUpload } = useContext(UploadContext);
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 1008px)');

    const handeUplaod = () => {
        selectFile(setUpload)
        setOpen(false)
    }

    return (
        <>
            <Style.Menu>
                <Style.MenuContentLeft>
                    <Style.LogoContent>
                        <figure>
                          <picture>
                            <img src="/logo.webp" width={100} alt="Logo" />
                          </picture>
                        </figure>
                        <Style.Slug>DEV VERSION</Style.Slug>
                    </Style.LogoContent>
                    {!isMobile && <Style.ContentSearch>
                      <Style.SearchIcon>
                        <SearchSvg />
                      </Style.SearchIcon>
                      <Style.Search type="text" placeholder="Buscar albums, fotos, etc..." />
                    </Style.ContentSearch>}
                </Style.MenuContentLeft>
                <Style.MenuContent>
                    <Style.UploadButton onClick={() => setOpen(!open)}>
                        <AddSvg/>
                        <Style.UploadText>{t('menu.upload')}</Style.UploadText>
                    </Style.UploadButton>
                    <UserSvg/>
                </Style.MenuContent>
            </Style.Menu>
            {open && <Style.SubMenu ref={ref}>
                <Style.Title>Crear</Style.Title>
                <Style.Button>
                    <AlbumSvg/>
                    Álbum
                </Style.Button>
                <Style.Title>Añadir fotos</Style.Title>
                <Style.Button onClick={handeUplaod}>
                    <PhotosSvg/>
                    Importar fotos
                </Style.Button>
            </Style.SubMenu>}
        </>
    )
}

const AddSvg = () => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill="#fff"
      d="M5.625 15a.75.75 0 0 0-1.5 0h1.5Zm-.75 1h-.75.75Zm14.4-1a.75.75 0 0 0-1.5 0h1.5Zm-6.984-9.539a.75.75 0 0 0-1.182-.922l1.182.922ZM7.21 9.54a.75.75 0 0 0 1.182.922L7.21 9.54Zm5.082-5a.75.75 0 0 0-1.182.922l1.182-.922Zm2.718 5.922a.75.75 0 0 0 1.182-.922l-1.182.922ZM12.45 5a.75.75 0 0 0-1.5 0h1.5Zm-1.5 11a.75.75 0 0 0 1.5 0h-1.5Zm-6.825-1v1h1.5v-1h-1.5Zm0 1c0 2.053 1.628 3.75 3.675 3.75v-1.5c-1.183 0-2.175-.99-2.175-2.25h-1.5ZM7.8 19.75h7.8v-1.5H7.8v1.5Zm7.8 0c2.047 0 3.675-1.697 3.675-3.75h-1.5c0 1.26-.992 2.25-2.175 2.25v1.5ZM19.275 16v-1h-1.5v1h1.5ZM11.109 4.539l-3.9 5 1.182.922 3.9-5-1.182-.922Zm0 .922 3.9 5 1.182-.922-3.9-5-1.182.922ZM10.95 5v11h1.5V5h-1.5Z"
    />
    </svg>
)

const AlbumSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={26} height={26} fill="none">
      <path
        fill="#fff"
        d="M19.5 2.167h-13a2.173 2.173 0 0 0-2.167 2.166v17.334c0 1.191.975 2.166 2.167 2.166h13a2.173 2.173 0 0 0 2.167-2.166V4.333A2.173 2.173 0 0 0 19.5 2.167Zm0 19.5h-13V4.333H13v7.584l2.708-2.037 2.709 2.037V4.333H19.5v17.334Zm-4.69-6.5 3.607 4.333H7.583l2.709-3.467 1.809 2.362 2.708-3.228Z"
      />
    </svg>
)

const PhotosSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
      <path
        fill="#fff"
        d="M20 4v12H8V4h12Zm0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2ZM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2Zm13.67 5-2.5 2.98-1.67-2.18L9 15h10l-3.33-4Z"
      />
    </svg>
)

const BarsSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={26} height={26} fill="none">
    <path
      fill="#fff"
      d="M3.25 19.5h19.5v-2.167H3.25V19.5Zm0-5.417h19.5v-2.166H3.25v2.166Zm0-7.583v2.167h19.5V6.5H3.25Z"
    />
  </svg>
)