"use client";

import { useEffect, useState } from "react";

export default function ProgressTimeline() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="scrollProgress"
      className="fixed top-0 left-0 h-[4px] bg-gradient-to-r from-[#CCD5AE] to-[#B3DEE2] z-[70] transition-all duration-100"
      style={{ width: `${progress}%` }}
    ></div>
  );
}
