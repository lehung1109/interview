'use client';

import { useEffect, useState } from "react";

const LargeDom = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    window.setInterval(() => {
      setCount(Math.random() * 1000);
    }, 10);
  }, []);

  return (
    <div className="fixed top-[50%] left-[50%] z-2">
      Number: {count}
    </div>
  )
};

export default LargeDom;