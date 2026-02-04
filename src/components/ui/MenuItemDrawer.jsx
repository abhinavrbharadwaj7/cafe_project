import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useState } from "react";

export const MenuItemDrawer = ({ item, isOpen, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    if (!item) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 h-[85vh] bg-stone-50 rounded-t-[2rem] overflow-hidden shadow-2xl border-t border-stone-200"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full text-stone-900/80 hover:text-stone-900"
                        >
                            <X size={24} />
                        </button>

                        {/* Image */}
                        <div className="h-[40%] relative">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900/60" />
                        </div>

                        {/* Content */}
                        <div className="px-6 py-6 h-[60%] flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-3xl font-bold text-stone-900">{item.name}</h2>
                                <span className="text-2xl font-mono text-amber-600">₹{item.price.toFixed(2)}</span>
                            </div>

                            <p className="text-stone-600 leading-relaxed mb-6">{item.description}</p>

                            <div className="mt-auto space-y-4">
                                <div className="flex items-center justify-between bg-stone-100 p-4 rounded-xl border border-stone-200">
                                    <span className="text-stone-900 font-medium">Quantity</span>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-900 hover:bg-stone-300 transition-colors"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="text-xl font-bold w-6 text-center text-stone-900">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-900 hover:bg-stone-300 transition-colors"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        onAddToCart(item, quantity);
                                        onClose();
                                        setQuantity(1);
                                    }}
                                    className="w-full py-4 bg-stone-900 hover:bg-amber-600 active:scale-[0.98] transition-all rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-stone-900/20"
                                >
                                    <ShoppingBag size={20} />
                                    Add to Order - ₹{(item.price * quantity).toFixed(2)}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
