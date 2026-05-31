import { useEffect, useRef } from "react";

export default function CanvasChart({ type = "latency", color = "#adc6ff", height = 80 }) {
  const canvasRef = useRef(null);
  const dataPointsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle canvas sizing
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.height = `${height}px`;
    };
    resizeCanvas();

    // Populate initial dummy data points
    const maxPoints = 50;
    const baseVal = type === "latency" ? 12 : 18.4;
    const devVal = type === "latency" ? 3 : 1.5;
    
    for (let i = 0; i < maxPoints; i++) {
      dataPointsRef.current.push(baseVal + (Math.random() - 0.5) * devVal);
    }

    let animationId;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width / window.devicePixelRatio;
      const h = height;

      // Update data points (shift and add new one)
      dataPointsRef.current.shift();
      const lastVal = dataPointsRef.current[dataPointsRef.current.length - 1];
      const change = (Math.random() - 0.5) * (type === "latency" ? 2 : 0.8);
      let newVal = lastVal + change;

      // Bound it
      if (type === "latency") {
        newVal = Math.max(6, Math.min(22, newVal));
      } else {
        newVal = Math.max(10, Math.min(24, newVal));
      }
      dataPointsRef.current.push(newVal);

      // Draw Grid Lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      
      // Horizontal grid
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vertical grid
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Calculate coordinates
      const points = dataPointsRef.current;
      const step = width / (maxPoints - 1);
      
      const getNormalizedY = (val) => {
        const min = type === "latency" ? 0 : 5;
        const max = type === "latency" ? 30 : 30;
        const pct = (val - min) / (max - min);
        // Flip because Y goes down
        return h - (pct * (h - 10) + 5);
      };

      // Draw Gradient Area
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, `${color}33`); // 20% opacity
      grad.addColorStop(1, `${color}00`); // Transparent

      ctx.beginPath();
      ctx.moveTo(0, h);
      
      for (let i = 0; i < points.length; i++) {
        ctx.lineTo(i * step, getNormalizedY(points[i]));
      }
      ctx.lineTo(width, h);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Draw Stroke Line
      ctx.beginPath();
      ctx.moveTo(0, getNormalizedY(points[0]));
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(i * step, getNormalizedY(points[i]));
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      animationId = requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [type, color, height]);

  return (
    <div className="w-full relative overflow-hidden rounded bg-black/10 p-1 border border-white/5">
      <canvas ref={canvasRef} className="w-full block" />
    </div>
  );
}
