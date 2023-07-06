export const API_URL = "http://localhost:8080";

export enum PlayerPositions {
  GOALKEEPER,
  RIGHT_BACK,
  RIGHT_CENTER_BACK,
  LEFT_CENTER_BACK,
  LEFT_BACK,
  RIGHT_MIDFIELDER,
  CENTER_MIDFIELDER,
  LEFT_MIDFIELDER,
  RIGHT_FORWARD,
  CENTER_FORWARD,
  LEFT_FORWARD,
}

export const positionMap: { [key: number]: string } = {
  [PlayerPositions.GOALKEEPER]: "Goalkeeper",
  [PlayerPositions.LEFT_BACK]: "Left Back",
  [PlayerPositions.LEFT_CENTER_BACK]: "Center Back",
  [PlayerPositions.RIGHT_CENTER_BACK]: "Center Back",
  [PlayerPositions.RIGHT_BACK]: "Right Back",
  [PlayerPositions.LEFT_MIDFIELDER]: "Left Midfielder",
  [PlayerPositions.CENTER_MIDFIELDER]: "Center Midfielder",
  [PlayerPositions.RIGHT_MIDFIELDER]: "Right Midfielder",
  [PlayerPositions.LEFT_FORWARD]: "Left Forward",
  [PlayerPositions.CENTER_FORWARD]: "Center Forward",
  [PlayerPositions.RIGHT_FORWARD]: "Right Forward",
};
