import { useState } from "react";

interface Component2Props {
  quantity: number;
}

const Component2 = ({ quantity }: Component2Props) => {
  const [value, setValue] = useState(quantity);

  return (
    <div className="flex gap-2 mb-20">
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="border rounded px-3 py-2 w-24 text-center"
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600" onClick={() => setValue(value + 1)}>Increase Quantity</button>
      
      <button className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600" onClick={() => setValue(value - 1)}>Decrease Quantity</button>
    </div>
  );
};

export default Component2;