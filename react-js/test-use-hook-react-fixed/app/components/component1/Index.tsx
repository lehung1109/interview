'use client'

import SearchBar from "./SearchBar";
import Result from "./Result";
import { useState } from "react";

const Search = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<string[]>([]);
  
  return (
    <div>
      <SearchBar search={search} setSearch={setSearch} setData={setData} />
      <Result data={data} search={search} />
    </div>
  )
}

export default Search;