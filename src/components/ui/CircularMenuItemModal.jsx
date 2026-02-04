import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Flame, Wheat, Droplet, Dumbbell } from 'lucide-react';

export const CircularMenuItemModal = ({ item, isOpen, onClose, onAddToCart }) => {
    const [isFlying, setIsFlying] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const handleAdd = async () => {
        setIsFlying(true);
        // Wait for animation to fly to cart
        await new Promise(resolve => setTimeout(resolve, 800));
        onAddToCart(item, quantity);
        onClose();
        setIsFlying(false);
    };

    useEffect(() => {
        if (isOpen) setQuantity(1);
    }, [isOpen]);

    if (!item) return null;

    // Orbit Animation Variants
    const orbitVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    // Ingredients placement logic
    const ingredients = item.ingredients || [];
    const radius = 240; // Increased distance from center

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xl transition-all duration-500"
                    />

                    {/* Main Container */}
                    <div className="relative w-full max-w-lg h-auto max-h-[90vh] flex flex-col items-center justify-center pointer-events-none">

                        {/* Close Button */}
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, transition: { delay: 0.5 } }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={onClose}
                            className="absolute top-0 right-0 md:-right-12 md:top-0 m-4 md:m-0 z-50 p-2 bg-stone-100 rounded-full text-stone-900 shadow-xl hover:bg-stone-200 pointer-events-auto"
                        >
                            <X size={24} />
                        </motion.button>

                        {/* Central Visual "Pop" */}
                        <div className="relative flex items-center justify-center h-[400px] w-[400px] mb-8">

                            {/* Orbiting Ingredients Ring */}
                            <motion.div
                                variants={orbitVariants}
                                animate="animate"
                                className="absolute inset-0 rounded-full pointer-events-none"
                            >
                                {ingredients.map((ing, i) => {
                                    const angle = (i / ingredients.length) * 2 * Math.PI;
                                    const x = Math.cos(angle) * radius;
                                    const y = Math.sin(angle) * radius;

                                    return (
                                        <div
                                            key={i}
                                            className="absolute w-20 h-20 flex items-center justify-center"
                                            style={{
                                                top: '50%',
                                                left: '50%',
                                                transform: `translate(${x - 40}px, ${y - 40}px)`, // Centering offset
                                            }}
                                        >
                                            <motion.div
                                                // Counter-rotate to keep text upright
                                                animate={{ rotate: -360 }}
                                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                className="bg-stone-900/80 backdrop-blur-md border border-stone-700 px-3 py-1.5 rounded-full shadow-lg"
                                            >
                                                <span className="text-[10px] font-bold text-stone-200 uppercase tracking-wider whitespace-nowrap">
                                                    {ing}
                                                </span>
                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </motion.div>

                            {/* Glowing Backdrop behind image */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1.2, opacity: 0.5 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full"
                            />

                            {/* Main Image */}
                            <motion.div
                                initial={{ scale: 0, rotate: 90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: -45 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden shadow-2xl border-4 border-stone-800/50 relative z-20"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover scale-110"
                                />
                                {/* Gloss Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                            </motion.div>
                        </div>

                        {/* Details Card - LIQUID GLASS UPDATE */}
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ delay: 0.2 }}
                            className="pointer-events-auto bg-stone-950/60 backdrop-blur-[40px] border border-white/10 p-8 rounded-[3rem] w-full shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] z-30 flex flex-col gap-6 text-stone-100 ring-1 ring-white/5 relative overflow-hidden"
                        >
                            {/* Subtle glossy sheen overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

                            <div className="text-center relative z-10">
                                <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 text-white drop-shadow-xl">{item.name}</h2>
                                <p className="text-stone-400 font-medium tracking-wide text-xs opacity-80">{item.description}</p>
                            </div>

                            {/* Nutrition Stats - Glass Pills */}
                            <div className="grid grid-cols-4 gap-3 relative z-10">
                                <NutritionPill icon={<Flame size={12} />} label="Cal" value={item.nutrition?.calories || '-'} />
                                <NutritionPill icon={<Dumbbell size={12} />} label="Prot" value={item.nutrition?.protein || '-'} />
                                <NutritionPill icon={<Wheat size={12} />} label="Carbs" value={item.nutrition?.carbs || '-'} />
                                <NutritionPill icon={<Droplet size={12} />} label="Fats" value={item.nutrition?.fats || '-'} />
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />

                            {/* Footer Actions */}
                            <div className="flex items-center justify-between gap-4 relative z-10">
                                {/* Price */}
                                <div className="text-3xl font-black text-amber-500 drop-shadow-lg tracking-tight">₹{item.price * quantity}</div>

                                {/* Controls */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-black/40 backdrop-blur-md rounded-full p-1.5 border border-white/5 shadow-inner">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-stone-300 active:scale-95"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-10 text-center font-bold font-mono text-lg">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white active:scale-95"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleAdd}
                                        disabled={isFlying}
                                        className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] flex items-center gap-2 relative overflow-hidden"
                                    >
                                        <div className={`flex items-center gap-2 transition-transform duration-300 ${isFlying ? '-translate-y-12' : 'translate-y-0'}`}>
                                            <ShoppingBag size={14} strokeWidth={3} />
                                            Add
                                        </div>
                                        <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isFlying ? 'translate-y-0' : 'translate-y-12'}`}>
                                            <span className="text-emerald-600 font-black text-xl">✓</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* FLYING CART ANIMATION ORB */}
                        {isFlying && (
                            <motion.div
                                initial={{ top: '50%', left: '50%', scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
                                animate={{
                                    top: '40px',
                                    left: 'calc(100% - 40px)',
                                    scale: 0.1,
                                    opacity: 0.5
                                }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="fixed z-[100] w-32 h-32 rounded-full overflow-hidden shadow-2xl border-4 border-amber-500 pointer-events-none"
                            >
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                            </motion.div>
                        )}

                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

const NutritionPill = ({ icon, label, value }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-colors group shadow-inner">
        <div className="text-stone-400 group-hover:text-amber-400 transition-colors">
            {icon}
        </div>
        <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-white leading-none mb-1">{value}</span>
            <span className="text-[9px] uppercase tracking-widest text-stone-500 font-bold">{label}</span>
        </div>
    </div>
);

export default CircularMenuItemModal;

