/* eslint-disable */
'use client';

import { useState, useEffect } from "react";

const SearchBar = () => {
  const [name, setName] = useState("");
  const [changeCount, setChangeCount] = useState(0);

  useEffect(() => {
    if(!name) {
      return;
    }

    setChangeCount(changeCount + 1);
  }, [changeCount, name]);

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded px-3 py-2"
        placeholder="Name"
      />

      <p className="text-sm mt-2">
        Change Count: {changeCount}
      </p>
    </div>
  );
};

export default SearchBar;
