import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleMesh = ({
    count,
    magnetRadius,
    ringRadius,
    waveSpeed,
    waveAmplitude,
    particleSize,
    lerpSpeed,
    color,
    particleVariance,
    rotationSpeed,
    depthFactor,
    pulseSpeed,
    particleShape,
    isFalling
}) => {
    const meshRef = useRef();
    const { mouse, viewport } = useThree();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Initialize particles with a grid-like spread to ensure gaps
    const particles = useMemo(() => {
        const temp = [];
        // Estimate grid dimensions based on count
        const rows = Math.floor(Math.sqrt(count * 0.5));
        const cols = Math.ceil(count / rows);
        const xSpacing = 35 / cols; // Spreading over ~35 units width
        const ySpacing = 20 / rows; // Spreading over ~20 units height

        for (let i = 0; i < count; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;

            // Grid position with randomness (jitter)
            const baseX = (col - cols / 2) * xSpacing + (Math.random() - 0.5) * xSpacing * 1.5;
            const baseY = (row - rows / 2) * ySpacing + (Math.random() - 0.5) * ySpacing * 1.5;
            const baseZ = (Math.random() - 0.5) * depthFactor * 5;

            temp.push({
                x: baseX, y: baseY, z: baseZ,
                baseX, baseY, baseZ,
                speed: 0.01 + Math.random() * 0.02 * particleVariance,
                offset: Math.random() * Math.PI * 2,
                vy: 0 // Velocity Y
            });
        }
        return temp;
    }, [count, depthFactor, particleVariance]);

    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.getElapsedTime();
        const targetX = (mouse.x * viewport.width) / 2;
        const targetY = (mouse.y * viewport.height) / 2;

        meshRef.current.rotation.z += rotationSpeed * 0.001;

        particles.forEach((particle, i) => {
            if (isFalling) {
                // FALLING LOGIC
                if (particle.vy > -0.5) particle.vy -= 0.005 + Math.random() * 0.002; // Limit terminal velocity

                // Floor check to prevent infinite falling
                if (particle.y > -35) {
                    particle.y += particle.vy;
                }

                particle.x += Math.sin(time * 5 + particle.offset) * 0.02; // Slight horizontal drift

                // Random spin while falling
                dummy.rotation.x += 0.1;
                dummy.rotation.y += 0.1;

                dummy.position.set(particle.x, particle.y, particle.z);
            } else {
                // RETURN / WAVE LOGIC
                // Reset velocity when returning
                particle.vy = 0;

                // Wave motion calculation based on X position instead of angle
                const wave = Math.sin(time * waveSpeed + particle.baseX * 0.3 + particle.offset) * waveAmplitude;
                const pulse = 1 + Math.sin(time * pulseSpeed + particle.offset) * 0.2;

                let desiredX = particle.baseX;
                let desiredY = particle.baseY;
                let desiredZ = particle.baseZ + wave;

                // Magnet/Interaction Effect
                const dx = targetX - desiredX;
                const dy = targetY - desiredY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < magnetRadius) {
                    const force = (magnetRadius - dist) / magnetRadius;
                    const angle = Math.atan2(dy, dx);
                    desiredX -= Math.cos(angle) * force * 5;
                    desiredY -= Math.sin(angle) * force * 5;
                }

                // Smooth Return Logic
                // Use a faster constant lerp for returning so it doesn't look stuck
                const currentLerp = 0.02;

                particle.x = THREE.MathUtils.lerp(particle.x, desiredX, currentLerp);
                particle.y = THREE.MathUtils.lerp(particle.y, desiredY, currentLerp);
                particle.z = THREE.MathUtils.lerp(particle.z, desiredZ, currentLerp);

                dummy.position.set(particle.x, particle.y, particle.z);

                dummy.rotation.x = Math.sin(time * 0.5 + particle.offset);
                dummy.rotation.y = Math.cos(time * 0.3 + particle.offset);
            }

            const scale = particleSize * (isFalling ? 1 : (1 + Math.sin(time * pulseSpeed + particle.offset) * 0.2));
            // Scale non-uniformly to flatten the capsule into a bean shape
            dummy.scale.set(scale, scale, scale * 0.6);

            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    // Geometry selection
    const geometry = useMemo(() => {
        if (particleShape === 'capsule') {
            // Radius 0.12, Length 0.16 (Short and fat for coffee bean look)
            return new THREE.CapsuleGeometry(0.12, 0.16, 4, 8);
        }
        return new THREE.CapsuleGeometry(0.12, 0.16, 4, 8);
    }, [particleShape]);

    return (
        <instancedMesh ref={meshRef} args={[geometry, null, count]}>
            <meshStandardMaterial
                color={color}
                roughness={0.4}
                metalness={0.6}
                emissive={color}
                emissiveIntensity={0.2}
            />
        </instancedMesh>
    );
};

const Antigravity = ({
    count = 300,
    magnetRadius = 6,
    ringRadius = 7,
    waveSpeed = 0.4,
    waveAmplitude = 1,
    particleSize = 1.5,
    lerpSpeed = 0.05,
    color = "#5227FF",
    autoAnimate = true,
    particleVariance = 1,
    rotationSpeed = 0,
    depthFactor = 1,
    pulseSpeed = 3,
    particleShape = "capsule",
    fieldStrength = 10,
    isFalling = false
}) => {
    return (
        <div style={{ width: '100%', height: '100%', minHeight: '400px', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
            {/* Fallback color for background */}
            <div className="absolute inset-0 bg-transparent transition-colors duration-500" />

            <Canvas
                camera={{ position: [0, 0, 20], fov: 45 }}
                dpr={[1, 2]} // Handle high DPI screens
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color={color} />

                <ParticleMesh
                    count={count}
                    magnetRadius={magnetRadius}
                    ringRadius={ringRadius}
                    waveSpeed={waveSpeed}
                    waveAmplitude={waveAmplitude}
                    particleSize={particleSize}
                    lerpSpeed={lerpSpeed}
                    color={color}
                    particleVariance={particleVariance}
                    rotationSpeed={rotationSpeed}
                    depthFactor={depthFactor}
                    pulseSpeed={pulseSpeed}
                    particleShape={particleShape}
                    isFalling={isFalling}
                />
            </Canvas>
        </div>
    );
};

export default Antigravity;
