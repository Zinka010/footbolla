import { API_URL, PlayerPositions } from "./CONSTANTS";
import { ExtendedPlayer, UserTeam } from "../types/types";
import { User } from "../contexts/userContext";

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

export const signUp = async (
  username: string,
  password: string,
  email: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const url = `${API_URL}/signup`;

    const body = {
      username: username,
      password: password,
      email: email,
    };

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.text();

    return {
      success: res.status == 200,
      message: data,
    };
  } catch (err) {
    return {
      success: false,
      message: "Unknown error",
    };
  }
};

export const login = async (
  username: string,
  password: string
): Promise<{ success: boolean; user: User | null; message: string }> => {
  const url = `${API_URL}/login`;
  const body = {
    username,
    password,
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    const message = await response.text();

    return { success: false, user: null, message };
  }

  const data = await response.json();

  return {
    success: true,
    user: {
      username: data[0].username,
      id: data[0].user_id,
      email: data[0].email,
    },
    message: "Login successful",
  };
};

export const predictWinner = async (
  team1Id: string,
  team2Id: string
): Promise<string> => {
  try {
      const url = `${API_URL}/predictWinner/${team1Id}/${team2Id}`;
      const res = await fetch(url, { method: "POST" });
      if (res.status == 200) {
        return res;
      } else {
        return "";
      }
    } catch (e) {
      console.error(e);
      return "";
    }
};
