"use client";

import Script from "next/script";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    VANTA: any;
  }
}

export const useVanta = () => {
  const bodyRef = useRef<HTMLDivElement>(null);
  let vantaEffect: any = null;

  useEffect(() => {
    const handleLoad = () => {
      if (window.VANTA) {
        vantaEffect = window.VANTA.FOG({
          el: bodyRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: 0x14f195,
          midtoneColor: 0xffffff,
          lowlightColor: 0x9945ff,
          baseColor: 0x000000,
          blurFactor: 0.90,
          speed: 1.10,
          zoom: 0.50
        });

      }
    };

    if (typeof window !== "undefined") {
      if (window.VANTA) {
        handleLoad();
      } else {
        window.addEventListener("load", handleLoad);
        return () => {
          window.removeEventListener("load", handleLoad);
          if (vantaEffect) vantaEffect.destroy();
        };
      }
    }
  }, []);

  return bodyRef;
};

export const BackGround = () => {
  const vantaRef = useVanta();

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10" ref={vantaRef}>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        strategy="beforeInteractive"
      ></Script>
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js"
        strategy="beforeInteractive"
      ></Script>
    </div>
  );
};