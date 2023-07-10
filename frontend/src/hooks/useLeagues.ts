import { useState, useEffect } from "react";
import { LeagueInfo } from "../types/types";
import { API_URL } from "../util/CONSTANTS";

const useLeagues = () => {
  const [leagues, setLeagues] = useState<LeagueInfo[]>([]);
  const [bounds, setBounds] = useState<{ start: number; end: number }>({
    start: 0,
    end: 50,
  });
  const [numLeagues, setNumLeagues] = useState(0);

  const nextPage = () => {
    setBounds({
      start: bounds.start + 50,
      end: bounds.end + 50,
    });
  };

  const previousPage = () => {
    setBounds({ start: Math.max(0, bounds.start - 50), end: bounds.end - 50 });
  };

  useEffect(() => {
    const getLeagues = async () => {
      const leagues = await fetch(
        `${API_URL}/league?startIdx=${bounds.start}&endIdx=${bounds.end}`
      );

      const res = await leagues.json();
      setLeagues((res as LeagueInfo[]) || []);

      const numLeagues = await fetch(`${API_URL}/leagueCount`);
      const num = await numLeagues.json();

      setNumLeagues(Number(num[0].leagueCount));
    };

    getLeagues();
  }, [bounds]);

  return {
    leagues,
    fetchNextPageOfPlayers: nextPage,
    fetchPreviousPageOfPlayers: previousPage,
    isAtStart: bounds.start == 0,
    isAtEnd: bounds.end > numLeagues,
  };
};

export default useLeagues;
