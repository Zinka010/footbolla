package com.example.backend.UserTeams;

class AddToUserTeamRequest {
    private Integer teamId;
    private Integer[] playerIDs;

    Integer getTeamId() {
        return teamId;
    }

    Integer[] getPlayerIDs() {
        return playerIDs;
    }

    void setTeamId(Integer teamId) {
        this.teamId = teamId;
    }

    void setPlayerIDs(Integer[] playerIDs) {
        this.playerIDs = playerIDs;
    }
}
