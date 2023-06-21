import { useState, useEffect } from "react";
import { Player } from "../types/types";
import { API_URL } from "../util/CONSTANTS";

const usePlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [bounds, setBounds] = useState<{ start: number; end: number }>({
    start: 0,
    end: 50,
  });
  const [numPlayers, setNumPlayers] = useState(0);

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
        `${API_URL}/players?startId=${bounds.start}&endId=${bounds.end}`
      );

      const res = await players.json();
      setPlayers((res as Player[]) || []);

      const numPlayers = await fetch(`${API_URL}/playerCount`);
      const num = await numPlayers.json();

      setNumPlayers(Number(num[0].playerCount));
    };

    getPlayers();
  }, [bounds]);

  return {
    players,
    fetchNextPageOfPlayers: nextPage,
    fetchPreviousPageOfPlayers: previousPage,
    isAtStart: bounds.start == 0,
    isAtEnd: bounds.end > numPlayers,
  };
};

export default usePlayers;
