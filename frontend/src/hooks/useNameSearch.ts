import { useState } from "react";
import { searchPlayers } from "../util/API";
import { ExtendedPlayer } from "../types/types";

export const useNameSearch = () => {
  const [results, setResults] = useState<ExtendedPlayer[]>([]);

  const search = async (searchQuery: string) => {
    if (searchQuery.trim() != "") {
      const data = await searchPlayers(searchQuery);
      setResults(data);
    }
  };

  return {
    results,
    search,
    setResults
  };
};
