import { useState } from "react";
import { getWithFilters } from "../util/API";
import { ExtendedPlayer, TeamExtendedInfo, LeagueInfo } from "../types/types";

export const useFilterSearch = () => {
  const [playerResults, setPlayerResults] = useState<ExtendedPlayer[]>([]);
  const [teamResults, setTeamResults] = useState<TeamExtendedInfo[]>([]);
  const [leagueResults, setLeagueResults] = useState<LeagueInfo[]>([]);

  const filterSearch = async (team: string, league: string, position: number, playerName: string, rating: boolean, speed: boolean) => {
    if (team.trim() != "") {
      const teamData: TeamExtendedInfo[] = await getWithFilters(team, league, position, playerName, rating, speed);
      setTeamResults(teamData);
    } else if (league.trim() != "") {
      const leagueData: LeagueInfo[] = await getWithFilters(team, league, position, playerName, rating, speed);
      setLeagueResults(leagueData);
    } else if (playerName.trim() != "" || position != null || rating != false || speed != false ) {
      const playerData: ExtendedPlayer[] = await getWithFilters(team, league, position, playerName, rating, speed);
      setPlayerResults(playerData);
    }
  };

  return {
    playerResults,
    teamResults,
    leagueResults,
    filterSearch,
    setPlayerResults,
    setTeamResults,
    setLeagueResults
  };
};
