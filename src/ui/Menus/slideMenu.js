import styled from "@emotion/styled";

export const Menu = styled.aside`
    background-color: #101726;
    padding: 2.1rem .800rem;
    min-width: ${({ isMobile, open }) => isMobile ? open ? '265px': '60px' : '265px'};
    position: ${({ isMobile }) => isMobile ? 'absolute' : 'relative'};
    ${({ open, isMobile }) => isMobile && open && `
       box-shadow: 10px 0px 13px -10px rgba(0, 0, 0, 0.75), 0px 0px 10px 0px rgba(0,0,0,0);
    `}
    z-index: 999;
    height: 91.5dvh;
    display: flex;
    flex-direction: column;
    transition: all .2s ease-in-out;
    z-index: 1002;
`;

export const Space = styled.div`
    min-width: 75px;
    height: 91.5dvh;
`

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.100rem;
`

export const Button = styled.div`
    display: flex;
    align-items: center;
    gap: .500rem;
    padding: .700rem 1.400rem;
    border-radius: 1.600rem;
    cursor: pointer;
    transition: all .3s ease-in-out;
    background-color: ${({ active }) => active ? 'rgba(29, 100, 181, 0.5)' : 'transparent'};

    &:hover {
        background-color: rgba(29, 100, 181, 0.5);
    }
`

export const ButtonText = styled.p`
    color: #fff;
    font-size: 1.050rem;
    font-weight: 600;
    display: ${({ isMobile, open }) => !open && isMobile ? 'none' : 'block'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
export const TitleCollection = styled.p`
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    margin-top: 2.800rem;
    margin-bottom: .950rem;
`

export const ContentButton = styled.div`
    margin-top: auto;
    padding-bottom: 1rem;
    padding: ${({ isMobile, open }) => isMobile ? open ? '.600rem': '0' : '0 .600rem'};
    
    ${({ isMobile, open }) => isMobile && !open && `
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    `} 
`;

export const BarStorageContent = styled.div`
    width: 100%;
    height: .300rem;
    background-color: #838383;
    border-radius: 1rem;
    margin-top: .400rem;
    position: relative;
    display: ${({ isMobile, open }) => isMobile ? open ? 'block' : 'none' : 'block'};
`

export const BarProgress = styled.div`
    width: ${({ percentage }) => `${Math.min(percentage, 100)}%`};
    height: 100%;
    background-color: ${({ percentage }) => percentage > 95 ? 'rgb(250, 62, 62)' : ' #1D64B5'};
    border-radius: 1rem;
    position: absolute;
    top:0;
    left: 0;
    transition: width .8s ease-in-out;
`

export const ContentCloud = styled.div`
    display: flex;
    align-items: center;
    gap: .500rem;
`

export const TextStorage = styled.p`
    color: ${({ percentage }) => percentage > 95 ? 'rgb(250, 94, 94)' : '#fff'};
    font-size: .900rem;
    font-weight: 400;
    margin-top: .400rem;
    display: ${({ isMobile, open }) => isMobile ? open ? 'block' : 'none' : 'block'};
`

export const Bar = styled.div`
    width: 100%;
    height: .150rem;
    border-radius: 20px;
    background-color: #838383;
    margin-top: ${({ isMobile }) => isMobile ? '' : '2.200rem'};
    margin-bottom: ${({ isMobile }) => isMobile ? '1.800rem' : '2.200rem'};
`