import styled from "@emotion/styled";

export const MenuSelected = styled.nav`
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

    @media (max-width: 600px) {
        padding:.600rem;
        position: fixed;
        width: 100%;
        top: 0
        left:0;
        height: 3.5rem;
        z-index: 9999;
    }
`

export const Content = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .600rem;
`

export const TextSelected = styled.span`
    font-size: 1.2rem;
    font-weight: 400;
`

export const Space = styled.div`
    height: 3.5rem;
`

export const MenuButton = styled.button`
    background-color: transparent;
    border: none;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    cursor: ${({ downloading }) => downloading ? 'not-allowed' : 'pointer'};
    transition: all .2s ease-in-out;
    opacity: ${({ downloading }) => downloading ? '.500' : '1'};

    &:hover {
        background-color: ${({ downloading }) => downloading ? 'transparent' : 'rgba(255, 255, 255, .100)'};
    }

    p {
        font-size: 1.1rem;
        font-weight: 400;
        color: #fff;
        margin-top: .300rem;
        display: none;
    }

    @media (max-width: 600px) {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: .300rem;
        width: 80px;
        height: 40px;
        background-color:rgb(39, 55, 90);
        border-radius: 1.5rem;
        box-shadow: 0px 0px 7px 2px rgba(0, 0, 0, 0.17);
        
        p {
            display: block;
        }
    }
`