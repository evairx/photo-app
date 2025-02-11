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
`

const Container = styled.div`
    padding: 2.1rem 2.1rem 1.600rem;
    width: 100%;
    height: 91.5dvh;
    overflow-y: auto;

    @media (max-width: 600px) {
        padding: 0;
        overflow-y: auto;
        height: 100%;
    }
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
            </Content>
        </>
    );
}