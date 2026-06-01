import { useEffect, useRef, useState } from "react";

export default function FramePlayer({ isPlaying, currentProgress, onFrameChange, className = "" }) {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const frameIndexRef = useRef(0);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);

  // Preload all 100 frames
  useEffect(() => {
    const loadedImages = [];
    let loaded = 0;
    const totalFrames = 100;

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, "0");
      img.src = `/frames/video_000/video_${frameNum}.jpg`;
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === totalFrames) {
          setImages(loadedImages);
        }
      };
      loadedImages.push(img);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle external scrubber progress changes (0 to 1)
  useEffect(() => {
    if (!isPlaying && images.length === 100 && currentProgress !== undefined) {
      const targetIndex = Math.min(
        99,
        Math.max(0, Math.floor(currentProgress * 100))
      );
      frameIndexRef.current = targetIndex;
      drawFrame(targetIndex);
    }
  }, [currentProgress, isPlaying, images]);

  // Main drawing function
  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length !== 100) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = images[index];
    if (!img) return;

    // Clear and draw matching aspect ratio
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Cover/Contain style drawing
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth, drawHeight, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      drawX = 0;
      drawY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      drawHeight = canvas.height;
      drawX = (canvas.width - drawWidth) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    // Update parent if callback provided
    if (onFrameChange) {
      onFrameChange(index / 100);
    }
  };

  // Playback Loop
  useEffect(() => {
    if (!isPlaying || images.length !== 100) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const fps = 24;
    const interval = 1000 / fps;

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= interval) {
        lastTimeRef.current = timestamp - (elapsed % interval);
        frameIndexRef.current = (frameIndexRef.current + 1) % 100;
        drawFrame(frameIndexRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, images]);

  // Handle resizing of canvas backing store
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawFrame(frameIndexRef.current);
    };

    window.addEventListener("resize", handleResize);
    // Initial size setting
    setTimeout(handleResize, 100);

    return () => window.removeEventListener("resize", handleResize);
  }, [images]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block bg-slate-950/20"
      />
      {loadedCount < 100 && (
        <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center gap-3 z-20">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[36px] animate-spin">
              sync
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">
            Syncing Terminal ({loadedCount}%)
          </span>
        </div>
      )}
    </div>
  );
}
