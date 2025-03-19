import { useLocation } from 'react-router-dom'
import { useContext } from 'react';
import { SelectContext } from '@/context/SelectContext';
import useMediaQuery from '@/hook/useMediaQuery';
import Menu from "@/components/Menu";
import MenuSelected from '../components/MenuSelected'
import Slidemenu from "@/components/slideMenu";
import DownloadStatus from '../components/DownloadStatus';

import styled from "@emotion/styled";

const Content = styled.section`
    display: flex;
    padding: 0rem 1rem 1rem;
    gap: 1rem;

    @media (max-width: 1008px) {
        gap: .600rem;
    }

    @media (max-width: 600px) {
        flex-direction: column;
        padding: 0;
    }
`

const Container = styled.div`
    padding: 1rem;
    position: relative;
    background-color: #121212;
    width: 100%;
    height:87.5dvh;
    overflow-y: auto;
    border-radius: .600rem;

    @media (max-width: 600px) {
        padding: 1rem;
        border-radius: 0;
        min-height: 89.7dvh;
        height: 100%;
    }
`

const Version = styled.div`
    position: absolute;
    bottom: 2rem;
    right: 2.5rem;
    width: 600px;
    font-size: 1.1rem;
    color: #fff;
    font-weight: 600;
    opacity: 0.1;
    text-align: right;
    pointer-events: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
`

export default function Main({ children, title }) {
    const isMobile = useMediaQuery("(max-width: 600px)");
    const { selectedFiles } = useContext(SelectContext);
    const url = useLocation().pathname;
    return (
        <>
            {selectedFiles.length > 0 ? <MenuSelected /> : <Menu/>}
            <title>{title}</title>
            <Content>
                {!isMobile && <Slidemenu url={url}/>}
                <Container>
                    {children}
                </Container>
                <DownloadStatus/>
                <Version>This project is in an early development stage, not even close to an alpha. It is not recommended for production use. Commit version: {import.meta.env.VITE_COMMIT_HASH}</Version>
            </Content>
        </>
    );
}