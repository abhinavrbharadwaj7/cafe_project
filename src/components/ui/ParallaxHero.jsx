import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const ParallaxHero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={ref} className="relative h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background - Replace with video or high-res image if available, using Aurora for now */}
            <div className="absolute inset-0 bg-neutral-950">
                <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900/50 via-neutral-900/20 to-neutral-900/50" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-40 blur-[2px] scale-105" />
            </div>

            <motion.div
                style={{ y: textY, opacity }}
                className="relative z-10 text-center px-4"
            >
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="inline-block text-amber-500 text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-4 border border-amber-500/30 px-6 py-2 rounded-full backdrop-blur-sm"
                >
                    Est. 2024 &bull; New York
                </motion.span>
                <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
                    CAFE<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">LUXE</span>
                </h1>
                <p className="text-neutral-300 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">
                    Experience the art of coffee in a space designed for clarity, comfort, and creativity.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">Scroll to Explore</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-px h-16 bg-gradient-to-b from-transparent via-amber-500 to-transparent"
                />
            </motion.div>
        </div>
    );
};
