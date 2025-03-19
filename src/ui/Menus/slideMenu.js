import styled from "@emotion/styled";

export const Menu = styled.aside`
    background-color: #121212;
    padding: 1rem .800rem;
    min-width: ${({ isOpen }) =>  isOpen ? '265px': '100px'};
    z-index: 999;
    border-radius: .600rem;
    height: 87.5dvh;
    display: flex;
    flex-direction: column;
    z-index: 1002;
`;

export const Header = styled.div`
    display: flex;
    justify-content: ${({ isOpen }) => isOpen ? 'flex-end': 'center'};
    align-items: center;
    margin-bottom: ${({ isOpen }) => isOpen ? '0': '1.650rem'};
`

export const ButtonSlide = styled.button`
    width: 32px;
    height: 32px;
    padding: 1.2rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: all .3s ease-in-out;
    border-radius: 10px;
    background-image: ${({ isOpen }) => isOpen ? 
        `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' class='icon icon-tabler icons-tabler-outline icon-tabler-layout-sidebar-left-collapse'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z' /%3E%3Cpath d='M9 4v16' /%3E%3Cpath d='M15 10l-2 2l2 2' /%3E%3C/svg%3E")` 
        : 
        `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%23fff' class='icon icon-tabler icons-tabler-filled icon-tabler-layout-sidebar-right-collapse'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M18 3a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h12zm-3 2h-9a1 1 0 0 0 -.993 .883l-.007 .117v12a1 1 0 0 0 .883 .993l.117 .007h9v-14zm-5.387 4.21l.094 .083l2 2a1 1 0 0 1 .083 1.32l-.083 .094l-2 2a1 1 0 0 1 -1.497 -1.32l.083 -.094l1.292 -1.293l-1.292 -1.293a1 1 0 0 1 -.083 -1.32l.083 -.094a1 1 0 0 1 1.32 -.083z' /%3E%3C/svg%3E")`};
    bcakground-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    &:hover {
        background-image: ${({ isOpen}) => isOpen && `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%23fff' class='icon icon-tabler icons-tabler-filled icon-tabler-layout-sidebar-left-collapse'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M18 3a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h12zm0 2h-9v14h9a1 1 0 0 0 .993 -.883l.007 -.117v-12a1 1 0 0 0 -.883 -.993l-.117 -.007zm-2.293 4.293a1 1 0 0 1 .083 1.32l-.083 .094l-1.292 1.293l1.292 1.293a1 1 0 0 1 .083 1.32l-.083 .094a1 1 0 0 1 -1.32 .083l-.094 -.083l-2 -2a1 1 0 0 1 -.083 -1.32l.083 -.094l2 -2a1 1 0 0 1 1.414 0z' /%3E%3C/svg%3E")`};
    }
`

export const Title = styled.p`
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1.250rem;
    display: ${({ isOpen }) => isOpen ? 'block': 'none'};
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
    background-color: ${({ active }) => active ? 'rgba(255, 255, 255, 0.16)' : 'transparent'};

    &:hover {
        background-color: rgba(255, 255, 255, 0.09);
    }
`

export const ButtonText = styled.p`
    color: #fff;
    font-size: 1.050rem;
    font-weight: 600;
    display: ${({ open }) => !open && 'none'};
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
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .500rem;
    padding: ${({ open }) =>  open ? '.600rem': '.400rem 0'};
`;

export const BarStorageContent = styled.div`
    width: 100%;
    height: .300rem;
    background-color: #2B2B2B;
    border-radius: 1rem;
    margin-top: .400rem;
    position: relative;
    display: ${({ open }) => open ? 'block' : 'none'};
`

export const BarProgress = styled.div`
    width: ${({ percentage }) => `${Math.min(percentage, 100)}%`};
    height: 100%;
    background-color: ${({ percentage }) => percentage > 95 ? 'rgb(250, 62, 62)' : 'rgb(255, 255, 255)'};
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
    display: ${({ open }) =>  open ? 'block' : 'none'};
`

export const Bar = styled.div`
    width: 100%;
    height: .150rem;
    border-radius: 20px;
    background-color: #838383;

    @media (max-width: 1008px) {
        margin-top: 0;
        margin-bottom: 1.800rem;
    }
`