"use client";

import React, { useEffect, useRef } from "react";

interface FuzzyTextProps {
  children: React.ReactNode;
  fontSize?: number | string;
  fontWeight?: string | number;
  fontFamily?: string;
  color?: string;
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
  fuzzRange?: number;
  fps?: number;
  direction?: "horizontal" | "vertical" | "both";
  transitionDuration?: number;
  clickEffect?: boolean;
  glitchMode?: boolean;
  glitchInterval?: number;
  glitchDuration?: number;
  gradient?: string[] | null;
  letterSpacing?: number;
  className?: string;
}

interface DrawParams {
  offscreen: HTMLCanvasElement;
  offCtx: CanvasRenderingContext2D;
  offscreenWidth: number;
  tightHeight: number;
  xOffset: number;
  actualLeft: number;
  actualAscent: number;
  fontString: string;
}

const FuzzyText: React.FC<FuzzyTextProps> = ({
  children,
  fontSize = 'clamp(2rem, 8vw, 8rem)',
  fontWeight = 900,
  fontFamily = "inherit",
  color = "#fff",
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
  fuzzRange = 30,
  fps = 60,
  direction = "horizontal",
  transitionDuration = 0,
  clickEffect = false,
  glitchMode = false,
  glitchInterval = 2000,
  glitchDuration = 200,
  gradient = null,
  letterSpacing = 0,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawParamsRef = useRef<DrawParams | null>(null);

  // Behavioral props read by the animation loop — no re-init needed when they change
  const behaviorRef = useRef({ baseIntensity, hoverIntensity, enableHover, clickEffect, fps, transitionDuration, glitchMode, glitchInterval, glitchDuration });
  behaviorRef.current = { baseIntensity, hoverIntensity, enableHover, clickEffect, fps, transitionDuration, glitchMode, glitchInterval, glitchDuration };

  // Text content read by the animation loop — redrawn via separate effect
  const textRef = useRef(React.Children.toArray(children).join(""));
  textRef.current = React.Children.toArray(children).join("");
  const textDirtyRef = useRef(false);

  // Redraw offscreen buffer when children change without full re-init
  useEffect(() => {
    const dp = drawParamsRef.current;
    if (!dp) return;
    textDirtyRef.current = true;
  }, [children]);

  useEffect(() => {
    let animationFrameId: number;
    let isCancelled = false;
    let glitchTimeoutId: ReturnType<typeof setTimeout>;
    let glitchEndTimeoutId: ReturnType<typeof setTimeout>;
    let clickTimeoutId: ReturnType<typeof setTimeout>;
    let handleMouseMove: ((e: MouseEvent) => void) | null = null;
    let handleMouseLeave: (() => void) | null = null;
    let handleTouchMove: ((e: TouchEvent) => void) | null = null;
    let handleTouchEnd: (() => void) | null = null;
    let handleClick: (() => void) | null = null;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const init = async () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const computedFontFamily =
        fontFamily === "inherit"
          ? window.getComputedStyle(canvas).fontFamily || "sans-serif"
          : fontFamily;

      const fontSizeStr = typeof fontSize === "number" ? `${fontSize}px` : fontSize;
      const fontString = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;

      try {
        await document.fonts.load(fontString);
      } catch {
        await document.fonts.ready;
      }
      if (isCancelled) return;

      let numericFontSize: number;
      if (typeof fontSize === "number") {
        numericFontSize = fontSize;
      } else {
        const temp = document.createElement("span");
        temp.style.fontSize = fontSize;
        const parent = canvas.parentElement ?? document.body;
        parent.appendChild(temp);
        const computedSize = window.getComputedStyle(temp).fontSize;
        numericFontSize = parseFloat(computedSize);
        parent.removeChild(temp);
      }

      const text = textRef.current;

      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.font = fontString;
      offCtx.textBaseline = "alphabetic";

      let totalWidth = 0;
      if (letterSpacing !== 0) {
        for (const char of text) {
          totalWidth += offCtx.measureText(char).width + letterSpacing;
        }
        totalWidth -= letterSpacing;
      } else {
        totalWidth = offCtx.measureText(text).width;
      }

      const metrics = offCtx.measureText(text);
      const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
      const actualRight =
        letterSpacing !== 0 ? totalWidth : (metrics.actualBoundingBoxRight ?? metrics.width);
      const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
      const actualDescent = metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;

      const textBoundingWidth = Math.ceil(
        letterSpacing !== 0 ? totalWidth : actualLeft + actualRight
      );
      const tightHeight = Math.ceil(actualAscent + actualDescent);

      const extraWidthBuffer = 10;
      const offscreenWidth = textBoundingWidth + extraWidthBuffer;

      offscreen.width = offscreenWidth;
      offscreen.height = tightHeight;

      const xOffset = extraWidthBuffer / 2;

      const redrawOffscreen = () => {
        const dp = drawParamsRef.current;
        if (!dp) return;
        dp.offCtx.clearRect(0, 0, dp.offscreenWidth, dp.tightHeight);
        dp.offCtx.font = dp.fontString;
        dp.offCtx.textBaseline = "alphabetic";

        if (gradient && Array.isArray(gradient) && gradient.length >= 2) {
          const grad = dp.offCtx.createLinearGradient(0, 0, dp.offscreenWidth, 0);
          gradient.forEach((c, i) => grad.addColorStop(i / (gradient.length - 1), c));
          dp.offCtx.fillStyle = grad;
        } else {
          dp.offCtx.fillStyle = color;
        }

        const currentText = textRef.current;
        if (letterSpacing !== 0) {
          let xPos = dp.xOffset;
          for (const char of currentText) {
            dp.offCtx.fillText(char, xPos, dp.actualAscent);
            xPos += dp.offCtx.measureText(char).width + letterSpacing;
          }
        } else {
          dp.offCtx.fillText(currentText, dp.xOffset - dp.actualLeft, dp.actualAscent);
        }
      };

      // Store drawing params for content-only redraws
      drawParamsRef.current = { offscreen, offCtx, offscreenWidth, tightHeight, xOffset, actualLeft, actualAscent, fontString };

      // Initial draw
      offCtx.font = fontString;
      offCtx.textBaseline = "alphabetic";

      if (gradient && Array.isArray(gradient) && gradient.length >= 2) {
        const grad = offCtx.createLinearGradient(0, 0, offscreenWidth, 0);
        gradient.forEach((c, i) => grad.addColorStop(i / (gradient.length - 1), c));
        offCtx.fillStyle = grad;
      } else {
        offCtx.fillStyle = color;
      }

      if (letterSpacing !== 0) {
        let xPos = xOffset;
        for (const char of text) {
          offCtx.fillText(char, xPos, actualAscent);
          xPos += offCtx.measureText(char).width + letterSpacing;
        }
      } else {
        offCtx.fillText(text, xOffset - actualLeft, actualAscent);
      }

      const horizontalMargin = fuzzRange + 20;
      const verticalMargin = direction === "vertical" || direction === "both" ? fuzzRange + 10 : 0;
      canvas.width = offscreenWidth + horizontalMargin * 2;
      canvas.height = tightHeight + verticalMargin * 2;
      ctx.translate(horizontalMargin, verticalMargin);

      const interactiveLeft = horizontalMargin + xOffset;
      const interactiveTop = verticalMargin;
      const interactiveRight = interactiveLeft + textBoundingWidth;
      const interactiveBottom = interactiveTop + tightHeight;

      let isHovering = false;
      let isClicking = false;
      let isGlitching = false;
      let currentIntensity = behaviorRef.current.baseIntensity;
      let targetIntensity = behaviorRef.current.baseIntensity;
      let lastFrameTime = 0;

      const startGlitchLoop = () => {
        if (!behaviorRef.current.glitchMode || isCancelled) return;
        glitchTimeoutId = setTimeout(() => {
          if (isCancelled) return;
          isGlitching = true;
          glitchEndTimeoutId = setTimeout(() => {
            isGlitching = false;
            startGlitchLoop();
          }, behaviorRef.current.glitchDuration);
        }, behaviorRef.current.glitchInterval);
      };

      if (behaviorRef.current.glitchMode) startGlitchLoop();

      const run = (timestamp: number) => {
        if (isCancelled) return;

        const b = behaviorRef.current;
        const frameDuration = 1000 / b.fps;

        if (timestamp - lastFrameTime < frameDuration) {
          animationFrameId = window.requestAnimationFrame(run);
          return;
        }
        lastFrameTime = timestamp;

        // Redraw offscreen buffer if text changed
        if (textDirtyRef.current) {
          textDirtyRef.current = false;
          redrawOffscreen();
        }

        ctx.clearRect(
          -horizontalMargin,
          -verticalMargin,
          offscreenWidth + 2 * horizontalMargin,
          tightHeight + 2 * verticalMargin
        );

        if (isClicking || isGlitching) {
          targetIntensity = 1;
        } else if (isHovering) {
          targetIntensity = b.hoverIntensity;
        } else {
          targetIntensity = b.baseIntensity;
        }

        if (b.transitionDuration > 0) {
          const step = 1 / (b.transitionDuration / frameDuration);
          if (currentIntensity < targetIntensity) {
            currentIntensity = Math.min(currentIntensity + step, targetIntensity);
          } else if (currentIntensity > targetIntensity) {
            currentIntensity = Math.max(currentIntensity - step, targetIntensity);
          }
        } else {
          currentIntensity = targetIntensity;
        }

        for (let j = 0; j < tightHeight; j++) {
          let dx = 0,
            dy = 0;
          if (direction === "horizontal" || direction === "both") {
            dx = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange);
          }
          if (direction === "vertical" || direction === "both") {
            dy = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange * 0.5);
          }
          ctx.drawImage(offscreen, 0, j, offscreenWidth, 1, dx, j + dy, offscreenWidth, 1);
        }
        animationFrameId = window.requestAnimationFrame(run);
      };

      animationFrameId = window.requestAnimationFrame(run);

      const isInsideTextArea = (x: number, y: number) =>
        x >= interactiveLeft && x <= interactiveRight && y >= interactiveTop && y <= interactiveBottom;

      handleMouseMove = (e: MouseEvent) => {
        if (!behaviorRef.current.enableHover) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        isHovering = isInsideTextArea(x, y);
      };

      handleMouseLeave = () => {
        isHovering = false;
      };

      handleClick = () => {
        if (!behaviorRef.current.clickEffect) return;
        isClicking = true;
        clearTimeout(clickTimeoutId);
        clickTimeoutId = setTimeout(() => {
          isClicking = false;
        }, 150);
      };

      handleTouchMove = (e: TouchEvent) => {
        if (!behaviorRef.current.enableHover) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        isHovering = isInsideTextArea(x, y);
      };

      handleTouchEnd = () => {
        isHovering = false;
      };

      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
      canvas.addEventListener("touchend", handleTouchEnd);
      canvas.addEventListener("click", handleClick);
    };

    init();

    return () => {
      isCancelled = true;
      drawParamsRef.current = null;
      window.cancelAnimationFrame(animationFrameId);
      clearTimeout(glitchTimeoutId);
      clearTimeout(glitchEndTimeoutId);
      clearTimeout(clickTimeoutId);
      if (canvas) {
        if (handleMouseMove) canvas.removeEventListener("mousemove", handleMouseMove);
        if (handleMouseLeave) canvas.removeEventListener("mouseleave", handleMouseLeave);
        if (handleTouchMove) canvas.removeEventListener("touchmove", handleTouchMove);
        if (handleTouchEnd) canvas.removeEventListener("touchend", handleTouchEnd);
        if (handleClick) canvas.removeEventListener("click", handleClick);
      }
    };
  // Structural props only — behavioral props and children use refs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontSize, fontWeight, fontFamily, color, fuzzRange, direction, gradient, letterSpacing]);

  return <canvas ref={canvasRef} className={className} />;
};

export default FuzzyText;
