import { useState } from "react";
import { getWithFilters } from "../util/API";
import { TeamExtendedInfo, LeagueInfo, Player } from "../types/types";
import { API_URL } from "../util/CONSTANTS";

export const useFilterSearch = () => {
  const [playerResults, setPlayerResults] = useState<Player[]>([]);
  const [teamResults, setTeamResults] = useState<TeamExtendedInfo[]>([]);
  const [leagueResults, setLeagueResults] = useState<LeagueInfo[]>([]);

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

  const filterSearch = async (team: string, league: string, playerName: string, rating: boolean, speed: boolean, age: boolean) => {
    if (team.trim() != "") {
      const teamData: TeamExtendedInfo[] = await getWithFilters(team, league, playerName, rating, speed, age, bounds.start, bounds.end);
      setTeamResults(teamData);
    } else if (league.trim() != "") {
      const leagueData: LeagueInfo[] = await getWithFilters(team, league, playerName, rating, speed, age, bounds.start, bounds.end);
      setLeagueResults(leagueData);
    } else if (playerName.trim() != "" || age != false || rating != false || speed != false ) {
      const playerData: Player[] = await getWithFilters(team, league, playerName, rating, speed, age, bounds.start, bounds.end);
      setPlayerResults(playerData);
    }

    const numPlayers = await fetch(`${API_URL}/playerCount`);
    const num = await numPlayers.json();

    setNumPlayers(Number(num[0].playerCount));
  };

  const resetSearchResults = () => {
    setTeamResults([]);
    setPlayerResults([]);
    setLeagueResults([]);
  }

  return {
    playerResults,
    teamResults,
    leagueResults,
    filterSearch,
    fetchNextPageOfPlayersFilter: nextPage,
    fetchPreviousPageOfPlayersFilter: previousPage,
    isAtStartFilter: bounds.start == 0,
    isAtEndFilter: bounds.end > numPlayers,
    resetSearchResults
  };
};
