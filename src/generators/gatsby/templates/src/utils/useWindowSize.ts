import { useState, useEffect } from 'react';

const getSize = () => {
    return typeof window !== `undefined`
        ? {
              innerHeight: window.innerHeight,
              innerWidth: window.innerWidth,
              outerHeight: window.outerHeight,
              outerWidth: window.outerWidth,
          }
        : {
              innerHeight: 0,
              innerWidth: 0,
              outerHeight: 0,
              outerWidth: 0,
          };
};

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState(getSize());

    const handleResize = () => {
        setWindowSize(getSize());
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowSize;
};

export default useWindowSize;
