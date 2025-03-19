import { useState, useRef, useEffect } from "react";
import Carousel from "../components/Carrousel";
import styled from "@emotion/styled";
import { useTranslation } from 'react-i18next';
import { useOtpInput } from "../hook/useOtpInput";

const Content = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Main = styled.div`
    padding: 1rem;
    height: 100dvh;
    width: 550px;
`

const Container = styled.div`
    padding: 1rem;
    height: 100%;
    background-color: #121212;
    overflow-y: auto;
    border-radius: .600rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    @media (max-width: 600px) {
       padding: 1rem;
    }
`;

const Title = styled.h3`
    color: #fff;
    font-weight: 500;
`

const ContentInput = styled.div`
    width: 100%;
    padding: 2rem;
`

const Input = styled.input`
    padding: .5rem;
    border-radius: .500rem;
    width: 100%;
    background-color:rgb(34, 34, 34);
    border: 2px solid rgb(83, 83, 83);
    color: #fff;

    &:focus {
        outline: none;
    }
`
const Text = styled.p`
    color: rgb(99, 99, 99);
    font-weight: 600;
    margin-bottom: .5rem;
    margin-top: .6rem;
`

const Container2fa = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Input2fa = styled.input`
  width: 40px;
  height: 50px;
  font-size: 24px;
  text-align: center;
  border: 2px solid rgb(134, 134, 134);
  border-radius: 6px;
  background-color: #222;
  color: white;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: rgb(255, 255, 255);
  }
  
  &.error {
    border-color: #ff3860;
  }
`;

const Button = styled.button`
  margin-top: 20px;
  width: 100%;
  max-width: 250px;
  padding: 12px;
  font-size: 16px;
  background: #333;
  color: #666;
  border: none;
  border-radius: 6px;
  cursor: not-allowed;
  opacity: 0.6;
  transition: all 0.3s ease;
  font-weight: 600;

  &.active {
    background:rgb(255, 255, 255);
    color: #000;
    cursor: pointer;
    opacity: 1;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.66);
  }
`;

const StatusMessage = styled.p`
  margin-top: 15px;
  color: ${props => props.error ? '#ff3860' : '#00ff88'};
  font-size: 14px;
  text-align: center;
`;


export default function Test() {
    const [data, setData] = useState([
        {
            id: "xekEPzy3qz382CdL2bhmFn",
            title: "Tu privacidad es lo primero",
            subtitle: "Cifrado de extremo a extremo por defecto",
            image: "/photo.webp"
        },
        {
            id: "d1ZRxaqjMuHMKKVnWscLEN",
            title: "Almanamiento de forma segura",
            subtitle: "Infraestructura diseñada para tu seguridad",
            image: "/cloud.webp"
        },
        {
            id: "pRGXjiakVeSUmZ2JA9xUvv",
            title: "Mas barato que la competencia",
            subtitle: "Obten el mejor servicio al mejor precio",
            image: "/share.webp"
        }
    ]);
    
    const [page, setPage] = useState(1);

    const { t } = useTranslation();

    // Focus en el primer input cuando el componente se monta
    useEffect(() => {
        if (page === 1 && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [page]);

    const {
        otp,
        inputRefs,
        isOtpComplete,
        isVerifying,
        verificationStatus,
        handleChange,
        handleKeyDown,
        handlePaste,
        verifyOtp
    } = useOtpInput(6);

    const handleVerify = async () => {
        const isValid = await verifyOtp();
        
        if (isValid) {
            setTimeout(() => setPage(2), 1500);
        }
    };

    return (
        <Content>
            <Carousel data={data}/>
            <Main>
                <Container>
                    <figure>
                        <picture>
                            <source srcSet="/logo.webp" type="image/webp"/>
                            <img src="/logo.png" width={130} alt="Logo" />
                        </picture>
                    </figure>
                    {page === 0 && 
                        <>
                            <Title>Bienvenido de nuevo!</Title>
                            <ContentInput>
                                <Text>Correo</Text>
                                <Input type="email"/>
                            </ContentInput>   
                        </>
                    }
                    {page === 1 &&
                        <>
                            <Title>{t('twoFactor.title')}</Title>
                            <Text style={{ textAlign: 'center', marginBottom: '20px' }}>
                                {t('twoFactor.description')}
                            </Text>
                            <Container2fa onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <Input2fa
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className={verificationStatus?.success === false ? "error" : ""}
                                        autoComplete="one-time-code"
                                    />
                                ))}
                            </Container2fa>
                            <Button 
                                className={isOtpComplete ? "active" : ""} 
                                onClick={handleVerify}
                                disabled={!isOtpComplete || isVerifying}
                            >
                                {isVerifying ? "Verificando..." : t('twoFactor.button')}
                            </Button>
                            {verificationStatus && (
                                <StatusMessage error={!verificationStatus.success}>
                                    {verificationStatus.message}
                                </StatusMessage>
                            )}
                        </>
                    }
                </Container>
            </Main>
        </Content>
    );
}