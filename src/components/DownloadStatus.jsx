import { useContext } from 'react'
import { DownloadContext } from '@/context/DownloadContext'
import styled from '@emotion/styled'

import { CloseSvg } from '@/ui/icons'

const Container = styled.div`
    position: fixed;
    bottom: 1.7rem;
    left: 1.7rem;
    background-color:rgb(32, 32, 32);
    border-radius: .400rem;
    padding: .930rem 1.2050rem;
    z-index: 1200;
    box-shadow: 0px 0px 15px 2px rgba(0,0,0,0.4);
    overflow: hidden;
    min-width: 280px;
    animation: fadeIn .300s ease-in-out;

    @keyframes fadeIn {
        0% {
            opacity: 0;
            transform: translateY(10px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
`

const Content = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.600rem;
`

const Title = styled.p`
    font-size: 1.090rem;
    font-weight: 600;
    color: #fff;
`

const SubTitle = styled.p`
    font-size: .980rem;
    font-weight: 600;
    color: rgb(201, 196, 196);
    margin-top: .300rem;
    transition: .300s;
`

const ButtonClose = styled.button`
    width: 48px;
    height: 48px;
    background-color: #fff;
    border-radius: 50%;
    border: none;
    background-color: rgb(73, 73, 73);
    cursor: pointer;
    transition: .300s;
    position: relative;

    &:hover {
        opacity: .800;
    }

    &:hover > div {
        opacity: .8;
    }
`

const ProgressBarCircle = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &::before {
        content: "";
        position: absolute;
        inset: -2px; /* Controla el grosor del borde */
        border-radius: 50%;
        background: conic-gradient(
            white ${({ progress }) => progress}%, 
            transparent ${({ progress }) => progress}% 100%
        );
        mask: radial-gradient(circle, transparent 60%, black 61%);
        -webkit-mask: radial-gradient(circle, transparent 60%, black 61%);
    }
`;


export default function DownloadStatus() {
    const { downloads, setDownloads, setCancelDownload } = useContext(DownloadContext);

    const handleClose = () => {
        setCancelDownload(true)
        setDownloads({});
    }

    const fix = (percentage) => {
        return Math.round(Number(percentage));
    };

    return (
        <>
        {downloads.progressData?.length > 0 && <Container>
            <Content>
                <div>
                    <Title>{downloads.totalPercentage == 100 ? 'Descarga Completada': `Descargando....`}</Title>
                    <SubTitle>
                        {downloads.totalPercentage < 100
                        ? `${downloads.filesProcessed} / ${downloads.progressData.length} Archivos Procesados`
                        : `${downloads.filesProcessed} Archivos Descargados`}
                    </SubTitle>
                </div>
                <ButtonClose onClick={handleClose}>
                    <CloseSvg />
                    <ProgressBarCircle progress={fix(downloads.totalPercentage)}/>
                </ButtonClose>
            </Content>
        </Container>}
        </>
    )
}