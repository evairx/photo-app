import { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';

const Video = styled.video`
    width: 100%;
    height: 99.67907dvh;
    cursor: ${({ isActive }) => isActive ? 'default' : 'none'};
`;

const ProgressContainer = styled.div`
    position: absolute;
    top: 3rem;
    width: 100%;
    z-index: 999;
    transition: opacity 0.3s ease;
`;

const ProgressContent = styled.div`
    position: relative;
    width: 90%;
    height: 0.35rem;
    background-color: rgba(240, 235, 235, 0.5);
    margin: auto;
    border-radius: 20px;
    cursor: pointer;
`;

const Progress = styled.div`
    position: absolute;
    width: ${({ progress }) => progress}%;
    height: 100%;
    background-color: #1D64B5;
    border-radius: 20px;
`;

const ProgressCircle = styled.div`
    position: absolute;
    min-width: 5px;
    min-height: 20px;
    background-color: rgb(255, 255, 255);
    border-radius: 1rem;
    right: 0;
    top: 50%;
    transform: translate(100%, -50%);
    z-index: 999;
`;

const ControlBar = styled.div`
    position: absolute;
    bottom: 6.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    z-index: 999;
    transition: opacity 0.3s ease;
    opacity: ${({ isActive }) => isActive ? 1 : 0};
`;

const Controls = styled.div`
    position: relative;
    width: 90%;
    margin: auto;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ButtonPlay = styled.button`
    height: 18px;
    width: 18px;
    content: "";
    background-image: ${({ play }) => play ? `url("data:image/svg+xml,%3Csvg fill='%23ffffff' width='18px' height='18px' viewBox='0 0 1920 1920' xmlns='http://www.w3.org/2000/svg' stroke='%23ffffff'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Cpath d='M754.571 0v1920H206V0h548.571Zm960 0v1920H1166V0h548.571Z' fill-rule='evenodd'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")` : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22px' height='22px' viewBox='0 0 24 24' fill='none'%3E%3Crect width='24' height='24' fill='none'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M3 5.49686C3 3.17662 5.52116 1.73465 7.52106 2.91106L18.5764 9.41423C20.5484 10.5742 20.5484 13.4259 18.5764 14.5858L7.52106 21.089C5.52116 22.2654 3 20.8234 3 18.5032V5.49686Z' fill='white'/%3E%3C/svg%3E")`};
    background-repeat: no-repeat;
    background-position: 55% calc(50% - 0px);
    border: none !important;
    box-shadow: none !important;
    background-color: transparent;
    cursor: pointer;

    &:hover {
        opacity: 0.5;
    }
`;

const ButtonFullscreen = styled.button`
    height: 18px;
    width: 18px;
    content: "";
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30px' height='30px' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M9.00001 18.0001L9.00001 17.0001C9.00001 15.8956 8.10458 15.0001 7.00001 15.0001H6.00001M15 18.0001V17.0001C15 15.8956 15.8954 15.0001 17 15.0001L18 15.0001M9 6.00012L9 7.00012C9 8.10469 8.10457 9.00012 7 9.00012L6 9.00012M15 6.00014L15 7.00014C15 8.10471 15.8954 9.00014 17 9.00014L18 9.00014' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    border: none !important;
    box-shadow: none !important;
    background-color: transparent;
    cursor: pointer;
`;

const Time = styled.p`
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
`;

const VolumeContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;

    &:hover > div {
        opacity: 1;
        width: 5rem;
    }
`;

const VolumeSliderContainer = styled.div`
    position: relative;
    width: 0;
    height: 0.35rem;
    background-color: rgba(240, 235, 235, 0.5);
    border-radius: 20px;
    cursor: pointer;
    transition: width 0.3s ease;
    opacity: 0;
`;

const VolumeSlider = styled.div`
    position: absolute;
    width: ${({ volume }) => volume * 100}%;
    height: 100%;
    background-color: #1D64B5;
    border-radius: 20px;
`;

const VolumeCircle = styled.div`
    position: absolute;
    min-width: 12px;
    min-height: 12px;
    background-color: rgb(255, 255, 255);
    border-radius: 50%;
    right: 0;
    top: 50%;
    transform: translate(100%, -50%);
    z-index: 999;
`;

const ButtonVolume = styled.button`
    height: 18px;
    width: 18px;
    content: "";
    background-image: ${({ muted }) => muted 
        ? `url("data:image/svg+xml,%3Csvg width='38px' height='38px' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.74 8.98999C10.74 8.10499 10.23 7.34499 9.48999 6.97499V8.07999L10.715 9.30499C10.73 9.20499 10.74 9.09999 10.74 8.98999ZM11.99 8.98999C11.99 9.45999 11.89 9.89999 11.72 10.31L12.475 11.065C12.805 10.445 12.99 9.73999 12.99 8.98999C12.99 6.84999 11.495 5.05999 9.48999 4.60999V5.63499C10.935 6.06499 11.99 7.40499 11.99 8.98999ZM4.62499 4.48999L3.98999 5.11999L6.34999 7.48499H3.98999V10.485H5.98999L8.48999 12.985V9.61999L10.615 11.745C10.28 12.005 9.90499 12.21 9.48999 12.335V13.365C10.18 13.21 10.805 12.89 11.335 12.46L12.355 13.485L12.99 12.85L8.48999 8.34999L4.62999 4.48999H4.62499ZM8.48499 4.98499L7.43999 6.02499L8.48499 7.06999V4.98999V4.98499Z' fill='white'/%3E%3Cpath d='M10.74 8.98999C10.74 8.10499 10.23 7.34499 9.48999 6.97499V8.07999L10.715 9.30499C10.73 9.20499 10.74 9.09999 10.74 8.98999ZM11.99 8.98999C11.99 9.45999 11.89 9.89999 11.72 10.31L12.475 11.065C12.805 10.445 12.99 9.73999 12.99 8.98999C12.99 6.84999 11.495 5.05999 9.48999 4.60999V5.63499C10.935 6.06499 11.99 7.40499 11.99 8.98999ZM4.62499 4.48999L3.98999 5.11999L6.34999 7.48499H3.98999V10.485H5.98999L8.48999 12.985V9.61999L10.615 11.745C10.28 12.005 9.90499 12.21 9.48999 12.335V13.365C10.18 13.21 10.805 12.89 11.335 12.46L12.355 13.485L12.99 12.85L8.48999 8.34999L4.62999 4.48999H4.62499ZM8.48499 4.98499L7.43999 6.02499L8.48499 7.06999V4.98999V4.98499Z' fill='white'/%3E%3C/svg%3E%0A")`
        : `url("data:image/svg+xml,%3Csvg width='38px' height='38px' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_375_6)'%3E%3Cmask id='mask0_375_6' style='mask-type:luminance' maskUnits='userSpaceOnUse' x='-2' y='-1' width='38' height='38'%3E%3Cpath d='M14.35 -0.140015L8.48999 5.71999L29.22 26.5L35.08 20.59L14.35 -0.140015Z' fill='white'/%3E%3Cpath d='M7.07001 6.87L-1.10999 15.33L19.61 36.11L27.8 27.6L7.07001 6.87Z' fill='white'/%3E%3Cpath d='M9.09003 5.19998L6.47003 7.87998L26.82 28.77L29.66 25.99L9.09003 5.19998Z' fill='white'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_375_6)'%3E%3Cpath d='M8 21H12L17 26V9.99998L12 15H8V21ZM19 14V22C20.48 21.32 21.5 19.77 21.5 18C21.5 16.26 20.48 14.74 19 14ZM19 11.29C21.89 12.15 24 14.83 24 18C24 21.17 21.89 23.85 19 24.71V26.77C23.01 25.86 26 22.28 26 18C26 13.72 23.01 10.14 19 9.22998V11.29Z' fill='white'/%3E%3C/g%3E%3Cmask id='mask1_375_6' style='mask-type:luminance' maskUnits='userSpaceOnUse' x='-2' y='-1' width='38' height='38'%3E%3Cpath d='M14.35 -0.140015L8.48999 5.71999L29.22 26.5L35.08 20.59L14.35 -0.140015Z' fill='white'/%3E%3Cpath d='M7.07001 6.87L-1.10999 15.33L19.61 36.11L27.8 27.6L7.07001 6.87Z' fill='white'/%3E%3Cpath d='M9.09003 5.19998L6.47003 7.87998L26.82 28.77L29.66 25.99L9.09003 5.19998Z' fill='white'/%3E%3C/mask%3E%3Cg mask='url(%23mask1_375_6)'%3E%3Cpath d='M8 21H12L17 26V9.99998L12 15H8V21ZM19 14V22C20.48 21.32 21.5 19.77 21.5 18C21.5 16.26 20.48 14.74 19 14ZM19 11.29C21.89 12.15 24 14.83 24 18C24 21.17 21.89 23.85 19 24.71V26.77C23.01 25.86 26 22.28 26 18C26 13.72 23.01 10.14 19 9.22998V11.29Z' fill='white'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_375_6'%3E%3Crect width='36' height='36' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A")`};
    background-repeat: no-repeat;
    background-position: center;
    border: none !important;
    box-shadow: none !important;
    background-color: transparent;
    cursor: pointer;

    &:hover {
        opacity: 0.5;
    }
`;

const OverLayBottom = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 12rem;
    background: linear-gradient(0deg, rgb(0, 0, 0) 0%,rgba(0, 0, 0, 0.68), rgba(0, 0, 0, 0) 100%);
    transition: opacity 0.3s ease;
`;

export default function Player({ src }) {
    const videoRef = useRef(null);
    const progressRef = useRef(null);
    const timeoutRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [play, setPlay] = useState(false);
    const [view, setView] = useState(true);
    const [isActive, setIsActive] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const volumeRef = useRef(null);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [volumeDragging, setVolumeDragging] = useState(false);

    useEffect(() => {
        const handleActivity = () => {
            setIsActive(true);
            
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            
            if (play) {
                timeoutRef.current = setTimeout(() => {
                    setIsActive(false);
                }, 3000);
            }
        };

        const container = document.querySelector('.player-container');
        container.addEventListener('mousemove', handleActivity);
        container.addEventListener('touchstart', handleActivity);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            container.removeEventListener('mousemove', handleActivity);
            container.removeEventListener('touchstart', handleActivity);
        };
    }, [play]);

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (dragging) handleSeek(event);
        };

        const handleMouseUp = () => {
            if (dragging) {
                setDragging(false);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleMouseMove, { passive: false });
        document.addEventListener('touchend', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleMouseMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [dragging]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (volumeDragging) handleVolumeSeek(event);
        };
    
        const handleMouseUp = () => {
            if (volumeDragging) {
                setVolumeDragging(false);
            }
        };
    
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleMouseMove, { passive: false });
        document.addEventListener('touchend', handleMouseUp);
    
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleMouseMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [volumeDragging]);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            const percent = (currentTime / videoRef.current.duration) * 100;
            setProgress(percent);
            setTime(currentTime);

            if (currentTime === videoRef.current.duration) {
                setPlay(false);
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (event) => {
        if (!videoRef.current || !progressRef.current) return;
        
        const rect = progressRef.current.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const offsetX = clientX - rect.left;
        const newProgress = Math.min(Math.max((offsetX / rect.width) * 100, 0), 100);
        
        setProgress(newProgress);
        videoRef.current.currentTime = (newProgress / 100) * videoRef.current.duration;
    };

    const handleDragStart = (event) => {
        event.preventDefault();
        setDragging(true);
        handleSeek(event);
    };

    const handleDragEnd = () => {
        setDragging(false);
    };

    const PlayPause = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setPlay(true);
        } else {
            videoRef.current.pause();
            setPlay(false);
        }
    };

    const handleVolumeSeek = (event) => {
        if (!videoRef.current || !volumeRef.current) return;
        
        const rect = volumeRef.current.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const offsetX = clientX - rect.left;
        const newVolume = Math.min(Math.max(offsetX / rect.width, 0), 1);
        
        setVolume(newVolume);
        setMuted(newVolume === 0);
        videoRef.current.volume = newVolume;
    };
    
    const handleVolumeDragStart = (event) => {
        event.preventDefault();
        setVolumeDragging(true);
        handleVolumeSeek(event);
    };
    
    const toggleMute = () => {
        if (muted) {
            videoRef.current.volume = volume;
            setMuted(false);
        } else {
            videoRef.current.volume = 0;
            setMuted(true);
        }
    };

    const toggleFullScreen = () => {
        const container = document.querySelector('.player-container');
        
        if (!document.fullscreenElement) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="player-container" style={{ position: 'relative' }}>
            <Video 
                ref={videoRef} 
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                controls={view ? false : true}
                onClick={PlayPause}
                onDoubleClick={toggleFullScreen} 
                isActive={isActive}
            >
                <source src={src} type="video/mp4" />
            </Video>
            {view && (
                <ControlBar isActive={isActive}>
                    <Controls>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <ButtonPlay play={play} onClick={PlayPause}/>
                            <VolumeContainer>
                                <ButtonVolume muted={muted} onClick={toggleMute} />
                                <VolumeSliderContainer
                                    ref={volumeRef}
                                    onMouseDown={handleVolumeDragStart}
                                    onTouchStart={handleVolumeDragStart}
                                >
                                    <VolumeSlider volume={muted ? 0 : volume}>
                                        <VolumeCircle
                                            onMouseDown={handleVolumeDragStart}
                                            onTouchStart={handleVolumeDragStart}
                                        />
                                    </VolumeSlider>
                                </VolumeSliderContainer>
                            </VolumeContainer>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <Time>{formatTime(time)} / {formatTime(duration)}</Time>
                            <ButtonFullscreen onClick={toggleFullScreen} />
                        </div>
                    </Controls>
                    <ProgressContainer>
                        <ProgressContent
                            ref={progressRef}
                            onMouseDown={handleDragStart}
                            onTouchStart={handleDragStart}
                        >
                            <Progress progress={progress}>
                                <ProgressCircle
                                    onMouseDown={handleDragStart}
                                    onTouchStart={handleDragStart}
                                    onMouseUp={handleDragEnd}
                                    onTouchEnd={handleDragEnd}
                                />
                            </Progress>
                        </ProgressContent>
                    </ProgressContainer>
                </ControlBar>
            )}
            {view && <OverLayBottom onClick={PlayPause} onDoubleClick={toggleFullScreen}  style={{ opacity: isActive ? 1 : 0 }}/>}
        </div>
    );
}