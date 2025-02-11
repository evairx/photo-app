import { useContext, useEffect } from 'react';
import * as Style from '../ui/uploadstatus'
import { UploadContext } from '../context/UploadContext';

export default function UploadStatus() {
    const { state,progress, fileName, uploadError, finishedUpload } = useContext(UploadContext);
    

    return (
        <>
            {fileName && (
                <Style.Content>
                    <Style.Header>
                        <Style.TitleFile>{fileName}</Style.TitleFile>
                        <Style.PercentageText>{uploadError ? <ErrorSvg/>: finishedUpload ? <FinishedSvg/>: <p>{progress}%</p>}</Style.PercentageText>
                    </Style.Header>
                    <Style.ProgressContent>
                        <Style.ProgressBar progress={progress} error={uploadError} finishedUpload={finishedUpload}/>
                    </Style.ProgressContent>
                </Style.Content>
            )}
        </>
    )
}

const ErrorSvg = () => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill="rgb(245, 62, 62)"
      fillRule="evenodd"
      d="M7.91 3.23 3.23 7.913v-.01a.81.81 0 0 0-.23.57v7.054c0 .22.08.42.23.57L7.9 20.77c.15.15.36.23.57.23h7.06c.22 0 .42-.08.57-.23l4.67-4.673a.81.81 0 0 0 .23-.57V8.473c0-.22-.08-.42-.23-.57L16.1 3.23a.81.81 0 0 0-.57-.23H8.48c-.22 0-.42.08-.57.23ZM12 7a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm-1 9a1 1 0 0 1 1-1h.008a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1Z"
      clipRule="evenodd"
    />
  </svg>
)

const FinishedSvg = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={26}
      height={26}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="#00e61b"
        fillRule="evenodd"
        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-5.97-3.03a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47 2.235-2.236L14.97 8.97a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  )