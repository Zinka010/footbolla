package com.example.backend.UserTeams;

import com.example.backend.util.PlayerPositions;

class PlayerObject {
    private Integer playerId;
    private PlayerPositions position;

    Integer getPlayerId() {
        return this.playerId;
    }

    PlayerPositions getPosition() {
        return this.position;
    }

    void setPlayerId(Integer playerId) {
        this.playerId = playerId;
    }

    void setPosition(PlayerPositions position) {
        this.position = position;
    }
}

class AddToUserTeamRequest {
    private Integer teamId;
    private PlayerObject[] players;

    Integer getTeamId() {
        return teamId;
    }

    PlayerObject[] players() {
        return players;
    }

    void setTeamId(Integer teamId) {
        this.teamId = teamId;
    }

    void setPlayers(PlayerObject[] players) {
        this.players = players;
    }
}
