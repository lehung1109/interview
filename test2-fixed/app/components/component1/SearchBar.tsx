'use client'

import { useState } from "react";

const SearchBar = ({ search, setSearch, setData }: { search: string, setSearch: (search: string) => void, setData: (data: string[]) => void }) => {

  // loading state
  const [loading, setLoading] = useState(false);
  

  const handleSearch = async () => {
    setLoading(true);
    const response = await fetch('/api/search');
    const data = await response.json();

    // sort data alphabetically
    const sortedData = data.data.sort((a: string, b: string) => a.localeCompare(b));
    setData(sortedData);
    setLoading(false);
  }

  return (
    <div className="relative">
      {/* create overlay with loading spinner when loading is true */}
      {loading && <div className="absolute inset-0 bg-black opacity-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>}

      <input className="border-2 border-gray-300 rounded-md p-2" type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />

      <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600" onClick={handleSearch}>Search</button>
    </div>
  )
}

export default SearchBar;