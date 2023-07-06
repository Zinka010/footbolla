import { API_URL, PlayerPositions } from "./CONSTANTS";
import { ExtendedPlayer, UserTeam } from "../types/types";

export const createNewTeam = async (
  teamName: string,
  userId: number
): Promise<boolean> => {
  try {
    const url = `${API_URL}/createUserTeam/${userId}/teamName/${teamName}`;
    const res = await fetch(url, { method: "POST" });
    if (res.status == 200) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getTeam = async (teamId: number): Promise<UserTeam | null> => {
  try {
    const url = `${API_URL}/getTeam/${teamId}`;
    const res = await fetch(url);
    const data = await res.json();

    if (res.status == 200) {
      return data;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

export const searchPlayers = async (
  query: string
): Promise<ExtendedPlayer[]> => {
  try {
    const url = `${API_URL}/searchPlayers?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (res.status == 200) {
      return data;
    } else {
      return [];
    }
  } catch (e) {
    return [];
  }
};

export const addToUserTeam = async (
  teamId: number,
  players: { playerId: number; position: PlayerPositions }[]
): Promise<boolean> => {
  try {
    const url = `${API_URL}/addToUserTeam`;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        teamId,
        players,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status == 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};
