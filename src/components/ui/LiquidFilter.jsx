export const LiquidDistortionFilter = () => (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
            <filter id="liquid">
                <feTurbulence baseFrequency="0.01 0.01" numOctaves="3" result="noise" seed="1">
                    <animate attributeName="baseFrequency" dur="10s" values="0.01 0.01;0.02 0.02;0.01 0.01" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" />
            </filter>
            <filter id="liquid-hover">
                <feTurbulence type="fractalNoise" baseFrequency="0.01 0.003" numOctaves="5" seed="5" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="B">
                    <animate attributeName="scale" values="0;20;0" dur="2s" repeatCount="indefinite" begin="mouseover" />
                </feDisplacementMap>
            </filter>
        </defs>
    </svg>
);
