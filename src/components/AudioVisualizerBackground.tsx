import React, { useEffect, useRef } from 'react';

export const AudioVisualizerBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let step = 0;

    const render = () => {
      step += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle LED Cyan wave
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';

      for (let x = 0; x < width; x += 10) {
        const y =
          height * 0.45 +
          Math.sin(x * 0.003 + step) * 60 +
          Math.cos(x * 0.006 - step * 0.8) * 40;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Second harmonic wave in Electric Blue
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';

      for (let x = 0; x < width; x += 15) {
        const y =
          height * 0.55 +
          Math.sin(x * 0.004 - step * 1.2) * 50 +
          Math.sin(x * 0.008 + step) * 30;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
