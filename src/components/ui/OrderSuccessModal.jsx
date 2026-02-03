import { motion, AnimatePresence } from 'framer-motion';

export default function OrderSuccessModal({ isOpen, onClose, orderId }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl max-w-sm w-full text-center relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-amber-600" />
                        <div className="absolute inset-0 bg-yellow-500/5 blur-[50px] pointer-events-none" />

                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                            className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center text-black shadow-lg shadow-green-500/20"
                        >
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </motion.div>

                        <h2 className="text-3xl font-bold text-white mb-2">Order Placed!</h2>
                        <div className="bg-neutral-800/50 rounded-lg p-3 mb-6 border border-neutral-800">
                            <p className="text-neutral-400 text-sm">Order ID</p>
                            <p className="text-yellow-500 font-mono font-bold text-xl">#{orderId?.slice(-4)}</p>
                        </div>
                        <p className="text-neutral-400 mb-8 text-sm">Your order has been sent to the kitchen and is being prepared.</p>

                        <button
                            onClick={onClose}
                            className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-3 rounded-xl transition-colors shadow-lg"
                        >
                            Back to Menu
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
