import { useEffect, useState } from "react";
import { ExtendedPlayer, UserTeam } from "../types/types";
import { addToUserTeam, getTeam } from "../util/API";
import { PlayerPositions } from "../util/CONSTANTS";

export const useUserTeam = (teamId: number) => {
  const [team, setTeam] = useState<UserTeam | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      const data = await getTeam(teamId);
      setTeam(data);
    };

    fetchTeam();
  }, [teamId]);

  const addPlayer = (
    position: PlayerPositions,
    player: ExtendedPlayer
  ): boolean => {
    // 1. check if player already exists
    if (team != null) {
      const playerFound = team?.players.find(
        (item) => item.player_id == player.player_id
      );

      const positionFound = team?.positions.find(
        (item) => item.position == position
      );

      if (playerFound && positionFound) {
        const filteredPositions = team.positions.filter(
          (item) =>
            item.position != positionFound.position &&
            item.player_id != playerFound.player_id
        );
        const filteredPlayers = team.players.filter(
          (item) =>
            item.player_id != positionFound.player_id &&
            item.player_id != playerFound.player_id
        );

        const newPlayerPosition = {
          player_id: player.player_id,
          position,
        };

        setTeam({
          ...team,
          positions: [...filteredPositions, newPlayerPosition],
          players: [player, ...filteredPlayers],
        });
        return true;
      }

      if (playerFound) {
        // change players position to new position
        const filteredPositions = team.positions.filter(
          (item) => item.player_id != player.player_id
        );
        const newPlayerPosition = {
          player_id: player.player_id,
          position,
        };

        setTeam({
          ...team,
          positions: [...filteredPositions, newPlayerPosition],
        });

        return true;
      }

      if (positionFound) {
        const filteredPlayers = team.players.filter(
          (item) => item.player_id != positionFound.player_id
        );
        const filteredPositions = team.positions.filter(
          (item) => item.position != positionFound.position
        );
        const newPlayerPosition = {
          player_id: player.player_id,
          position,
        };

        setTeam({
          ...team,
          positions: [...filteredPositions, newPlayerPosition],
          players: [...filteredPlayers, player],
        });
        return true;
      }

      // player OR position not found
      setTeam({
        ...team,
        players: [...team.players, player],
        positions: [
          ...team.positions,
          { player_id: player.player_id, position },
        ],
      });

      return true;
    } else {
      return false;
    }
  };

  const save = async (): Promise<boolean> => {
    if (team) {
      const response = await addToUserTeam(
        teamId,
        team.positions.map((item) => ({
          playerId: item.player_id,
          position: item.position,
        }))
      );

      return response;
    } else {
      return false;
    }
  };

  const changeLocalTeamIcon = (url: string) => {
    if (
      team &&
      team.players &&
      team.positions &&
      team.teamId &&
      team.team_name
    ) {
      setTeam({
        ...team,
        icon: url,
      });
    }
  };

  return { team, addPlayer, save, changeLocalTeamIcon };
};
