import React, { useState, useEffect, useRef, Children } from 'react';
import useQuery from "../hook/useMediaQuery"
import styled from '@emotion/styled';

const HeliosStyle = styled.section`
  position: relative;
  width: 100%;
  overflow: hidden;
  height: 100lvh;
`;

const HeliosIndicator = styled.section`
  position: absolute;
  bottom: 13rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
`;

const HeliosPage = styled.span`
  width: 10px;
  height: 7px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.33);
  opacity: 0.5;
  margin: 0 5px;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease-out;
  position: relative;

  &:hover {
    opacity: 1;
    background-color: rgb(255, 255, 255);
  }

  @media screen and (max-width: 680px) {
    width: 30px;
    height: 8px;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border-radius: 8px;
    background-color: rgb(255, 255, 255);
    transition: width 0.3s ease-out;
  }

  &.active {
    transition: all 0.3s ease-out;
    width: 45px;
    background-color: rgba(255, 255, 255, 0.33);
    opacity: 1;
    overflow: hidden;
    
    &::before {
      width: ${props => props.loaderPagee};
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
`;

const HeliosInner = styled.main`
  display: flex;
  transition: transform 0.4s ease-in-out;
`;

const HeliosItem = styled.article`
  min-width: 100%;
  box-sizing: border-box;
  opacity: ${props => props.opacityProps};
  transform: ${props => props.transformProps};
  transition: opacity 0.5s ease-in-out;
`;

const Helios = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const heliosRef = useRef(null);
    const isMobile = useQuery('(min-width: 680px)');
    const timerRef = useRef(null);
  
    useEffect(() => {
      const handleIntersection = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            resetTimer();
          }
        });
      };
  
      const observer = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      });
  
      observer.observe(heliosRef.current);
  
      startTimer();
  
      return () => {
        clearInterval(timerRef.current);
        observer.disconnect();
      };
    }, []);
  
    const resetTimer = () => {
      clearInterval(timerRef.current);
      setProgress(0);
      startTimer();
    };
  
    const startTimer = () => {
        timerRef.current = setInterval(() => {
          setProgress((prevProgress) => {
            if (prevProgress >= 100) {
              clearInterval(timerRef.current);
              return 100;
            } else {
              return prevProgress + 1;
            }
          });
        }, 30);
    };

    useEffect(() => {
        if (progress >= 100) {
          nextSlide();
        }
    }, [progress]);
  
  
    const nextSlide = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === children.length - 1 ? 0 : prevIndex + 1
      );
      resetTimer();
    };

    const goToSlide = (index) => {
      setCurrentIndex(index);
      resetTimer();
    };
  
    return (
      <HeliosStyle ref={heliosRef}>
        <HeliosInner>
          {Children.map(children, (child, index) => (
            <HeliosItem
              opacityProps={index === currentIndex ? '1' : '0.4'}
              transformProps={`translateX(-${currentIndex * 100}%)`}
              key={index}
            >
              {child}
            </HeliosItem>
          ))}
        </HeliosInner>
        <HeliosIndicator>
          {Children.map(children, (_, index) => (
            <HeliosPage
              loaderPagee={`${index === currentIndex ? `${progress}%` : '0%'}`}
              key={index}
              className={`${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </HeliosIndicator>
      </HeliosStyle>
    );
};
  
export default Helios;