import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCafe } from '../../context/CafeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItemDrawer } from '../../components/ui/MenuItemDrawer';
import OrderSuccessModal from '../../components/ui/OrderSuccessModal';
import { ResponsiveNavbar } from '../../components/ui/ResponsiveNavbar';
import { ChevronRight } from 'lucide-react';
import { BlurTextFramer } from '../../components/ui/BlurText';
import { ShinyText } from '../../components/ui/ShinyText';
import Antigravity from '../../components/ui/Antigravity';
import { HoverImageLinks } from '../../components/ui/HoverImageLinks';
import Certifications from '../../components/ui/Certifications';
// import StickyFooter from '../../components/ui/StickyFooter'; // No longer importing directly here if we duplicate logic, but let's use the component.
// Actually, to ensure it works perfectly without import errors, I will inline the structure or ensure the previous file creation worked. 
// The previous file creation succeeded.
import StickyFooter from '../../components/ui/StickyFooter';
import Lenis from '@studio-freight/lenis';
import { CustomCursor } from '../../components/ui/CustomCursor';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { ReceiptCart } from '../../components/ui/ReceiptCart';

export default function CustomerMenu() {
    const { menu, addToCart, cart, placeOrder } = useCafe();
    const { id } = useParams();
    const [successOrderId, setSuccessOrderId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeCategory, setActiveCategory] = useState("all");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [hasFallen, setHasFallen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (scrollY > 100 && !hasFallen) {
                setHasFallen(true);
            } else if (scrollY < 50 && hasFallen) {
                setHasFallen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Initialize Lenis for smooth scrolling
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            window.removeEventListener('scroll', handleScroll);
        }
    }, [hasFallen]);

    const handleAddToCart = (item, quantity) => {
        for (let i = 0; i < quantity; i++) addToCart(item);
    };

    const categories = ["all", ...menu.map(c => c.name)];
    const filteredItems = activeCategory === "all"
        ? menu.flatMap(c => c.items)
        : menu.find(c => c.name === activeCategory)?.items || [];

    return (
        <div className="bg-stone-50 min-h-screen text-stone-900 font-sans selection:bg-amber-200 cursor-none">
            <CustomCursor />

            <OrderSuccessModal
                isOpen={!!successOrderId}
                onClose={() => setSuccessOrderId(null)}
                orderId={successOrderId}
            />

            <MenuItemDrawer
                item={selectedItem}
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                onAddToCart={handleAddToCart}
            />

            <ResponsiveNavbar cartCount={cart.reduce((a, b) => a + b.quantity, 0)} onCartClick={() => setIsCartOpen(true)} />

            {/* Main Content Wrapper - Needs Background to Cover Sticky Footer */}
            <div className="relative z-10 bg-stone-50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] mb-[800px]">
                {/* Hero Section */}
                <div className="h-screen flex items-center justify-center relative overflow-hidden bg-stone-50">
                    <Antigravity
                        count={300}
                        magnetRadius={6}
                        ringRadius={7}
                        waveSpeed={0.4}
                        waveAmplitude={1}
                        particleSize={0.6}
                        lerpSpeed={0.05}
                        color="#6F4E37" // Coffee Color
                        autoAnimate
                        particleVariance={1}
                        rotationSpeed={0}
                        depthFactor={1}
                        pulseSpeed={3}
                        particleShape="capsule"
                        fieldStrength={10}
                        isFalling={hasFallen}
                    />

                    <div className="text-center px-4 relative z-20 pointer-events-none">
                        <div className="mb-6 flex justify-center">
                            <span className="inline-block px-4 py-1.5 rounded-full border border-stone-400/30 bg-stone-100/50 text-stone-600 text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md shadow-sm">
                                Est. 2024 &bull; Mumbai
                            </span>
                        </div>

                        <div className="text-7xl md:text-[10rem] font-black text-stone-900 tracking-tighter mb-4 leading-[0.85]">
                            <BlurTextFramer text="CAFE LUXE" delay={150} />
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="text-stone-600 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed mb-10"
                        >
                            <ShinyText text="Experience the art of coffee in a space designed for clarity, comfort, and creativity." speed={4} />
                        </motion.p>

                        <div className="flex justify-center pointer-events-auto">
                            <MagneticButton
                                onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
                                className="bg-stone-900 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-amber-500/20"
                            >
                                Explore Menu
                            </MagneticButton>
                        </div>
                    </div>
                </div>

                {/* Menu Section */}
                <main id="menu" className="max-w-7xl mx-auto px-4 md:px-6 py-24 min-h-screen bg-stone-50">
                    <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 px-4">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 md:mb-0 text-stone-900">MENU</h2>

                        {/* Category Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto scrollbar-none">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer ${activeCategory === cat
                                        ? "bg-stone-900 text-white scale-105 shadow-lg shadow-stone-900/20"
                                        : "bg-stone-100 border border-stone-200 text-stone-500 hover:bg-stone-200"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Unique Hover Image Reveal List */}
                    <HoverImageLinks
                        items={filteredItems}
                        onSelect={setSelectedItem}
                    />

                </main>

                {/* Certifications Section */}
                <Certifications />
            </div>

            {/* Sticky Reveal Footer - Sits behind content */}
            <StickyFooter />

            {/* Receipt Style Cart Drawer */}
            <ReceiptCart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                placeOrder={placeOrder}
                id={id}
                setSuccessOrderId={setSuccessOrderId}
            />

        </div>
    );
}
