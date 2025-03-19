import Main from '@/layout/Main'
import UploadStatus from '@/components/UploadStatus'
import { useTranslation } from 'react-i18next';
import { useOtpInput } from "../../hook/useOtpInput";
import { useState, useEffect, use } from 'react';

import styled from '@emotion/styled'

const Container = styled.div`
    width: 100%;
    height: 100%;
    max-width: 550px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 1rem;
`

const Header = styled.div`
    position: absolute;
    width: 97%;
    padding: 1rem;
    border-bottom: 2px solid rgb(41, 41, 41);
`

const Title = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    color: #fff;
`

const Subtitle = styled.p`
    color: rgb(99, 99, 99);
    font-size: 1.080rem;
    font-weight: 600;
    margin-top: 1.2rem;
`

const Figure = styled.figure`
    width: 200px;
    height: 200px;
    border-radius: 20px;
    overflow: hidden;
    margin-top: 1rem;
    animation: fadeIn 0.5s ease;
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        user-drag: none; /* Evita que la imagen sea arrastrable */
        pointer-events: none; /* Evita la interacción con el puntero */
        user-select: none; /* Evita que se seleccione la imagen */
        -webkit-user-drag: none; /* Para compatibilidad con navegadores WebKit */
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
`

const FigureLoading = styled.div`
    width: 200px;
    height: 200px;
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(34, 34, 34, 0.29);
    border-radius: 20px;
        opacity: 0.7;
    animation: skeleton-loadings .5s linear infinite alternate;
    @keyframes skeleton-loadings {
        0% {
        background-color: var(--skeleton-color);
        opacity: 0.2;
        }

        100% {
        background-color: var(--skeleton-color-100);
        opacity: 0.3;
        }
    }
`

const ContentError = styled.div`
    width: 200px;
    height: 200px;
    margin-top: 1rem;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: rgba(34, 34, 34, 0.29);
    padding: 10px;
`

const ErrorText = styled.p`
    color: rgb(253, 79, 79);
    text-align: center;
    margin-top: .600rem;
    font-size: .860rem;
`

const Container2fa = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Input2fa = styled.input`
  width: 40px;
  height: 50px;
  font-size: 24px;
  text-align: center;
  border: 2px solid  ${({ error }) => error ? 'rgb(253, 79, 79)' : 'rgb(134, 134, 134)'};
  border-radius: 6px;
  background-color: #222;
  color: white;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ error }) => error ? 'rgb(253, 79, 79)' : 'rgb(255, 255, 255)'};
  }
`;

const Input2faDisabled = styled.div`
    width: 40px;
    height: 50px;
    background-color: #222;
    border: 2px solid rgb(134, 134, 134);
    border-radius: 6px;
    cursor: not-allowed;
    opacity: 0.2;
`

const ToggleButton = styled.div`
  display: flex;
  background: #121212;
  border-radius: 20px;
  border: 2px solid rgb(51, 50, 50);
  margin: 2rem 0;
  padding: 4px;
  position: relative;
  width: 250px;
  cursor: pointer;
  user-select: none;
`;

const Option = styled.button`
    flex: 1;
    padding: 8px 0;
    text-align: center;
    border-radius: 16px;
    font-size: .960rem;
    font-weight: 600;
    background: transparent;
    color: ${props => props.active ? '#fff' : 'rgb(107, 107, 107)'};
    position: relative;
    z-index: 2;
    border: none;
    cursor: pointer;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    transition: color 0.3s ease;

    &:hover {
        color: #fff;
    }
`;

const Slider = styled.span`
  position: absolute;
  top: 4px;
  left: ${props => props.position === 'QR' ? '4px' : '50%'};
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background:rgb(48, 47, 47);
  border-radius: 16px;
  transition: left 0.3s ease;
`;

const ContentCode = styled.pre`
    padding: 12px 20px;
    background: rgb(34, 34, 34);
    border: 2px solid rgb(51, 50, 50);
    border-radius: 8px;
    margin-top: 1rem;
    animation: fadeIn 0.5s ease;
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`

const ContentCodeLoading = styled.div`
    padding: 12px 20px;
    background: rgb(34, 34, 34);
    border: 2px solid transparent;
    border-radius: 8px;
    margin-top: 1rem;
    width: 394.69px;
    height: 50px;
    opacity: 0.7;
    animation: skeleton-loadings .5s linear infinite alternate;
    @keyframes skeleton-loadings {
        0% {
        background-color: var(--skeleton-color);
        opacity: 0.2;
        }

        100% {
        background-color: var(--skeleton-color-100);
        opacity: 0.3;
        }
    }
`

const Code = styled.code`
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
`

export default function SetUp() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorInput, setErrorInput] = useState(false);
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch('http://localhost:3000/twofactor/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: "tiburonsinJAJAJAJA"
                    }),

                });
                
                if (!res.ok) {
                    throw new Error(`Server responded with status: ${res.status}`);
                }
                
                const data = await res.json();
                setData(data);
            } catch (error) {
                console.error("Two-factor setup error:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const { 
        otp, 
        inputRefs, 
        handleChange, 
        handleKeyDown, 
        handlePaste,
        isVerifying,
      } = useOtpInput(6, {
        secret: data?.secret,
        onVerificationComplete: (success, data, error) => {
          if (success) {
            console.log('Token is valid');
          } else {
            setErrorInput(true);
            console.log(data)
          }
        }
    });
    const [viewMode, setViewMode] = useState('QR');

    const toggleViewMode = (params) => {
        return () => setViewMode(params);
    };

    const CopyCode = () => {
        try {
            navigator.clipboard.writeText(data.secret);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return true;
        } catch (error) {
            console.error('Failed to copy secret code:', error);
            return false;
        }
    };

    return (
        <Main title="Setup two-factor authentication">
            <Header >
                <Title>{t('twoFactor.setup.title')}</Title>
            </Header >
            <Container>
                {viewMode === 'QR' ? (
                    loading ? (
                        <FigureLoading/>
                    ) : (
                        error ? (
                            <ContentError>
                                <QrError/>
                                <ErrorText>{t('twoFactor.setup.errorText')}</ErrorText>
                            </ContentError>
                        ):(
                            <Figure>
                                <picture>
                                    <source srcSet={data.qr} type="image/webp"/>
                                    <img src={data.qr} alt='QR code'/>
                                </picture>
                            </Figure>
                        )
                    )
                ) : (
                    <>
                        {loading ? (
                            <ContentCodeLoading/>
                        ):(
                            <ContentCode>
                                <Code>
                                    {data.secret}
                                    <span onClick={CopyCode} style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
                                        {copied ? <CheckSvg/> : <CopySvg/>}
                                    </span>
                                </Code>
                            </ContentCode>
                        )}
                    </>
                )}

                <Subtitle>
                    {viewMode === 'QR'
                        ? t('twoFactor.setup.subtitle.qr')
                        : t('twoFactor.setup.subtitle.code')
                    }
                </Subtitle>

                <ToggleButton>
                    <Slider position={viewMode} />
                    <Option active={viewMode === 'QR'} onClick={toggleViewMode('QR')}>
                        <ScanSvg/>
                        QR
                    </Option>
                    <Option active={viewMode === 'CODE'} onClick={toggleViewMode('CODE')}>
                        <SecretSvg/>
                        MANUAL
                    </Option>
                </ToggleButton>
                <Container2fa onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                        loading || error ? (
                            <Input2faDisabled/>
                        ):(
                            <Input2fa
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                autoComplete="one-time-code"
                                error={errorInput}
                             />
                        )
                    ))}
                </Container2fa>
                {errorInput && <ErrorText style={{fontSize: '1rem'}}>{t('twoFactor.errorTextCode')}</ErrorText>}
            </Container>
            <UploadStatus/>
        </Main>
    )
}

const CopySvg = () => (
    <svg  xmlns="http://www.w3.org/2000/svg"  width={20}  height={20}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={1.5}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-copy"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /></svg>
)

const ScanSvg = () => (
    <svg  xmlns="http://www.w3.org/2000/svg"  width={21}  height={21}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={1.5}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-scan"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7v-1a2 2 0 0 1 2 -2h2" /><path d="M4 17v1a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v1" /><path d="M16 20h2a2 2 0 0 0 2 -2v-1" /><path d="M5 12l14 0" /></svg>
)

const SecretSvg = () => (
    <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={1.5}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-shield-lock"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" /><path d="M12 11m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 12l0 2.5" /></svg>
) 

const CheckSvg = () => (
    <svg  xmlns="http://www.w3.org/2000/svg"  width={20}  height={20}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={1.5}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>
)

const QrError = () => (
    <svg  xmlns="http://www.w3.org/2000/svg"  width={34}  height={34}  viewBox="0 0 24 24"  fill="none"  stroke="rgb(253, 79, 79)"  strokeWidth={1.5}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-face-id-error"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 8v-2a2 2 0 0 1 2 -2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2 -2v-2" /><path d="M9 10h.01" /><path d="M15 10h.01" /><path d="M9.5 15.05a3.5 3.5 0 0 1 5 0" /></svg>
)