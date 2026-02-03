import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";

export const ResponsiveNavbar = ({ cartCount, onCartClick }) => {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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
