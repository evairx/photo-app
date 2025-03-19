import { useContext, useState } from 'react';
import * as Style from '../ui/uploadstatus'
import { UploadContext } from '../context/UploadContext';

import { CloseSvg, VideoSvg, PhotoSvgUpload} from '@/ui/icons'

export default function UploadStatus() {
  const { upload } = useContext(UploadContext);
  const [view, setView] = useState(true);

  function handleClose() {
    setView(!view);
  }

  return (
    <>
      {upload.state && (
        <Style.Container>
          <Style.Content>
            <div>
              <Style.Title>Carga de archivos</Style.Title>
              <Style.SubTitle error={upload.error}>
                {upload.totalProgress < 100 
                  ? upload.error ? 'Error en procesar los archivos':`${upload.filesProcessed} / ${upload.content.length} Archivos procesados`
                  :`Backup Completado`}
              </Style.SubTitle>
            </div>
            <Style.ButtonsContent>
              <Style.Button onClick={handleClose}>
                <ArrowDown view={view}/>
              </Style.Button>
              <Style.Button>
                <CloseSvg />
              </Style.Button>
            </Style.ButtonsContent>
          </Style.Content>
          <Style.ContentArea view={view}>
            {upload.content.map((file, index) => (
              <Style.FilesContent key={index}>
                <Style.NameContent>
                  {file.type === 'video' ? 
                    <VideoSvg colorSvg={file.uploadError ? 'rgb(245, 62, 62)': 'rgb(150, 150, 150)'}/>
                    :
                    <PhotoSvgUpload colorSvg={file.uploadError ? 'rgb(245, 62, 62)': 'rgb(150, 150, 150)'}/>
                  }
                  <Style.Text error={file.uploadError}>{file.fileName}</Style.Text>
                </Style.NameContent>
                <Style.Text error={file.uploadError}>{file.uploadError ? file.errorMessage : `${file.progress}%`}</Style.Text>
              </Style.FilesContent>
            ))}
          </Style.ContentArea>
          <Style.ProgressContent>
            <Style.Porgress error={upload.error} progress={upload.totalProgress}></Style.Porgress>
          </Style.ProgressContent>
        </Style.Container>
      )}
    </>
  )
}

const ArrowDown = ({view}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    viewBox="0 0 24 24"
    style={{ marginTop: '5px', transform: view ? 'rotate(0deg)' : 'rotate(180deg)', transition: '.400s' }}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M4.293 8.293a1 1 0 0 1 1.414 0L12 14.586l6.293-6.293a1 1 0 1 1 1.414 1.414l-7 7a1 1 0 0 1-1.414 0l-7-7a1 1 0 0 1 0-1.414Z"
      clipRule="evenodd"
    />
  </svg>
)