import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion";
import { useEffect } from "react";
import { cn } from "../../lib/utils";

export const AuroraBackground = ({ className, children, ...props }) => {
    // Warm/Latte Palette: Amber Gold, Warm Stone, Soft Gray, Cream
    const COLORS = ["#fbbf24", "#d6d3d1", "#a8a29e", "#fae8ff"];
    const color = useMotionValue(COLORS[0]);
    const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #fafaf9 50%, ${color})`; // #fafaf9 is stone-50

    useEffect(() => {
        animate(color, COLORS, {
            ease: "easeInOut",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
    }, []);

    return (
        <motion.div
            style={{ backgroundImage }}
            className={cn("relative min-h-screen bg-stone-50 text-stone-900 overflow-hidden", className)}
            {...props}
        >
            <div className="absolute inset-0 bg-stone-50/30 pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};
