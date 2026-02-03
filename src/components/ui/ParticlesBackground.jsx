import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const ParticlesBackground = ({ className, quantity = 50 }) => {
    const canvasRef = useRef(null);
    const context = useRef(null);
    const circles = useRef([]);
    const mouse = useRef({ x: 0, y: 0 });
    const canvasSize = useRef({ w: 0, h: 0 });
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

    useEffect(() => {
        if (canvasRef.current) {
            context.current = canvasRef.current.getContext("2d");
        }
        initCanvas();
        animate();
        window.addEventListener("resize", initCanvas);

        return () => {
            window.removeEventListener("resize", initCanvas);
        };
    }, []);

    useEffect(() => {
        onMouseMove();
    }, [mouse.current.x, mouse.current.y]);

    const initCanvas = () => {
        resizeCanvas();
        drawParticles();
    };

    const onMouseMove = () => {
        if (canvasRef.current) {
            window.addEventListener("mousemove", (e) => {
                const rect = canvasRef.current.getBoundingClientRect();
                const { w, h } = canvasSize.current;
                const x = e.clientX - rect.left - w / 2;
                const y = e.clientY - rect.top - h / 2;
                const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
                if (inside) {
                    mouse.current.x = x;
                    mouse.current.y = y;
                }
            });
        }
    };

    const resizeCanvas = () => {
        if (canvasRef.current && context.current) {
            circles.current.length = 0;
            canvasSize.current.w = canvasRef.current.parentElement.offsetWidth;
            canvasSize.current.h = canvasRef.current.parentElement.offsetHeight;
            canvasRef.current.width = canvasSize.current.w * dpr;
            canvasRef.current.height = canvasSize.current.h * dpr;
            canvasRef.current.style.width = `${canvasSize.current.w}px`;
            canvasRef.current.style.height = `${canvasSize.current.h}px`;
            context.current.scale(dpr, dpr);
        }
    };

    const circleParams = () => {
        const x = Math.floor(Math.random() * canvasSize.current.w);
        const y = Math.floor(Math.random() * canvasSize.current.h);
        const translateX = 0;
        const translateY = 0;
        const size = Math.floor(Math.random() * 2) + 0.1;
        const alpha = 0;
        const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
        const dx = (Math.random() - 0.5) * 0.2;
        const dy = (Math.random() - 0.5) * 0.2;
        const magnetism = 0.1 + Math.random() * 4;
        return { x, y, translateX, translateY, size, alpha, targetAlpha, dx, dy, magnetism };
    };

    const drawCircle = (circle, update = false) => {
        if (context.current) {
            const { x, y, translateX, translateY, size, alpha } = circle;
            context.current.translate(translateX, translateY);
            context.current.beginPath();
            context.current.arc(x, y, size, 0, 2 * Math.PI);
            context.current.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            context.current.fill();
            context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

            if (!update) {
                circles.current.push(circle);
            }
        }
    };

    const clearContext = () => {
        if (context.current) {
            context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
        }
    };

    const drawParticles = () => {
        clearContext();
        const particleCount = quantity;
        for (let i = 0; i < particleCount; i++) {
            const circle = circleParams();
            drawCircle(circle);
        }
    };

    const remapValue = (value, start1, stop1, start2, stop2) => {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    };

    const animate = () => {
        clearContext();
        circles.current.forEach((circle, i) => {
            // Handle the alpha value
            const edge = [
                circle.x + circle.translateX - circle.size, // distance from left edge
                canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
                circle.y + circle.translateY - circle.size, // distance from top edge
                canvasSize.current.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
            ];
            const closestEdge = edge.reduce((a, b) => Math.min(a, b));
            const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
            if (remapClosestEdge > 1) {
                circle.alpha += 0.02;
                if (circle.alpha > circle.targetAlpha) circle.alpha = circle.targetAlpha;
            } else {
                circle.alpha = circle.targetAlpha * remapClosestEdge;
            }
            circle.x += circle.dx;
            circle.y += circle.dy;
            circle.translateX += ((mouse.current.x / (canvasSize.current.w / 100)) - circle.translateX) / 500 * circle.magnetism; // Slow movement
            circle.translateY += ((mouse.current.y / (canvasSize.current.h / 100)) - circle.translateY) / 500 * circle.magnetism; // Slow movement
            // circle.translateX += ((mouse.current.x / (canvasSize.current.w / 100)) - circle.translateX) * circle.magnetism;
            // circle.translateY += ((mouse.current.y / (canvasSize.current.h / 100)) - circle.translateY) * circle.magnetism;

            if (circle.x < -circle.size || circle.x > canvasSize.current.w + circle.size || circle.y < -circle.size || circle.y > canvasSize.current.h + circle.size) {
                // circle.x = Math.random() * canvasSize.current.w;
                // circle.y = Math.random() * canvasSize.current.h;
                // For now, just bounce
                circle.dx = -circle.dx;
                circle.dy = -circle.dy;

            }
            drawCircle(circle, true);
        });
        window.requestAnimationFrame(animate);
    };

    return (
        <div className={className} ref={canvasRef.current}>
            <canvas ref={canvasRef} />
        </div>
    );
};
