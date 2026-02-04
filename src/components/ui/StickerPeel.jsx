import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const StickerPeel = ({
    width = 120,
    height = 120,
    src,
    className = "",
    children
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className={`relative cursor-grab active:cursor-grabbing ${className}`}
            style={{
                width,
                height,
                perspective: 600,
                zIndex: 50,
                filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.25))" // Natural shape-aware shadow
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}

            // Drag Logic
            drag
            dragMomentum={false} // Stops instantly on release (Paste effect)
            whileDrag={{ scale: 1.2, rotate: 0, zIndex: 100 }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Main Content: Clipped when hovered to simulate peeling */}
            <motion.div
                className="w-full h-full relative z-10"
                animate={{
                    clipPath: isHovered
                        ? "polygon(0 0, 70% 0, 100% 30%, 100% 100%, 0 100%)"  // Cut top-right corner
                        : "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {children ? children : (
                    <motion.img
                        src={src || "https://cdn-icons-png.flaticon.com/512/7222/7222037.png"}
                        alt="Sticker"
                        className="w-full h-full object-contain drop-shadow-lg"
                        style={{
                            filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.3))"
                        }}
                    />
                )}
            </motion.div>

            {/* The Peel/Fold Effect - The white "back" of the sticker showing */}
            <motion.div
                className="absolute top-0 right-0 w-full h-full pointer-events-none z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* 
                    The Fold: A triangle positioned at the top-right.
                    Since we cut 30% (70% to 100%), the fold should be roughly 30% size.
                */}
                <div
                    className="absolute top-0 right-0 w-[30%] h-[30%] bg-gradient-to-bl from-gray-100 to-gray-300 rounded-bl-2xl shadow-[-5px_5px_10px_rgba(0,0,0,0.2)] border-b border-l border-white/50"
                />
            </motion.div>
        </motion.div>
    );
};

export default StickerPeel;
