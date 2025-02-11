import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UploadProvider } from '@/context/UploadContext'
import { MenuProvider } from '@/context/MenuContext'
import { SelectProvider } from '@/context/SelectContext'
import { DownloadProvider } from '@/context/DownloadContext'
import './global.css'
import Routes from '@/pages/routes'

createRoot(document.getElementById('app_content')).render(
  <StrictMode>
    <UploadProvider>
      <MenuProvider>
        <SelectProvider>
          <DownloadProvider>
            <Routes />
          </DownloadProvider>
        </SelectProvider>
      </MenuProvider>
    </UploadProvider>
  </StrictMode>,
)
