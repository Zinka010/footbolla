package com.example.backend.UserTeams;

class UserTeamResponse {
    private Integer teamId;
    private String teamName;

    private String icon;
    UserTeamResponse(Integer teamId, String teamName, String icon) {
        this.teamName = teamName;
        this.teamId = teamId;
        this.icon = icon;
    }

    public Integer getTeamId() {
        return teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public String getIcon() {
        return icon;
    }

    public void setTeamId(int teamId) {
        this.teamId = teamId;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}

