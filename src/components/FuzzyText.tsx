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
  letterSpacing = 0,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawParamsRef = useRef<DrawParams | null>(null);

  const behaviorRef = useRef({ baseIntensity, hoverIntensity, enableHover });
  useEffect(() => {
    behaviorRef.current = { baseIntensity, hoverIntensity, enableHover };
  }, [baseIntensity, hoverIntensity, enableHover]);

  const textRef = useRef(React.Children.toArray(children).join(""));
  const textDirtyRef = useRef(false);

  useEffect(() => {
    textRef.current = React.Children.toArray(children).join("");
    const dp = drawParamsRef.current;
    if (!dp) return;
    textDirtyRef.current = true;
  }, [children]);

  useEffect(() => {
    let animationFrameId: number;
    let isCancelled = false;
    let handleMouseMove: ((e: MouseEvent) => void) | null = null;
    let handleMouseLeave: (() => void) | null = null;
    let handleTouchMove: ((e: TouchEvent) => void) | null = null;
    let handleTouchEnd: (() => void) | null = null;
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
        dp.offCtx.fillStyle = color;

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

      drawParamsRef.current = { offscreen, offCtx, offscreenWidth, tightHeight, xOffset, actualLeft, actualAscent, fontString };
      redrawOffscreen();

      const horizontalMargin = fuzzRange + 20;
      canvas.width = offscreenWidth + horizontalMargin * 2;
      canvas.height = tightHeight;
      ctx.translate(horizontalMargin, 0);

      const interactiveLeft = horizontalMargin + xOffset;
      const interactiveTop = 0;
      const interactiveRight = interactiveLeft + textBoundingWidth;
      const interactiveBottom = tightHeight;

      let isHovering = false;
      let lastFrameTime = 0;

      const run = (timestamp: number) => {
        if (isCancelled) return;

        const b = behaviorRef.current;
        const frameBudget = isHovering ? 16 : 33;
        if (timestamp - lastFrameTime < frameBudget) {
          animationFrameId = window.requestAnimationFrame(run);
          return;
        }
        lastFrameTime = timestamp;

        if (textDirtyRef.current) {
          textDirtyRef.current = false;
          redrawOffscreen();
        }

        ctx.clearRect(
          -horizontalMargin,
          0,
          offscreenWidth + 2 * horizontalMargin,
          tightHeight
        );

        const intensity = isHovering ? b.hoverIntensity : b.baseIntensity;

        for (let j = 0; j < tightHeight; j++) {
          const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);
          ctx.drawImage(offscreen, 0, j, offscreenWidth, 1, dx, j, offscreenWidth, 1);
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
    };

    init();

    return () => {
      isCancelled = true;
      drawParamsRef.current = null;
      window.cancelAnimationFrame(animationFrameId);
      if (canvas) {
        if (handleMouseMove) canvas.removeEventListener("mousemove", handleMouseMove);
        if (handleMouseLeave) canvas.removeEventListener("mouseleave", handleMouseLeave);
        if (handleTouchMove) canvas.removeEventListener("touchmove", handleTouchMove);
        if (handleTouchEnd) canvas.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [fontSize, fontWeight, fontFamily, color, fuzzRange, letterSpacing]);

  return <canvas ref={canvasRef} className={className} />;
};

export default FuzzyText;
