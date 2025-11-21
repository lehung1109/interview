"use client";

import Image from "next/image";
import { useEffect } from "react";

const ParallaxImage = () => {
  const handleScroll = () => {
    const percent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;

    document.documentElement.style.setProperty("--object-position", `center ${percent}% `);
  }
  
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-[10000px]">
      <Image
        className="dark:invert fixed inset-0 object-[var(--object-position)] w-full h-full object-cover"
        src="/866-2025x2000.jpg"
        width={2025}
        height={2000}
        alt="Image"
        priority
      />
    </div>
  )
}

export default ParallaxImage;