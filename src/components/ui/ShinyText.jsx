export const ShinyText = ({ text, disabled = false, speed = 3, className = '' }) => {
    const animationDuration = `${speed}s`;

    return (
        <span
            className={`relative inline-block overflow-hidden bg-clip-text text-transparent bg-gradient-to-r from-neutral-400 via-white to-neutral-400 font-bold bg-[length:200%_100%] ${className}`}
            style={{
                backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                animationDuration: animationDuration,
                animationName: disabled ? 'none' : 'shine',
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear',
            }}
        >
            {text}
            <style jsx>{`
        @keyframes shine {
          0% {
            background-position: 100%;
          }
          100% {
            background-position: -100%;
          }
        }
      `}</style>
        </span>
    );
};
