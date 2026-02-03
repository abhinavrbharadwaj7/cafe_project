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
        <div className="bg-[#1c1917] h-full flex flex-col justify-between py-24 px-12">
            <Section1 />
            <Section2 />
        </div>
    );
};

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
                ©2024 Design by AntiGravity
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
