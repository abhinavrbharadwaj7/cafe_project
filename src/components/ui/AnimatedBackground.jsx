import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const AnimatedBackground = ({ children, className }) => {
    return (
        <div className={cn("relative w-full overflow-hidden bg-neutral-950", className)}>
            <div className="absolute inset-0 w-full h-full bg-neutral-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]" />
            </div>
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[20%] left-[20%] w-72 h-72 bg-purple-500/30 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-yellow-500/20 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4
                }}
                className="absolute top-[40%] left-[60%] w-64 h-64 bg-amber-600/20 rounded-full blur-[100px]"
            />
            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
};
