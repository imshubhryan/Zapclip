"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";

export type Tag = "h1" | "h2" | "h3" | "p";

type VaporizeTextCycleProps = {
    texts: string[];
    font?: {
        fontFamily?: string;
        fontSize?: string;
        fontWeight?: number;
    };
    color?: string;
    spread?: number;
    density?: number;
    animation?: {
        vaporizeDuration?: number;
        fadeInDuration?: number;
    };
    direction?: "left-to-right" | "right-to-left";
    alignment?: "left" | "center" | "right";
    tag?: Tag;
};

type Particle = {
    x: number;
    y: number;
    originalX: number;
    originalY: number;
    color: string;
    opacity: number;
    velocityX: number;
    velocityY: number;
    angle: number;
    speed: number;
    shouldFadeQuickly: boolean;
};

export default function VaporizeTextCycle({
    texts = ["Next.js", "React"],
    font = { fontFamily: "sans-serif", fontSize: "50px", fontWeight: 400 },
    color = "rgb(255, 255, 255)",
    spread = 5,
    density = 5,
    animation = { vaporizeDuration: 2, fadeInDuration: 1 },
    direction = "left-to-right",
    alignment = "center",
    tag = "p",
}: VaporizeTextCycleProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);

    // Internal state refs to prevent infinite loops in the animation useEffect
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [animationState, setAnimationState] = useState<"static" | "vaporizing" | "fadingIn">("static");
    const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });

    const stateRef = useRef(animationState);
    const indexRef = useRef(currentTextIndex);
    const vaporizeProgressRef = useRef(0);
    const fadeOpacityRef = useRef(0);
    const boundariesRef = useRef({ left: 0, right: 0, width: 0 });

    useEffect(() => { stateRef.current = animationState; }, [animationState]);
    useEffect(() => { indexRef.current = currentTextIndex; }, [currentTextIndex]);

    const globalDpr = useMemo(() => {
        if (typeof window !== "undefined") return (window.devicePixelRatio || 1) * 1.5;
        return 1;
    }, []);

    const fontStyle = useMemo(() => {
        const size = parseInt(font.fontSize?.replace("px", "") || "50");
        return (font.fontWeight ?? 400) + " " + (size * globalDpr) + "px " + (font.fontFamily || "sans-serif");
    }, [font, globalDpr]);

    const drawText = useCallback((ctx: CanvasRenderingContext2D, text: string, alpha: number) => {
        const { width, height } = wrapperSize;
        if (!width || !height) return;

        ctx.clearRect(0, 0, width * globalDpr, height * globalDpr);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.font = fontStyle;
        ctx.textAlign = alignment as CanvasTextAlign;
        ctx.textBaseline = "middle";

        let x = 0;
        if (alignment === "center") x = (width * globalDpr) / 2;
        else if (alignment === "right") x = width * globalDpr;

        ctx.fillText(text, x, (height * globalDpr) / 2);

        if (stateRef.current === "static") {
            const metrics = ctx.measureText(text);
            const w = metrics.width;
            let left;
            if (alignment === "center") left = x - w / 2;
            else if (alignment === "left") left = x;
            else left = x - w;
            boundariesRef.current = { left, right: left + w, width: w };
        }
        ctx.restore();
    }, [wrapperSize, globalDpr, fontStyle, color, alignment]);

    const initParticles = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { width, height } = wrapperSize;
        drawText(ctx, texts[indexRef.current], 1);
        const imageData = ctx.getImageData(0, 0, width * globalDpr, height * globalDpr);
        const data = imageData.data;

        const ps: Particle[] = [];
        const sr = Math.max(1, Math.round(globalDpr / 2));
        const den = 0.5 + (density * 0.05);

        for (let y = 0; y < canvas.height; y += sr) {
            for (let x = 0; x < canvas.width; x += sr) {
                const idx = (y * canvas.width + x) * 4;
                if (data[idx + 3] > 0) {
                    ps.push({
                        x, y, originalX: x, originalY: y,
                        color: `rgba(${data[idx]}, ${data[idx + 1]}, ${data[idx + 2]}, 1)`,
                        opacity: data[idx + 3] / 255,
                        velocityX: 0, velocityY: 0, angle: 0, speed: 0,
                        shouldFadeQuickly: Math.random() > den
                    });
                }
            }
        }
        particlesRef.current = ps;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    useEffect(() => {
        const container = wrapperRef.current;
        if (!container) return;
        const resize = () => {
            const rect = container.getBoundingClientRect();
            if (rect.width > 0) setWrapperSize({ width: rect.width, height: rect.height });
        };
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !wrapperSize.width) return;
        canvas.width = Math.floor(wrapperSize.width * globalDpr);
        canvas.height = Math.floor(wrapperSize.height * globalDpr);
        canvas.style.width = wrapperSize.width + "px";
        canvas.style.height = wrapperSize.height + "px";
    }, [wrapperSize, globalDpr]);

    useEffect(() => {
        let lastTime = performance.now();
        let frameId: number;

        const animate = (time: number) => {
            const dt = (time - lastTime) / 1000;
            lastTime = time;
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!canvas || !ctx) return;

            const currentState = stateRef.current;

            if (currentState === "static") {
                drawText(ctx, texts[indexRef.current], 1);
            } else if (currentState === "vaporizing") {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                vaporizeProgressRef.current += dt * 100 / (animation.vaporizeDuration || 2);
                const progress = Math.min(100, vaporizeProgressRef.current);
                const tB = boundariesRef.current;
                const vX = direction === "left-to-right"
                    ? tB.left + tB.width * progress / 100
                    : tB.right - tB.width * progress / 100;

                const mS = (0.2 + (parseInt(font.fontSize || "50") - 20) * 0.01) * (spread || 5);
                let allV = true;

                particlesRef.current.forEach(p => {
                    if (p.opacity <= 0) return;
                    const triggered = direction === "left-to-right" ? p.originalX <= vX : p.originalX >= vX;
                    if (triggered) {
                        if (p.speed === 0) {
                            p.angle = Math.random() * Math.PI * 2;
                            p.speed = (Math.random() * 1 + 0.5) * mS;
                            p.velocityX = Math.cos(p.angle) * p.speed;
                            p.velocityY = Math.sin(p.angle) * p.speed;
                        }
                        if (p.shouldFadeQuickly) { p.opacity -= dt * 2; }
                        else {
                            p.velocityX = (p.velocityX + (Math.random() - 0.5) * mS) * 0.98;
                            p.velocityY = (p.velocityY + (Math.random() - 0.5) * mS) * 0.98;
                            p.x += p.velocityX * dt * 30;
                            p.y += p.velocityY * dt * 30;
                            p.opacity -= dt * 0.5;
                        }
                    }
                    if (p.opacity > 0) {
                        allV = false;
                        ctx.fillStyle = p.color.replace("1)", p.opacity + ")");
                        ctx.fillRect(p.x, p.y, 1.5, 1.5);
                    }
                });

                if (progress >= 100 && allV) {
                    setCurrentTextIndex(prev => (prev + 1) % texts.length);
                    setAnimationState("fadingIn");
                    fadeOpacityRef.current = 0;
                }
            } else if (currentState === "fadingIn") {
                fadeOpacityRef.current += dt / (animation.fadeInDuration || 1);
                const op = Math.min(1, fadeOpacityRef.current);
                drawText(ctx, texts[indexRef.current], op);
                if (op >= 1) {
                    setAnimationState("static");
                }
            }
            frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [texts, direction, spread, animation, font.fontSize, drawText]);

    const handleMouseEnter = () => {
        if (stateRef.current === "static") {
            initParticles();
            vaporizeProgressRef.current = 0;
            setAnimationState("vaporizing");
        }
    };

    return (
        <div ref={wrapperRef} style={{ width: "100%", height: "100%", position: "relative" }} onMouseEnter={handleMouseEnter}>
            <canvas ref={canvasRef} style={{ pointerEvents: "none", position: "absolute", inset: 0 }} />
        </div>
    );
}
