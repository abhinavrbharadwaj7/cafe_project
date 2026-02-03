import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';

export const ReceiptCart = ({ isOpen, onClose, cart, placeOrder, id, setSuccessOrderId }) => {
    const containerRef = useRef(null);

    const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const tax = subtotal * 0.08; // 8% Tax Simulation
    const total = subtotal + tax;

    const date = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-stone-900/60 backdrop-blur-sm cursor-auto"
                    />
                    <motion.div
                        initial={{ x: "100%", rotate: "2deg" }}
                        animate={{ x: 0, rotate: "0deg" }}
                        exit={{ x: "100%", rotate: "5deg" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-2 right-2 bottom-2 z-[60] w-full max-w-sm flex flex-col pointer-events-none"
                    >
                        {/* Paper Receipt Container */}
                        <div className="relative w-full h-full bg-[#fdfbf7] shadow-2xl flex flex-col pointer-events-auto overflow-hidden font-mono text-stone-900"
                            style={{
                                boxShadow: "0 0 40px rgba(0,0,0,0.2)",
                                maskImage: "linear-gradient(to bottom, transparent, black 1%, black 99%, transparent)",
                            }}
                        >
                            {/* Jagged Top Edge */}
                            <div className="absolute top-0 left-0 right-0 h-4 bg-[#fdfbf7] z-10"
                                style={{
                                    maskImage: "linear-gradient(45deg, transparent 33%, black 33%, black 66%, transparent 66%), linear-gradient(-45deg, transparent 33%, black 33%, black 66%, transparent 66%)",
                                    maskSize: "20px 40px",
                                    maskPosition: "0 -20px"
                                }}
                            />

                            {/* Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
                                <span className="text-9xl font-black -rotate-45 whitespace-nowrap">CAFE LUXE</span>
                            </div>

                            {/* Header */}
                            <div className="pt-8 pb-6 px-6 text-center border-b-2 border-dashed border-stone-300 relative z-10">
                                <div className="flex justify-between absolute top-4 right-4">
                                    <button onClick={onClose} className="p-1 hover:bg-stone-200 rounded-full transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                                <h2 className="text-2xl font-black mb-1 tracking-tight">CAFE LUXE</h2>
                                <p className="text-xs uppercase tracking-widest text-stone-500 mb-4">New York, NY</p>

                                <div className="flex justify-between text-xs text-stone-500 mt-4 border-t border-dashed border-stone-300 pt-2">
                                    <span>TABLE #{id || '1'}</span>
                                    <span>{date} {time}</span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 relative z-10 custom-scrollbar">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-2">
                                        <span className="text-4xl opacity-20">☕</span>
                                        <p>-- EMPTY ORDER --</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-xs text-stone-400 border-b border-stone-200">
                                                <th className="pb-2 font-normal">QTY</th>
                                                <th className="pb-2 font-normal pl-2">ITEM</th>
                                                <th className="pb-2 font-normal text-right">AMT</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-dotted divide-stone-300">
                                            {cart.map((item, i) => (
                                                <tr key={i} className="align-top">
                                                    <td className="py-3 w-8">{item.quantity}</td>
                                                    <td className="py-3 pl-2">
                                                        <div className="font-bold">{item.name}</div>
                                                        {/* Optional: Add modifiers here if we had them */}
                                                    </td>
                                                    <td className="py-3 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* Footer Totals */}
                            <div className="px-6 pb-6 pt-4 bg-[#fcfaf5] border-t-2 border-dashed border-stone-300 relative z-10">
                                <div className="space-y-1 text-sm mb-6">
                                    <div className="flex justify-between text-stone-500">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-stone-500">
                                        <span>Tax (8%)</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold mt-4 pt-2 border-t border-stone-900 border-dashed">
                                        <span>TOTAL</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        const orderId = placeOrder(id || '1');
                                        if (orderId) {
                                            setSuccessOrderId(orderId);
                                            onClose();
                                        }
                                    }}
                                    disabled={cart.length === 0}
                                    className="w-full py-3 bg-stone-900 text-[#fdfbf7] font-bold uppercase tracking-widest text-sm hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:hover:bg-stone-900 flex items-center justify-center gap-2 group"
                                >
                                    <span>Confirm Order</span>
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="mt-6 text-center">
                                    <p className="text-[10px] text-stone-400 uppercase tracking-widest">Thank you for dining with us</p>
                                    {/* Fake Barcode */}
                                    <div className="h-8 w-2/3 mx-auto mt-2 opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjMwIiB4PSIwIiBmaWxsPSJibGFjayIvPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjMwIiB4PSI0IiBmaWxsPSJibGFjayIvPjxyZWN0IHdpZHRoPSIzIiBoZWlnaHQ9IjMwIiB4PSI4IiBmaWxsPSJibGFjayIvPjwvc3ZnPg==')] bg-contain bg-repeat-x" />
                                </div>
                            </div>

                            {/* Jagged Bottom Edge */}
                            {/* CSS Masking for jagged edge is tricky without explicit height/width, simpler to use a pseudo element or clip-path */}
                        </div>
                        {/* Real Jagged Bottom using CSS Cliph Path on a small strip */}
                        <div className="h-3 w-full bg-[#fdfbf7] -mt-[1px]"
                            style={{
                                clipPath: "polygon(0 0, 2% 100%, 4% 0, 6% 100%, 8% 0, 10% 100%, 12% 0, 14% 100%, 16% 0, 18% 100%, 20% 0, 22% 100%, 24% 0, 26% 100%, 28% 0, 30% 100%, 32% 0, 34% 100%, 36% 0, 38% 100%, 40% 0, 42% 100%, 44% 0, 46% 100%, 48% 0, 50% 100%, 52% 0, 54% 100%, 56% 0, 58% 100%, 60% 0, 62% 100%, 64% 0, 66% 100%, 68% 0, 70% 100%, 72% 0, 74% 100%, 76% 0, 78% 100%, 80% 0, 82% 100%, 84% 0, 86% 100%, 88% 0, 90% 100%, 92% 0, 94% 100%, 96% 0, 98% 100%, 100% 0)"
                            }}
                        />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
