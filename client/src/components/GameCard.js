import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const MAX_ROTATION = 16;
const INTERPOLATION = 0.16;

const GameCard = ({ name, description, path, icon }) => {
    const cardRef = useRef(null);
    const frameRef = useRef(null);
    const hoverRef = useRef(false);
    const motionRef = useRef({
        rotateX: 0,
        rotateY: 0,
        pointerX: 50,
        pointerY: 50,
        shadowX: 0,
        shadowY: 14,
        targetRotateX: 0,
        targetRotateY: 0,
        targetPointerX: 50,
        targetPointerY: 50,
        targetShadowX: 0,
        targetShadowY: 14,
    });

    const startAnimation = () => {
        if (frameRef.current !== null) {
            return;
        }

        const animate = () => {
            const card = cardRef.current;
            if (!card) {
                frameRef.current = null;
                return;
            }

            const motion = motionRef.current;

            motion.rotateX += (motion.targetRotateX - motion.rotateX) * INTERPOLATION;
            motion.rotateY += (motion.targetRotateY - motion.rotateY) * INTERPOLATION;
            motion.pointerX += (motion.targetPointerX - motion.pointerX) * INTERPOLATION;
            motion.pointerY += (motion.targetPointerY - motion.pointerY) * INTERPOLATION;
            motion.shadowX += (motion.targetShadowX - motion.shadowX) * INTERPOLATION;
            motion.shadowY += (motion.targetShadowY - motion.shadowY) * INTERPOLATION;

            card.style.setProperty('--rotate-x', `${motion.rotateX.toFixed(2)}deg`);
            card.style.setProperty('--rotate-y', `${motion.rotateY.toFixed(2)}deg`);
            card.style.setProperty('--pointer-x', `${motion.pointerX.toFixed(2)}%`);
            card.style.setProperty('--pointer-y', `${motion.pointerY.toFixed(2)}%`);
            card.style.setProperty('--shadow-x', `${motion.shadowX.toFixed(2)}px`);
            card.style.setProperty('--shadow-y', `${motion.shadowY.toFixed(2)}px`);

            const settled =
                Math.abs(motion.targetRotateX - motion.rotateX) < 0.08 &&
                Math.abs(motion.targetRotateY - motion.rotateY) < 0.08 &&
                Math.abs(motion.targetPointerX - motion.pointerX) < 0.2 &&
                Math.abs(motion.targetPointerY - motion.pointerY) < 0.2 &&
                Math.abs(motion.targetShadowX - motion.shadowX) < 0.12 &&
                Math.abs(motion.targetShadowY - motion.shadowY) < 0.12;

            if (!hoverRef.current && settled) {
                frameRef.current = null;
                return;
            }

            frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const relativeX = (event.clientX - rect.left) / rect.width;
        const relativeY = (event.clientY - rect.top) / rect.height;

        const motion = motionRef.current;
        const rotateY = (relativeX - 0.5) * (MAX_ROTATION * 2);
        const rotateX = (0.5 - relativeY) * (MAX_ROTATION * 2);
        const shadowX = (0.5 - relativeX) * 28;
        const shadowY = 16 + (0.5 - relativeY) * 16;

        motion.targetRotateX = rotateX;
        motion.targetRotateY = rotateY;
        motion.targetPointerX = relativeX * 100;
        motion.targetPointerY = relativeY * 100;
        motion.targetShadowX = shadowX;
        motion.targetShadowY = shadowY;

        startAnimation();
    };

    const handleMouseEnter = () => {
        hoverRef.current = true;
        startAnimation();
    };

    const resetTilt = () => {
        hoverRef.current = false;
        const motion = motionRef.current;
        motion.targetRotateX = 0;
        motion.targetRotateY = 0;
        motion.targetPointerX = 50;
        motion.targetPointerY = 50;
        motion.targetShadowX = 0;
        motion.targetShadowY = 14;
        startAnimation();
    };

    useEffect(() => {
        return () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, []);

    return (
        <Link
            ref={cardRef}
            to={path}
            className="game-card"
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            onBlur={resetTilt}
        >
            <span className="game-icon">{icon}</span>
            <h3>{name}</h3>
            <p>{description}</p>
        </Link>
    );
};

export default GameCard;
