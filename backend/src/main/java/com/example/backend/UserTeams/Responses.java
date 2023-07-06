package com.example.backend.UserTeams;

class UserTeamResponse {
    private Integer teamId;
    private String teamName;
    UserTeamResponse(Integer teamId, String teamName) {
        this.teamName = teamName;
        this.teamId = teamId;
    }

    public Integer getTeamId() {
        return teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamId(int teamId) {
        this.teamId = teamId;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }
}

