"use client";

import { Search } from "lucide-react";

import { useSearch } from "@/context/SearchContext";

export default function SearchButton() {
  const { openSearch } =
    useSearch();

  return (
    <button
      onClick={openSearch}
      className="p-2 rounded-full hover:bg-blue-100 transition"
    >
      <Search size={22} />
    </button>
  );
}