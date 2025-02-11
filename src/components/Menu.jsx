import { NavLink } from 'react-router-dom'
import { useContext } from 'react'
import { UploadContext } from '@/context/UploadContext'
import { MenuContext } from '@/context/MenuContext'
import { selectFile } from '@/services/SelectFile'
import useMediaQuery from '@/hook/useMediaQuery'
import useCloseOutside from '@/hook/useCloseOutside'
import * as Style from '@/ui/Menus/menu'

export default function Menu() {
    const [ref, open, setOpen] = useCloseOutside(false);
    const { setState, setProgress, setFileName, setFinishedUpload } = useContext(UploadContext);
    const { toggleOpen } = useContext(MenuContext);
    const isMobile = useMediaQuery('(max-width: 1008px)');

    const handeUplaod = () => {
        selectFile(setProgress,setState, setFileName, setFinishedUpload)
        setOpen(false)
    }

    return (
        <>
            <Style.Menu>
                <Style.MenuContentLeft>
                    {isMobile &&
                        <Style.MenuButton onClick={toggleOpen}>
                            <BarsSvg />
                        </Style.MenuButton>
                    }
                    <h2>Logo</h2>
                </Style.MenuContentLeft>
                <Style.MenuContent>
                    {isMobile && 
                        <Style.MenuButton>
                            <SearchSvg/>
                        </Style.MenuButton>
                    }
                    <Style.MenuButton onClick={() => setOpen(!open)}>
                        <AddSvg/>
                    </Style.MenuButton>
                    <NavLink to="/settings" viewTransition>
                        <Style.MenuButton>
                            <ConfigSvg />
                        </Style.MenuButton>
                    </NavLink>
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
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
      <path fill="#fff" d="M20 13h-7v7h-2v-7H4v-2h7V4h2v7h7v2Z" />
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

const ConfigSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
      <path
        fill="#fff"
        d="M13.85 22.25h-3.7c-.74 0-1.36-.54-1.45-1.27l-.27-1.89c-.27-.14-.53-.29-.79-.46l-1.8.72c-.7.26-1.47-.03-1.81-.65L2.2 15.53c-.35-.66-.2-1.44.36-1.88l1.53-1.19c-.01-.15-.02-.3-.02-.46 0-.15.01-.31.02-.46l-1.52-1.19c-.59-.45-.74-1.26-.37-1.88l1.85-3.19c.34-.62 1.11-.9 1.79-.63l1.81.73c.26-.17.52-.32.78-.46l.27-1.91c.09-.7.71-1.25 1.44-1.25h3.7c.74 0 1.36.54 1.45 1.27l.27 1.89c.27.14.53.29.79.46l1.8-.72c.71-.26 1.48.03 1.82.65l1.84 3.18c.36.66.2 1.44-.36 1.88l-1.52 1.19c.01.15.02.3.02.46 0 .16-.01.31-.02.46l1.52 1.19c.56.45.72 1.23.37 1.86l-1.86 3.22c-.34.62-1.11.9-1.8.63l-1.8-.72c-.26.17-.52.32-.78.46l-.27 1.91c-.1.68-.72 1.22-1.46 1.22Zm-3.17-1.55v.02c.01 0 .01-.01 0-.02Zm-.06-.45h2.76l.37-2.55.53-.22c.44-.18.88-.44 1.34-.78l.45-.34 2.38.96 1.38-2.4-2.03-1.58.07-.56c.03-.26.06-.51.06-.78s-.03-.53-.06-.78l-.07-.56 2.03-1.58-1.39-2.4-2.39.96-.45-.35c-.42-.32-.87-.58-1.33-.77l-.52-.22-.37-2.55h-2.76l-.37 2.55-.53.21c-.44.19-.88.44-1.34.79l-.45.33-2.38-.95-1.39 2.39 2.03 1.58-.07.56a7 7 0 0 0-.06.79c0 .26.02.53.06.78l.07.56-2.03 1.58 1.38 2.4 2.39-.96.45.35c.43.33.86.58 1.33.77l.53.22.38 2.55Zm7.6-2.53c0 .01-.01.02-.01.03l.01-.03Zm-12.45-.01.01.02c0-.01-.01-.02-.01-.02ZM18.22 6.27c0 .01.01.02.01.02l-.01-.02ZM5.79 6.25l-.01.02s.01-.01.01-.02Z"
      />
      <path fill="#fff" d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
    </svg>
)


const SearchSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
      <path
        fill="#fff"
        d="m20.49 19-5.73-5.73C15.53 12.2 16 10.91 16 9.5A6.5 6.5 0 1 0 9.5 16c1.41 0 2.7-.47 3.77-1.24L19 20.49 20.49 19ZM5 9.5C5 7.01 7.01 5 9.5 5S14 7.01 14 9.5 11.99 14 9.5 14 5 11.99 5 9.5Z"
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