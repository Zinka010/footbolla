import sqlite3
import pymysql
import re
import os


sqlite_db = "database.db"
mysql_host = "localhost"
mysql_user = "root"
mysql_password = "password"
mysql_db = "footyfiend"


def main():
    # sqlite_conn = sqlite3.connect(sqlite_db)
    # sqlite_cursor = sqlite_conn.cursor()

    mysql_conn = pymysql.connect(
        host=mysql_host, user=mysql_user, password=mysql_password
    )
    mysql_cursor = mysql_conn.cursor()



    create_db(mysql_cursor)

    mysql_conn.select_db("footyfiend")
    mysql_cursor = mysql_conn.cursor()

    drop_tables(mysql_cursor)
    create_tables(mysql_cursor)


def drop_tables(mysql_cursor):
    tables = [
        "Admins",
        "MatchesPlayed",
        "IsInLeague",
        "IsInUserTeam",
        "Leagues",
        "IsOwnerOf",
        "UserTeams",
        "Matches",
        "Players",
        "Teams",
        "Users",
    ]

    for table in tables:
        drop_query = f"DROP TABLE IF EXISTS {table}"
        mysql_cursor.execute(drop_query)


def create_tables(mysql_cursor):
    create_players(mysql_cursor)
    create_leagues(mysql_cursor)
    create_teams(mysql_cursor)
    create_matches(mysql_cursor)
    create_users(mysql_cursor)
    create_is_in_league(mysql_cursor)
    create_user_teams(mysql_cursor)
    create_matches_played(mysql_cursor)
    create_isownerof(mysql_cursor)
    create_isinuserteam(mysql_cursor)
    create_admin(mysql_cursor)



def sqlFileContent(path):
    content = open("migration/relation-schema/" + path).read()
    return content


def create_db(mysql_cursor):
    create_db_sql = sqlFileContent("create/CREATE_DB.sql")
    mysql_cursor.execute(create_db_sql)


def create_players(mysql_cursor):
    create_players_sql = sqlFileContent("create/CREATE_PLAYERS.sql")
    mysql_cursor.execute(create_players_sql)


def create_leagues(mysql_cursor):
    create_leagues_sql = sqlFileContent("create/CREATE_LEAGUES.sql")
    mysql_cursor.execute(create_leagues_sql)


def create_teams(mysql_cursor):
    create_teams_sql = sqlFileContent("create/CREATE_TEAMS.sql")
    mysql_cursor.execute(create_teams_sql)


def create_matches(mysql_cursor):
    create_matches_sql = sqlFileContent("create/CREATE_MATCHES.sql")
    mysql_cursor.execute(create_matches_sql)


def create_users(mysql_cursor):
    create_users_sql = sqlFileContent("create/CREATE_USERS.sql")
    mysql_cursor.execute(create_users_sql)


def create_is_in_league(mysql_cursor):
    create_is_in_league_sql = sqlFileContent("create/CREATE_ISINLEAGUE.sql")
    mysql_cursor.execute(create_is_in_league_sql)


def create_user_teams(mysql_cursor):
    create_user_teams_sql = sqlFileContent("create/CREATE_USER_TEAMS.sql")
    mysql_cursor.execute(create_user_teams_sql)


def create_matches_played(mysql_cursor):
    create_matches_played_sql = sqlFileContent("create/CREATE_MATCHES_PLAYED.sql")
    mysql_cursor.execute(create_matches_played_sql)


def create_isownerof(mysql_cursor):
    create_isownerof_sql = sqlFileContent("create/CREATE_ISOWNEROF.sql")
    mysql_cursor.execute(create_isownerof_sql)


def create_isinuserteam(mysql_cursor):
    create_isinuserteam_sql = sqlFileContent("create/CREATE_ISINUSERTEAM.sql")
    mysql_cursor.execute(create_isinuserteam_sql)


def create_admin(mysql_cursor):
    create_admin_sql = sqlFileContent("create/CREATE_ADMIN.sql")
    mysql_cursor.execute(create_admin_sql)


if __name__ == "__main__":
    main()
