import styled from "@emotion/styled"

export const Container = styled.div`
    position: fixed;
    bottom: 1.7rem;
    right: 1.7rem;
    background-color:rgb(32, 32, 32);
    border-radius: .400rem;
    z-index: 1200;
    box-shadow: 0px 0px 15px 2px rgba(0,0,0,0.4);
    overflow: hidden;
    min-width: 350px;
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

export const Content = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.600rem;
    padding: 0 1.2050rem;
    margin-top: .800rem;
    margin-bottom: .800rem;
`

export const Title = styled.p`
    font-size: 1.190rem;
    font-weight: 600;
    color: #fff;
`

export const SubTitle = styled.p`
    font-size: .920rem;
    font-weight: 600;
    color: ${({error}) => error ? 'rgb(245, 62, 62)' : 'rgb(150, 150, 150)'};
    margin-top: .300rem;
    transition: .300s;
`

export const ContentArea = styled.div`
    margin-top: 1.050rem;
    padding: ${({view}) => view ? '.600rem 1.2050rem' : '0rem 1.2050rem'};
    margin-top: .600rem;
    background-color: rgb(22, 22, 22);
    max-height: ${({view}) => view ? '160px' : '0px'};
    overflow-y: ${({view}) => view ? 'scroll' : 'hidden'};
    transition: .300s;
`

export const ProgressContent = styled.div`
    position: absolute;
    bottom: 0;
    background-color: rgb(78, 78, 78);
    width: 100%;
    height: 3px;
`

export const Porgress = styled.div`
    width: ${({ progress, error }) => error ? '100%': progress}%;
    height: 100%;
    background-color: ${({error}) => error ? 'rgb(245, 62, 62)' : 'rgb(255, 255, 255)'};
`

export const FilesContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: .600rem;
    padding: .900rem 0rem;
`

export const NameContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .400rem;
`

export const Text = styled.p`
    font-size: .980rem;
    font-weight: 600;
    color: ${({error}) => error ? 'rgb(245, 62, 62)' : 'rgb(150, 150, 150)'};
    cursor:default;
`

export const ButtonsContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .400rem;
`

export const Button = styled.button`
    width: 42px;
    height: 42px;
    background-color: #fff;
    border-radius: 50%;
    border: none;
    background-color: rgba(88, 88, 88, 0.3);
    cursor: pointer;
    transition: .300s;
    position: relative;

    &:hover {
        background-color: rgba(88, 88, 88, 0.62);
    }
`