import React from 'react';
import { motion } from 'framer-motion';
import CurvedLoop from './CurvedLoop';

const Certifications = () => {
    const certs = [
        { name: 'FSSAI Certified', icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/FSSAI_logo.svg/1200px-FSSAI_logo.svg.png' },
        { name: 'ISO 22000', icon: 'https://cdn-icons-png.flaticon.com/512/5837/5837136.png' },
        { name: 'HACCP Compliant', icon: 'https://cdn-icons-png.flaticon.com/512/10472/10472877.png' },
        { name: '100% Organic', icon: 'https://cdn-icons-png.flaticon.com/512/5722/5722168.png' },
    ];

    return (
        <section className="py-24 bg-stone-100 border-t border-stone-200 relative overflow-hidden flex flex-col items-center">

            <div className="text-center mb-0 relative z-10">
                <p className="text-stone-400 text-sm font-bold tracking-[0.2em] uppercase mb-4">Quality Assurance</p>
                <h2 className="text-3xl md:text-5xl font-black text-stone-300 tracking-tight uppercase">
                    Certified Excellence
                </h2>
            </div>

            {/* Dynamic Background Loop - Now the Main Feature */}
            <div className="relative w-full h-[300px] flex items-center justify-center z-0 mt-8">
                <CurvedLoop
                    marqueeText="FSSAI CERTIFIED • ISO 22000 • HACCP COMPLIANT • 100% ORGANIC"
                    speed={0.15}
                    curveAmount={60}
                    direction="right"
                    color="#78716c" // Stone-500: Softer grey
                />
            </div>
        </section>
    );
};

export default Certifications;
