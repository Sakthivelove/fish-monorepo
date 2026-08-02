"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

type SearchContextType = {
  open: boolean;
  openSearch: () => void;
  closeSearch: () => void;
};

const SearchContext =
  createContext<SearchContextType | null>(
    null
  );

export function SearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <SearchContext.Provider
      value={{
        open,
        openSearch: () =>
          setOpen(true),

        closeSearch: () =>
          setOpen(false),
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx =
    useContext(SearchContext);

  if (!ctx)
    throw new Error(
      "SearchProvider missing"
    );

  return ctx;
}