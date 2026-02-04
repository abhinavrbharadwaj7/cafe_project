import { useRef, useState, useEffect } from "react";
import { motion, useSpring, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import { cn } from "../../lib/utils";

export const SpotlightHero = ({ children, className }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={cn(
                "relative min-h-screen w-full overflow-hidden bg-stone-50 flex items-center justify-center group",
                className
            )}
            onMouseMove={handleMouseMove}
        >
            {/* 1. Clean Grid Pattern (React Bits Style) */}
            <div className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#e7e5e4 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Mask for the grid - fades out at edges */}
            <div className="absolute inset-0 bg-stone-50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />


            {/* 2. Ambient Warm Spotlight (Mouse Follow) */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 mix-blend-multiply"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(251, 191, 36, 0.15),
              transparent 80%
            )
          `,
                }}
            />

            {/* 3. Secondary Ambient Light (Fixed/Breathing) */}
            <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-amber-100/40 blur-[120px] mix-blend-multiply animate-pulse duration-[8000ms]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-stone-200/40 blur-[100px] mix-blend-multiply" />

            {/* 4. Animated Grid Squares (Flickering) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <GridSquare x={10} y={20} delay={0} />
                <GridSquare x={80} y={15} delay={2} />
                <GridSquare x={30} y={70} delay={4} />
                <GridSquare x={75} y={60} delay={1.5} />
                <GridSquare x={15} y={85} delay={3.5} />
            </div>

            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
};

const GridSquare = ({ x, y, delay }) => {
    return (
        <motion.div
            style={{ left: `${x}%`, top: `${y}%` }}
            className="absolute w-10 h-10 bg-amber-500/10"
            animate={{
                opacity: [0, 1, 0],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                delay: delay,
                repeatDelay: Math.random() * 5
            }}
        />
    )
}
