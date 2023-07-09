import { PlayerPositions } from "../util/CONSTANTS";

export type Player = {
  player_id: number;
  name: string;
  birthday: string;
  height: number;
  weight: number;
};

export type ExtendedPlayer = Player & {
  gk_kicking: number;
  jumping: number;
  strength: number;
  penalties: number;
  curve: number;
  gk_positioning: number;
  stamina: number;
  standing_tackle: number;
  volleys: number;
  finishing: number;
  acceleration: number;
  dribbling: number;
  balance: number;
  gk_diving: number;
  positioning: number;
  ball_control: number;
  preferred_foot: string;
  defensive_work_rate: string;
  heading_accuracy: number;
  long_shots: number;
  gk_handling: number;
  potential: number;
  sliding_tackle: number;
  attacking_work_rate: string;
  long_passing: number;
  aggression: number;
  crossing: number;
  interceptions: number;
  short_passing: number;
  vision: number;
  marking: number;
  gk_reflexes: number;
  free_kick_accuracy: number;
  name: string;
  sprint_speed: number;
  reactions: number;
  overall_rating: number;
  shot_power: number;
  agility: number;
};

export type UserTeam = {
  teamId: number;
  team_name: string;
  players: ExtendedPlayer[];
  positions: {
    player_id: number;
    position: PlayerPositions;
  }[];
};

export type Team = {
  team_id: number;
  team_short_name: string;
  team_long_name: string;
}

export type TeamExtendedInfo = {
  team_id: number;
  team_short_name: string;
  team_long_name: string;
  team_api_id: number;
  buildUpPlaySpeed: number;
  buildUpPlaySpeedClass: string;
  buildUpPlaySpeedDribbling: number;
  buildUpPlayDribblingClass: string;
  buildUpPlayPassing: number;
  buildUpPlayPositioningClass: string;
  chanceCreationPassing: number;
  chanceCreationPassingClass: string;
  chanceCreationCrossing: number;
  chanceCreationCrossingClass: string;
  chanceCreationShooting: number;
  chanceCreationShootingClass: string;
  chanceCreationPositioningClass: string;
  defencePressure: number;
  defencePressureClass: string;
  defenceAgression: number;
  defenceAgressionClass: string;
  defenceTeamWidth: number;
  defenceTeamWidthClass: string;
  defenceDefenderLineClass: string;
}



