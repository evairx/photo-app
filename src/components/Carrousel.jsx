import Helios from "./Helios";
import styled from "@emotion/styled";

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40%;
    height: 100vh;
    margin: 0 auto;

    animation: fadeIn 1s ease;

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

const Content = styled.div`
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
`

const Image = styled.figure`
    width: 200px;
    height: 200px;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const Info = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const Title = styled.h2`
    color: #fff;
`

const Subtitle = styled.p`
    color: #939393;
    margin-top: 7px;
    font-size: 1.050rem;
    font-weight: 600;
`

export default function Carousel({data}) {
    return (
        <Container>
            <Helios>
                {data.map((i, item) => (
                    <Content key={item}>
                        <Image>
                            <picture>
                                <img src={i.image} alt="photo"/>
                            </picture>
                        </Image>
                        <Info>
                            <Title>{i.title}</Title>
                            <Subtitle>{i.subtitle}</Subtitle>
                        </Info>
                    </Content>
                ))}
            </Helios>
        </Container>
    );
}