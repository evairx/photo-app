import styled from '@emotion/styled';

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

const LoadingCircle = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 5px solid #fff;
    border-top-color: #000;
    animation: spin .920s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`

const TextProgress = styled.p`
    color: #fff;
    margin: 0;
    font-size: 1.050rem;
    font-weight: 600;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`

const Text = styled.p`
    position: absolute;
    bottom: 3rem;
    left: 50%;
    transform: translate(-50%);
    color: #fff;
    font-size: 1.150rem;
    font-weight: 600;
`

export default function PlayerLoading({ progress, textSatatus}) {

    return (
        <Container>
            <LoadingContainer>
                <LoadingCircle/>
                <TextProgress>{progress}%</TextProgress>
                <Text>{textSatatus}</Text>
            </LoadingContainer>
        </Container>
    )
}