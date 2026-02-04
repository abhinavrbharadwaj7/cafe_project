import React, { useEffect, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export default function StickyFooter() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end end"],
    });

    return (
        <div
            ref={container}
            className="relative h-[800px]" // Reserve space for footer
            style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
        >
            <div className="fixed bottom-0 h-[800px] w-full">
                <Content />
            </div>
        </div>
    );
}

const Content = () => {
    return (
        <div className="bg-[#1c1917] h-full flex flex-col justify-between py-24 px-12 relative overflow-hidden">
            <Seal />
            <Section1 />
            <Section2 />
        </div>
    );
};

const Seal = () => {
    return (
        <motion.div
            className="absolute top-24 right-12 md:top-24 md:right-24 w-32 h-32 md:w-48 md:h-48 rounded-full border border-stone-800 flex items-center justify-center pointer-events-none z-10"
            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "backOut" }}
            viewport={{ once: true }}
        >
            {/* Spinning Text Ring */}
            <div className="w-full h-full animate-[spin_10s_linear_infinite] absolute inset-0">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <path id="sealPath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                    <text fill="#a8a29e" className="text-[10px] uppercase font-bold tracking-[0.25em]" style={{ letterSpacing: '0.2em' }}>
                        <textPath href="#sealPath">
                            Official • Cafe Luxe • Est 2024 • Premium •
                        </textPath>
                    </text>
                </svg>
            </div>

            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-xl font-black text-amber-700">CL</span>
                </div>
            </div>
        </motion.div>
    );
}

const Section1 = () => {
    return (
        <div>
            <Nav />
        </div>
    );
};

const Section2 = () => {
    return (
        <div className="flex justify-between items-end text-stone-200">
            <h1 className="text-[14vw] leading-[0.8] mt-10 font-black tracking-tighter text-stone-100 selection:bg-amber-500/30">
                CAFE LUXE
            </h1>
            <p className="text-stone-500 uppercase font-mono text-sm mb-4">
                ©2024 Cafe Luxe
            </p>
        </div>
    );
};

const Nav = () => {
    return (
        <div className="flex shrink-0 gap-20 text-stone-200">
            <div className="flex flex-col gap-2">
                <h3 className="mb-2 uppercase text-stone-500 font-bold text-xs tracking-widest">
                    About
                </h3>
                <p className="hover:text-amber-500 cursor-pointer transition-colors duration-300">Home</p>
                <p className="hover:text-amber-500 cursor-pointer transition-colors duration-300">Projects</p>
                <p className="hover:text-amber-500 cursor-pointer transition-colors duration-300">Our Mission</p>
                <p className="hover:text-amber-500 cursor-pointer transition-colors duration-300">Contact Us</p>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="mb-2 uppercase text-stone-500 font-bold text-xs tracking-widest">
                    Education
                </h3>
                <p className="hover:text-amber-500 cursor-pointer transition-colors duration-300">News</p>
                <p className="hover:text-amber-500 cursor-pointer transition-colors duration-300">Learn</p>
                <p className="hover:text-amber-500 cursor-pointer transition-colors duration-300">Certifications</p>
                <p className="hover:text-amber-500 cursor-pointer transition-colors duration-300">Publications</p>
            </div>
        </div>
    );
};
