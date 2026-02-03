import { motion } from "framer-motion";
import { useState } from "react";

export const CinematicMenuItem = ({ item, onSelect }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex-shrink-0 w-[85vw] md:w-[60vw] h-[80vh] flex flex-col justify-end group cursor-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onSelect}
        >
            {/* Background Image with Filter */}
            <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                <motion.img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                    style={{ filter: isHovered ? "url(#liquid)" : "none" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 md:p-16 flex flex-col items-start">
                <div className="overflow-hidden mb-4">
                    <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 tracking-tighter transform transition-transform duration-700 group-hover:-translate-y-2">
                        {item.name}
                    </h2>
                </div>

                <div className="flex items-center gap-6 overflow-hidden">
                    <span className="text-3xl md:text-4xl font-light text-amber-400 font-serif italic">${item.price.toFixed(2)}</span>
                    <span className="w-16 h-px bg-white/50" />
                    <p className="text-lg text-neutral-300 max-w-md opacity-0 transform translate-y-full transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                        {item.description}
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-12 px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-sm hover:bg-amber-400 transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"
                >
                    Add to Order
                </motion.button>
            </div>

            {/* Hover Reveal Number */}
            <span className="absolute top-10 right-10 text-[10rem] font-black text-white/5 pointer-events-none select-none group-hover:text-white/10 transition-colors duration-700">
                0{item.id}
            </span>
        </motion.div>
    );
};
