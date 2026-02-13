"use client";
import { useMotionValue, useMotionTemplate, motion } from "framer-motion";
import React, { useState, useEffect } from "react";

export const EvervaultCard = ({ text, className }: { text?: string; className?: string }) => {
  // 1. Mouse Tracking State
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  // 2. Random Character Logic (Rupee Symbol)
  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    let str = "";
    const chars = "₹";
    for (let i = 0; i < 1500; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRandomString(str);
  }, []);

  // 3. Mouse Movement Handler
  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // 4. The "Spotlight" Mask (Crucial for the effect)
  // We use a radial gradient that acts as a window to the layers below
  let maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { 
    maskImage, 
    WebkitMaskImage: maskImage // This makes it work in Chrome/Safari
  };

  return (
    <div
    onMouseMove={onMouseMove}
    className={`relative h-full w-full bg-transparent aspect-square flex items-center justify-center group/card overflow-hidden rounded-3xl border border-white/10 ${className}`}
  >
      {/* Layer 1: The Gradient Shimmer (Revealed by mask) */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 opacity-0 group-hover/card:opacity-100 transition duration-500"
        style={style}
      />

      {/* Layer 2: The Rupee Pattern (Revealed by mask) */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover/card:opacity-30 mix-blend-overlay"
        style={style}
      >
        <p className="p-4 text-[10px] break-words text-white font-mono leading-none transition duration-500">
          {randomString}
        </p>
      </motion.div>

      {/* Layer 3: The Content (Always visible) */}
      <div className="relative z-20 flex items-center justify-center">
        <div className="relative h-44 w-44 rounded-full flex items-center justify-center text-white font-black text-4xl">
           <div className="absolute w-full h-full bg-black/50 blur-sm rounded-full" />
           <span className="z-20 uppercase tracking-widest" style={{ fontFamily: "Georgia, serif" }}>
             {text}
           </span>
        </div>
      </div>
    </div>
  );
};

export const Icon = ({ className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
);