import React, { useEffect, useRef } from 'react';

export type DrawingPadProps = {
  width?: number;
  height?: number;
  lineWidth?: number;
  /** If true, calls onChange while drawing (throttled). */
  live?: boolean;
  /** Called frequently while drawing when live=true. */
};

const DrawingPad: React.FC<DrawingPadProps> = ({
    width = 280,
    height = 280,
    lineWidth = 18,
    live = true,
    }) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawingRef = useRef(false);
    const lastRef = useRef<{x: number; y: number} | null>(null);

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
    }

    const handleMouseUpLeave = () => {
        drawingRef.current = false;
        lastRef.current = null;
    }

    useEffect(() => {
        const c = canvasRef.current;
        if (!c) {
            return;
        }
        const ctx = c.getContext('2d');
        if (!ctx) {
            return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, c.width, c.height);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = '#000000';
    }, [lineWidth]);
  
  return (
    <div className="flex flex-col gap-3">
      <canvas 
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpLeave}
        onMouseLeave={handleMouseUpLeave}
        className='border border-gray-300 bg-white rounded shadow-sm'
      />
    </div>
  );
};

export default DrawingPad;