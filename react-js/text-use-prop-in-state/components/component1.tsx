'use client';

import { useState } from "react";
import Component2 from "./component2";

const Component1 = () => {
  const [forceValue, setForceValue] = useState(10);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Change quantity</h2>

      <Component2 quantity={forceValue} />

      <div>
        <button className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600" onClick={() => setForceValue(100)}>Set Force Value</button>
      </div>
    </div>
  );
};

export default Component1;