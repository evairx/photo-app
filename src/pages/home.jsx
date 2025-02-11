import { useContext, useEffect } from 'react';
import Main from '@/layout/Main'
import UploadStatus from '@/components/UploadStatus'
import Files from '@/components/Files'

import { UploadContext } from '@/context/UploadContext';

export default function App() {
    const { state } = useContext(UploadContext);

    const handleCopyText = async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(state);
                alert("Texto copiado al portapapeles");
            } else {
                // Método de compatibilidad para navegadores más antiguos
                const textArea = document.createElement("textarea");
                textArea.value = state;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                alert("Texto copiado al portapapeles");
            }
        } catch (err) {
            alert("Error al copiar el texto");
        }
    };
 
    return (
        <Main>
            <Files/>
            {state && <button onClick={handleCopyText}>Copy State</button>}
            <UploadStatus/>
        </Main>
    )
}