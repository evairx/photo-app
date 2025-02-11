import styled from "@emotion/styled"

export const Content = styled.div`
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    min-width: 300px;
    background-color:rgb(7, 63, 128);
    overflow: hidden;
    border-radius: .600rem;
`

export const InfoStatus = styled.div`
    padding: .600rem;
    color: rgb(207, 207, 207);
`

export const Header = styled.div`
    width: 100%;
    height: 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0 1rem;
`

export const TitleFile = styled.p`
    color: #fff;
    font-size: .950rem;
    font-weight: 600;

    max-width: 320px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

export const PercentageText = styled.div`
    color: #fff;
    font-size: .950rem;
    font-weight: 400;
    display: flex;
    align-items: center;
`

export const ProgressContent = styled.div`
    width: 100%;
    height: .300rem;
    background-color:rgb(100, 100, 100);
    position: relative;
`

export const ProgressBar = styled.div`
    width: ${({ progress, error }) => `${error ? 100 : progress}%`};
    height: 100%;
    background-color: ${({ error, finishedUpload }) => error ? 'rgb(235, 57, 57)' : finishedUpload ? ' #00e61b' :'rgb(255, 255, 255)'};
    border-radius: 1rem;
    transition: width .3s ease-in-out;
`