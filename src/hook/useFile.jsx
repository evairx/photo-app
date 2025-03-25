import { useState, useEffect, useRef } from 'react';

export const useFile = ({ id, albumId, userId, key, header }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const workerRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/useFileWorker.js', import.meta.url),
      { type: 'module' }
    );

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        if (!workerRef.current) return;
        
        workerRef.current.onmessage = (event) => {
          const { type, blob, error: workerError } = event.data;
          
          switch (type) {
            case 'complete':
              setFile({ blob });
              setLoading(false);
              break;
            case 'error':
              setError(workerError);
              setLoading(false);
              break;
            case 'progress':
              setProgress(event.data.progress);
              break;
          }
        };

        workerRef.current.postMessage({
          userId,
          albumId,
          id,
          key,
          header,
          apiUrl: import.meta.env.VITE_FILES_URL
        });

      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (id && albumId && userId && key && header) {
      setLoading(true);
      setError(null);
      fetchFile();
    }

  }, [id, albumId, userId, key, header]);

  return {
    file,
    progress,
    loading,
    error
  };
};