'use client';

import { useState, useEffect } from "react";

const SearchBar = () => {
  const [name, setName] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    if(!name) {
      return;
    }

    const fetchData = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await response.json();
      setData(data.map((item: { id: string, title: string }) => {
        return Math.round(Math.random() * 100) + " " + item.title;
      }));
    };
    fetchData();
  }, [name]);

  return (
    <div className="relative">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded px-3 py-2"
        placeholder="Search"
      />

      <ul className="mt-12 absolute top-0 left-0 w-full bg-white text-black">
        {data.map((item: string) => (
          <li className="hover:bg-gray-400 p-2" key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
