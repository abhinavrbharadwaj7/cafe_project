import { useMotionValue, motion, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export const HoverImageLinks = ({ items, onSelect }) => {
    return (
        <section className="bg-stone-50 p-4 md:p-8">
            <div className="mx-auto max-w-5xl">
                {items.map((item, idx) => (
                    <Link
                        key={item.id}
                        heading={item.name}
                        subheading={item.description}
                        imgSrc={item.image}
                        price={item.price}
                        onSelect={() => onSelect(item)}
                    />
                ))}
            </div>
        </section>
    );
};

const Link = ({ heading, subheading, imgSrc, price, onSelect }) => {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
    const left = useTransform(mouseXSpring, [0.5, -0.5], ["60%", "70%"]);

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    return (
        <motion.div
            ref={ref}
            onClick={onSelect}
            onMouseMove={handleMouseMove}
            initial="initial"
            whileHover="whileHover"
            className="group relative flex items-center justify-between border-b border-stone-200 py-6 md:py-10 transition-colors hover:border-stone-900 md:cursor-none cursor-pointer"
        >
            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 z-10 w-full">
                <motion.span
                    variants={{
                        initial: { x: 0 },
                        whileHover: { x: -16 },
                    }}
                    transition={{
                        type: "spring",
                        staggerChildren: 0.075,
                        delayChildren: 0.25,
                    }}
                    className="text-3xl md:text-6xl font-black text-stone-300 transition-colors duration-500 group-hover:text-stone-900 block md:inline-block"
                >
                    <span className="md:hidden inline-block w-16 h-16 mr-4 rounded-lg overflow-hidden align-middle bg-stone-200">
                        <img src={imgSrc} alt={heading} className="w-full h-full object-cover" />
                    </span>
                    {heading}
                </motion.span>

                <span className="text-stone-400 group-hover:text-stone-600 transition-colors text-sm md:text-lg max-w-md line-clamp-2 md:line-clamp-1">
                    {subheading}
                </span>
            </div>

            <div className="z-10 relative flex items-center gap-4">
                <span className="text-2xl md:text-4xl font-mono text-amber-600 font-bold">₹{price.toFixed(2)}</span>
                <motion.div
                    variants={{
                        initial: { x: -10, opacity: 0 },
                        whileHover: { x: 0, opacity: 1 },
                    }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 md:w-12 md:h-12 text-stone-900"
                    >
                        <path
                            d="M7 17L17 7M17 7H7M17 7V17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </motion.div>
            </div>

            <motion.img
                style={{
                    top,
                    left,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                variants={{
                    initial: { scale: 0, rotate: "-12.5deg" },
                    whileHover: { scale: 1, rotate: "12.5deg" },
                }}
                transition={{ type: "spring" }}
                src={imgSrc}
                className="absolute z-0 h-48 w-64 rounded-xl object-cover md:h-72 md:w-96 hidden md:block border-4 border-neutral-50/20 pointer-events-none"
                alt={`Image representing a link for ${heading}`}
            />
        </motion.div>
    );
};
