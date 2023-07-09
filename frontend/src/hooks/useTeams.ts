import { useState, useEffect } from "react";
import { Team } from "../types/types";
import { API_URL } from "../util/CONSTANTS";

const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [bounds, setBounds] = useState<{ start: number; end: number }>({
    start: 0,
    end: 50,
  });
  const [numTeams, setNumTeams] = useState(0);

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
    const getPlayers = async () => {
      const players = await fetch(
        `${API_URL}/team?startIdx=${bounds.start}&endIdx=${bounds.end}`
      );

      const res = await players.json();
      setTeams((res as Team[]) || []);

      const numPlayers = await fetch(`${API_URL}/teamCount`);
      const num = await numPlayers.json();

      setNumTeams(Number(num[0].teamCount));
    };

    getPlayers();
  }, [bounds]);

  return {
    teams,
    fetchNextPageOfPlayers: nextPage,
    fetchPreviousPageOfPlayers: previousPage,
    isAtStart: bounds.start == 0,
    isAtEnd: bounds.end > numTeams,
  };
};

export default useTeams;
