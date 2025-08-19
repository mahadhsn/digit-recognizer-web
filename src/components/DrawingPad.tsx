import React, { useEffect, useRef } from 'react';

export type DrawingPadProps = {
    width?: number;
    height?: number;
    lineWidth?: number;
    live?: boolean;
    onDrawEnd?: (img: ImageData) => void;
    onChange?: (img: ImageData) => void;
    onClear?: () => void;
};

const DrawingPad: React.FC<DrawingPadProps> = ({
    lineWidth = 30,
    live = true,
    onDrawEnd,
    onChange,
    onClear,
    }) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawingRef = useRef(false);
    const lastRef = useRef<{x: number; y: number} | null>(null);
    const lastEmitRef = useRef(0);
    const THROTTLE_MS = 80;

    const dprRef = useRef(1);
    const cssWRef = useRef(0);
    const cssHRef = useRef(0);

    const resizeAndScale = () => {
        const c = canvasRef.current!;
        const rect = c.getBoundingClientRect();
        cssWRef.current = rect.width;
        cssHRef.current = rect.height;
        dprRef.current = window.devicePixelRatio || 1;
        c.width = Math.round(rect.width * dprRef.current);
        c.height = Math.round(rect.height * dprRef.current);
        const ctx = c.getContext('2d')!;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dprRef.current, dprRef.current);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, rect.width, rect.height);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = '#000000';
    }

    const clearCanvas = () => {
        const c = canvasRef.current;
        if (!c) {
            return;
        }
        const ctx = c.getContext('2d');
        if (!ctx) {
            return;
        }
        // Reset transform before clearing to avoid double-scaling
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, c.width, c.height);
        // Re-apply scaling
        ctx.scale(dprRef.current, dprRef.current);
        // Fill white background using CSS pixel sizes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, cssWRef.current, cssHRef.current);
        // Re-apply brush settings
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = '#000000';
        onClear?.();
    }

    const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        drawingRef.current = true;
        lastRef.current = getPos(e);
    }
    
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        // If no mouse button is pressed, treat as not drawing
        if (e.buttons === 0) {
            drawingRef.current = false;
            lastRef.current = null;
            return;
        }
        if (!drawingRef.current) {
            return;
        }
        const ctx = canvasRef.current!.getContext('2d')!;
        const p = getPos(e)
        const last = lastRef.current ?? p;
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        lastRef.current = p;

        if (live && onChange) {
          const now = performance.now();
          if (now - lastEmitRef.current >= THROTTLE_MS) {
            const c = canvasRef.current;
            if (c) {
              const ctx = c.getContext('2d');
              if (ctx) {
                onChange(ctx.getImageData(0, 0, c.width, c.height));
                lastEmitRef.current = now;
              }
            }
          }
        }
    }

    const handleMouseUpLeave = () => {
        const wasDrawing = drawingRef.current;
        const hadLast = lastRef.current !== null;
        drawingRef.current = false;
        lastRef.current = null;
        if (wasDrawing || hadLast) {
            const c = canvasRef.current;
            if (c) {
                const ctx = c.getContext('2d');
                if (ctx) onDrawEnd?.(ctx.getImageData(0, 0, c.width, c.height));
            }
        }
        lastEmitRef.current = 0;
    }

    useEffect(() => {
        resizeAndScale();
        window.addEventListener('resize', resizeAndScale);
        return () => {
            window.removeEventListener('resize', resizeAndScale);
        }
    }, [lineWidth]);
  
  return (
    <div className="flex flex-col gap-3">
      <canvas 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpLeave}
        onMouseLeave={handleMouseUpLeave}
        className="border-4 border-blue-300 bg-white rounded shadow-sm shrink-0 w-[320px] h-[320px] md:w-[500px] md:h-[500px] touch-none"
      />
      <button onClick={clearCanvas} className='px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition-all'>
        Clear
      </button>
    </div>
  );
};

export default DrawingPad;