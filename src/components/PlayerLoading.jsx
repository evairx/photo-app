import styled from '@emotion/styled';
import Lottie from 'lottie-react';
import LoadingAnimation from '../assets/lottie/loading.json';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100dvh;
`

const LoadingContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    flex-direction: column;
    gap: 15px;
`

const TextProgress = styled.span`
    color: rgb(173, 173, 173);
    margin: 0;
    font-size: 1.050rem;
    font-weight: 600;
    position: absolute;
    bottom: 3rem;
    background-color: rgba(255, 255, 255, 0.06);
    padding: .500rem 1rem;
    border-radius: 4rem;
    border: 2px solid  rgba(95, 95, 95, 0.5);
`

export default function PlayerLoading({ progress, textSatatus}) {
    return (
        <Container>
            <LoadingContainer>
                <Lottie
                    animationData={LoadingAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: 200, height: 200 }}
                />
                <TextProgress>{textSatatus} - {progress}%</TextProgress>
            </LoadingContainer>
        </Container>
    )
}