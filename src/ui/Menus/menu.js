import styled from "@emotion/styled";

export const Menu = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.600rem;
    color: #fff;
    height: 4rem;
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

export const MenuContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .400rem;
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