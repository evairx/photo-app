import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UploadProvider } from '@/context/UploadContext'
import { MenuProvider } from '@/context/MenuContext'
import { SelectProvider } from '@/context/SelectContext'
import { DownloadProvider } from '@/context/DownloadContext'
import './global.css'
import Routes from '@/pages/routes'

import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'

createRoot(document.getElementById('app_content')).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <UploadProvider>
        <MenuProvider>
          <SelectProvider>
            <DownloadProvider>
              <Routes />
            </DownloadProvider>
          </SelectProvider>
        </MenuProvider>
      </UploadProvider>
    </I18nextProvider>
  </StrictMode>,
)
