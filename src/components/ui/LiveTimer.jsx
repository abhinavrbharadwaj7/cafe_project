import { useEffect, useState } from 'react';

export default function LiveTimer({ timestamp }) {
    const [elapsed, setElapsed] = useState('');

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            const start = new Date(timestamp);
            const diffInSeconds = Math.floor((now - start) / 1000);

            const minutes = Math.floor(diffInSeconds / 60);
            const seconds = diffInSeconds % 60;

            setElapsed(`${minutes}m ${seconds}s`);
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);

        return () => clearInterval(interval);
    }, [timestamp]);

    return <>{elapsed}</>;
}
