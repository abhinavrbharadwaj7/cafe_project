import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useCafe } from "../../context/CafeContext";
import LiveTimer from "../../components/ui/LiveTimer";

export const ResponsiveNavbar = ({ cartCount, onCartClick }) => {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { orders } = useCafe();

    // Find the latest active order (pending or preparing)
    // In a real app, this would be filtered by the user's session ID
    // For this demo, we'll show the most recent active order 
    const activeOrder = orders
        .filter(o => o.status && o.status !== 'completed' && o.status !== 'cancelled')
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
        setScrolled(latest > 50);
    });

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300 ${scrolled
                ? 'bg-stone-50/80 backdrop-blur-xl border-b border-stone-200'
                : 'bg-transparent'
                }`}
        >
            <span className="text-xl font-bold tracking-tighter text-stone-900">LUXE.</span>

            <div className="flex items-center gap-6">

                {/* Active Order Timer Pill */}
                {activeOrder && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 bg-stone-900/90 backdrop-blur-md text-stone-100 px-4 py-2 rounded-full text-xs font-mono shadow-lg border border-white/10"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span className="opacity-70 uppercase tracking-wider">Preparing</span>
                        <span className="text-amber-400 font-bold tabular-nums">
                            <LiveTimer timestamp={activeOrder.timestamp} />
                        </span>
                    </motion.div>
                )}

                <button
                    onClick={onCartClick}
                    className="relative group flex items-center gap-2"
                >
                    <div className="bg-stone-200/50 p-2.5 rounded-full group-hover:bg-amber-500 transition-colors">
                        <ShoppingBag size={20} className="text-stone-900 group-hover:text-white transition-colors" />
                    </div>
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 rounded-full text-[10px] font-bold flex items-center justify-center text-white border-2 border-stone-50">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>
        </motion.nav>
    );
};
