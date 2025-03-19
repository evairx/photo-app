import styled from "@emotion/styled";

export const Menu = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.600rem;
    color: #fff;
    height: 5rem;
    top: 0;
    width: 100%;
    transition: all .2s ease-in-out;

    @media (max-width: 1008px) {
        padding: 0 1.500rem;
    }
`

export const MenuContentLeft = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.800rem;

`

export const LogoContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .400rem;
    cursor: pointer;

`

export const Slug = styled.span`
    background-color: #fff;
    border-radius: 1rem;
    padding: .100rem .600rem;
    font-size: .960em;
    font-weight: 600;
    color: #000;
`

export const ContentSearch = styled.div`
    margin-left: 1rem;
    position: relative;
`

export const SearchIcon = styled.div`
    position: absolute;
    top: 50%;
    left: .800rem;
    transform: translateY(-50%);
`

export const Search = styled.input`
    background-color:rgba(255, 255, 255, 0.07);
    border: 2px solid rgb(104, 104, 104);
    height: 42px;
    width: 26.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .600rem;
    padding: .500rem .500rem .500rem 2.800rem;
    border-radius: 5rem;
    transition: all .2s ease-in-out;
    font-size: 1.050rem;
    color: #fff;

    &::placeholder {
        color: rgba(255, 255, 255, 0.43);
        font-weight: 500;
    }
        
    &:focus {
        outline: none;
        border: 2px solid rgba(255, 255, 255);
    }
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.16);
        border: 2px solid rgba(255, 255, 255);    }
`

export const MenuContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
`

export const MenuButton = styled.button`
    background-color: transparent;
    border: none;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    cursor: pointer;
    transition: all .2s ease-in-out;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`

export const UploadButton = styled.div`
    background-color:rgba(255, 255, 255, 0.07);
    border: 2px solid rgb(104, 104, 104);
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .600rem;
    padding: .500rem 1.5rem;
    border-radius: 5rem;
    cursor: pointer;
    transition: all .2s ease-in-out;
    &:hover { 
        background-color:rgba(255, 255, 255, 0.14);
        border: 2px solid rgb(255, 255, 255);
    }
`

export const UploadText = styled.p`
    font-size: 1.050rem;
    font-weight: 600;
    color: #fff;
`

export const Avatar = styled.figure`
    width: 42px;
    height: 42px;
    border: 2px solid rgb(104, 104, 104);
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    transition: all .2s ease-in-out;

    &:hover {
        border: 2px solid #fff;
    }

    img {
        width: 100%;
        height: 100%;
    }
`

export const SubMenu = styled.div`
    background-color:rgb(12, 50, 94);
    position: absolute;
    top: .600rem;
    right: 5.6rem;
    min-width: 280px;
    min-height: 200px;
    z-index: 9999;
`

export const Title = styled.p`
    color: rgb(209, 204, 204);
    font-size: .920rem;
    font-weight:600;
    padding: 1rem;
`

export const Button = styled.button`
    font-size: 1.120rem;
    color: #fff;
    background-color: transparent;
    border: none;
    width: 100%;
    display: flex;
    justify-content: left;
    align-items: center;
    gap: .500rem;
    padding: .600rem 1rem;
    cursor: pointer;
    transition: all .2s ease-in-out;

    &:hover {
        background-color: rgba(255, 255, 255, 0.25);
    }
`