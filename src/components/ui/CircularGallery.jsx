import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, useSpring } from 'framer-motion';

const CircularGallery = ({ items, onSelect }) => {
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // Physics State
    const rotation = useMotionValue(0);
    // Smooth rotation using a spring for the actual display value ensures butter-smooth movement
    const smoothRotation = useSpring(rotation, {
        stiffness: 100,
        damping: 30,
        mass: 1
    });

    // Configuration
    const CARD_WIDTH = 260; // Slightly larger cards
    const GAP = 80; // More space between items
    const LENGTH = items.length;
    const ANGLE_PER_ITEM = 360 / LENGTH;

    // Large radius for panoramic look
    const RADIUS = 700;

    // Reset rotation when items change
    useEffect(() => {
        rotation.set(0);
    }, [items, rotation]);

    // Pan Handler
    const onPan = (e, info) => {
        setIsDragging(true);
        // Direct pixel-to-degree mapping without spring delay during drag
        const newRotation = rotation.get() + info.delta.x * 0.1;
        rotation.set(newRotation);
    };

    const onPanEnd = (e, info) => {
        // Calculate Momentum
        const velocity = info.velocity.x;
        const currentRotation = rotation.get();

        // Single Step Logic:
        // 1. Where are we now?
        const currentSnapIndex = Math.round(currentRotation / ANGLE_PER_ITEM);

        // 2. Where would we land with momentum?
        const power = 0.2;
        const projectedRotation = currentRotation + (velocity * power);
        const projectedSnapIndex = Math.round(projectedRotation / ANGLE_PER_ITEM);

        // 3. Clamp the movement to adjacent items
        // We only allow landing on the current item OR the immediate neighbor
        let targetIndex = projectedSnapIndex;
        const diff = targetIndex - currentSnapIndex;

        if (diff > 1) targetIndex = currentSnapIndex + 1;
        if (diff < -1) targetIndex = currentSnapIndex - 1;

        const snappedRotation = targetIndex * ANGLE_PER_ITEM;

        // Animate to snap point
        animate(rotation, snappedRotation, {
            type: "spring",
            stiffness: 50,
            damping: 20,
            mass: 1
        });

        // Small delay to prevent click event triggering immediately after drag release
        setTimeout(() => setIsDragging(false), 50);
    };

    return (
        <motion.div
            ref={containerRef}
            className="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-transparent cursor-grab active:cursor-grabbing touch-pan-y"
            style={{ perspective: '2500px', perspectiveOrigin: 'center' }}
            onPan={onPan}
            onPanEnd={onPanEnd}
        >
            {/* The Spinning Cylinder */}
            {/* We rotate this entire container */}
            <motion.div
                className="relative w-0 h-0 flex items-center justify-center transform-style-3d" // w-0 h-0 ensures it's a point center
                style={{
                    transformStyle: 'preserve-3d',
                    rotateY: smoothRotation, // Use either rotation or smoothRotation depending on preference
                    translateZ: -RADIUS // Push center back so front items are at Z=0
                }}
            >
                {items.map((item, index) => {
                    // Position items strictly around the circle
                    const angle = index * ANGLE_PER_ITEM;

                    return (
                        <GalleryItem
                            key={item.id}
                            item={item}
                            angle={angle}
                            radius={RADIUS}
                            width={CARD_WIDTH}
                            // Pass the RAW rotation value for calculation to avoid lag
                            rotation={rotation}
                            onClick={() => !isDragging && onSelect(item)}
                        />
                    );
                })}
            </motion.div>

            <div className="absolute bottom-10 opacity-30 text-stone-500 font-bold uppercase tracking-[0.3em] text-[10px] pointer-events-none select-none">
                Drag to Spin
            </div>
        </motion.div>
    );
};

const GalleryItem = ({ item, angle, radius, width, rotation, onClick }) => {

    // Calculate global angle to determine visibility/opacity
    // We transform the container's rotation + item's static angle
    const effectiveAngle = useTransform(rotation, (r) => {
        let a = (angle + r) % 360;
        if (a > 180) a -= 360;
        if (a < -180) a += 360;
        return a;
    });

    const distance = useTransform(effectiveAngle, (a) => Math.abs(a));

    // Opacity: Fade out back items
    const opacity = useTransform(distance, [0, 90, 180], [1, 0.3, 0]);

    // Pointer Iteraction: Only front items intersect mouse
    const pointerEvents = useTransform(distance, d => d < 90 ? 'auto' : 'none');

    return (
        <div
            className="absolute flex items-center justify-center transform-style-3d top-0 left-0"
            style={{
                // Strict Geometric Placement
                // 1. Rotate to angle
                // 2. Push out by radius
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                backfaceVisibility: 'hidden', // Performance optimization
                WebkitBackfaceVisibility: 'hidden'
            }}
        >
            {/* Visual Card - Centered on the point */}
            <motion.div
                onClick={onClick}
                className="relative flex flex-col items-center gap-4"
                style={{
                    width: width,
                    x: '-50%', // Center horizontally on the anchor point
                    y: '-50%', // Center vertically on the anchor point
                    opacity,
                    pointerEvents,
                }}
            >
                {/* Image Container */}
                <div className="w-full aspect-[4/5] rounded-[24px] bg-stone-900 border-[4px] border-white shadow-2xl relative overflow-hidden group">

                    {/* Image */}
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover filter grayscale-[0.3] contrast-125 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 will-change-transform"
                    />

                    {/* Gloss Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

                    {/* Price Pill */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-black px-2.5 py-1 rounded-full border border-white/10">
                        ₹{item.price}
                    </div>
                </div>

                {/* Floating Label */}
                <div className="text-center transform translate-z-10">
                    <h3 className="text-stone-800 text-lg font-black uppercase tracking-tight leading-none drop-shadow-sm">
                        {item.name}
                    </h3>
                </div>

            </motion.div>
        </div>
    );
};

export default CircularGallery;
