import React, { useRef, useState, useEffect, useId } from 'react';

const CurvedLoop = ({
    marqueeText = "",
    speed = 1,
    curveAmount = 80,
    direction = 'right',
    interactive = true,
    className = '',
    backgroundColor = "transparent",
    color = "currentColor",
    height = "250px"
}) => {
    const [rotation, setRotation] = useState(0);
    const requestRef = useRef();
    const previousTimeRef = useRef();
    const curveId = useId();

    const scrollSign = direction === 'left' ? 1 : -1;

    const animate = (time) => {
        if (previousTimeRef.current !== undefined) {
            const deltaTime = time - previousTimeRef.current;
            const deltaRotation = (speed * 0.015 * deltaTime) * scrollSign;
            setRotation((prev) => (prev + deltaRotation));
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [speed, direction]);

    // Create a massive string to ensure coverage
    const repeatedText = new Array(12).fill(marqueeText).join(' • ');

    return (
        <div
            className={`relative overflow-hidden w-full ${className}`}
            style={{ height: height, background: backgroundColor, color: color }}
        >
            <svg
                className="w-full h-full absolute top-0 left-0"
                viewBox="0 0 1400 300"
                preserveAspectRatio="xMidYMid meet"
            >
                <path
                    id={curveId}
                    fill="none"
                    d={`M -200 150 Q 600 ${150 - curveAmount} 1600 150`}
                />

                <text width="100%" style={{ fontSize: '1.7rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.8 }} fill={color}>
                    <textPath
                        href={`#${curveId}`}
                        startOffset={`${rotation % 200}%`} // Longer runway
                    >
                        {repeatedText}
                    </textPath>
                </text>
            </svg>
        </div>
    );
};
export default CurvedLoop;
