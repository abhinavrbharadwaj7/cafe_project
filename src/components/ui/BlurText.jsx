import { motion } from 'framer-motion';

export const BlurTextFramer = ({
    text = '',
    delay = 50,
    className = '',
    animateBy = 'letters', // 'words' or 'letters'
    direction = 'top',
}) => {
    const elements = animateBy === 'words' ? text.split(' ') : text.split('');

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: delay / 1000, delayChildren: 0.1 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: direction === 'top' ? -20 : 20,
            filter: "blur(10px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            className={`flex flex-wrap ${className}`}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {elements.map((char, index) => (
                <motion.span variants={child} key={index} className="mr-[0.1em] inline-block">
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </motion.div>
    );
};
