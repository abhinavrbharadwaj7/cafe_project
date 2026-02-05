import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function OrderSuccessModal({ isOpen, onClose, orderId }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-stone-950/90 backdrop-blur-3xl border border-white/10 p-10 rounded-[32px] max-w-sm w-full text-center relative overflow-hidden shadow-[0_0_100px_-20px_rgba(16,185,129,0.3)] ring-1 ring-white/5"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none" />

                        {/* Animated Checkmark */}
                        <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                                className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl"
                            />
                            <div className="w-full h-full rounded-full border border-emerald-500/30 flex items-center justify-center bg-emerald-950/30 relative z-10 box-border">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                                    <motion.path
                                        d="M20 6L9 17l-5-5"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                                    />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-4xl font-black text-white mb-2 tracking-tighter drop-shadow-lg">ORDER SENT!</h2>

                        <div className="relative py-6 my-6 border-y border-dashed border-white/10">
                            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Kitchen Ticket ID</p>
                            <p className="text-emerald-400 font-mono font-black text-3xl tracking-widest">#{orderId?.slice(-4)}</p>
                        </div>

                        <p className="text-stone-400 mb-8 text-sm font-medium leading-relaxed px-4">
                            You can relax now. We'll bring your order to your table shortly.
                        </p>

                        <button
                            onClick={onClose}
                            className="w-full bg-white hover:bg-emerald-50 text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2 group"
                        >
                            <span>Back to Menu</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
