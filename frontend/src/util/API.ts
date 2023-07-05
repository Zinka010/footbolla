import { API_URL } from "./CONSTANTS";

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
