import sqlite3
import pymysql
import re
import os
import sys


sqlite_db = "migration/database.db"

mysql_host = sys.argv[3] if (len(sys.argv) > 3) else "localhost"
mysql_user = sys.argv[1] if (len(sys.argv) > 1) else "root"
mysql_password = sys.argv[2] if (len(sys.argv) > 2) else "password"
mysql_db = "footyfiend"


def main():
    sqlite_conn = None
    try:
        sqlite_conn = sqlite3.connect(sqlite_db)
    except Exception as e:
        print(e)
        exit(1)

    sqlite_cursor = sqlite_conn.cursor()

    manipulate_sqlite(sqlite_conn)

    mysql_conn = None

    try:
        mysql_conn = pymysql.connect(
            host=mysql_host, user=mysql_user, password=mysql_password
        )
    except Exception as e:
        print(e)
        exit(1)

    mysql_cursor = mysql_conn.cursor()

    create_db(mysql_cursor)

    mysql_conn.select_db("footyfiend")
    mysql_cursor = mysql_conn.cursor()

    # drop_tables removes all the tables so we can have a fresh set in create_tables. It is a destructive action that
    #   will be removed once the data migration is complete.
    drop_tables(mysql_cursor)
    create_tables(mysql_cursor)
    populate_tables(mysql_cursor, sqlite_cursor, mysql_conn)

    # comment next line for no performance tuning
    create_indexes(mysql_cursor, mysql_conn)


def sqlFileContent(path):
    content = open("migration/relation-schema/" + path).read()
    return content


def manipulate_sqlite(sqlite_conn):
    alters = sqlFileContent("manipulating-dataset/ADD_MATCH_COLUMNS.sql").split(";")

    for alter in alters:
        if alter.strip() != "":
            try:
                sqlite_conn.execute(alter)
                sqlite_conn.commit()
            except Exception as e:
                # do nothing, columns already exist
                e

    updates = sqlFileContent("manipulating-dataset/UPDATE_MATCH_COLUMNS.sql").split(";")

    for update in updates:
        if update.strip() != "":
            try:
                sqlite_conn.execute(update)
                sqlite_conn.commit()
            except Exception as e:
                # do nothing, don't know why this would fail
                e


def drop_tables(mysql_cursor):
    tables = [
        "Admins",
        "MatchesPlayed",
        "PlayerTeamHistory",
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
    create_player_history(mysql_cursor)


def populate_tables(mysql, sqlite, conn):
    populate_leagues(mysql, sqlite, conn)
    populate_sample_users(mysql, conn)
    populate_sample_admin(mysql, conn)
    populate_sample_teams(mysql, sqlite, conn)
    populate_sample_players(mysql, sqlite, conn)
    populate_sample_matches(mysql, sqlite, conn)
    populate_sample_matches_played(mysql, sqlite, conn)
    populate_is_in_league(mysql, sqlite, conn)
    populate_user_teams(mysql, conn)
    populate_is_owner_of(mysql, conn)
    populate_is_in_user_team(mysql, conn)
    populate_player_history(mysql, sqlite, conn)


def create_indexes(mysql, conn):
    # comment out next line (137) to not create user team index
    create_user_team_index(mysql, conn)
    return


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


def create_player_history(mysql_cursor):
    create_player_team_sql = sqlFileContent("create/CREATE_PLAYER_HISTORY.sql")
    mysql_cursor.execute(create_player_team_sql)


def populate_leagues(mysql_cursor, sqlite_cursor, mysql_conn):
    sqlite_cursor.execute("SELECT id, name FROM League")
    rows = sqlite_cursor.fetchall()

    for row in rows:
        placeholder = ",".join(["%s"] * len(row))
        mysql_cursor.execute(f"INSERT INTO Leagues VALUES({placeholder})", row)
    mysql_conn.commit()


def populate_sample_users(mysql_cursor, mysql_conn):
    insert_users_sql = sqlFileContent("sample-data/SAMPLE_USERS.sql")
    inserts = insert_users_sql.split(";")
    for insert in inserts:
        if insert.strip() != "":
            mysql_cursor.execute(insert)
    mysql_conn.commit()


def populate_sample_admin(mysql_cursor, mysql_conn):
    insert_admin_sql = sqlFileContent("sample-data/SAMPLE_ADMIN.sql")
    mysql_cursor.execute(insert_admin_sql)
    mysql_conn.commit()


def populate_sample_teams(mysql_cursor, sqlite_cursor, mysql_conn):
    sample_teams_sql = sqlFileContent("sample-data/GET_SAMPLE_TEAMS.sql")
    sqlite_cursor.execute(sample_teams_sql)
    rows = sqlite_cursor.fetchall()
    for row in rows:
        try:
            placeholder = ",".join(["%s"] * len(row))
            mysql_cursor.execute(f"INSERT INTO Teams VALUES({placeholder})", row)
        except Exception as e:
            print(e)
    mysql_conn.commit()


def populate_sample_players(mysql_cursor, sqlite_cursor, mysql_conn):
    sample_players_sql = sqlFileContent("sample-data/GET_SAMPLE_PLAYERS.sql")
    sqlite_cursor.execute(sample_players_sql)
    rows = sqlite_cursor.fetchall()

    for row in rows:
        try:
            placeholder = ",".join(["%s"] * len(row))
            mysql_cursor.execute(f"INSERT INTO Players VALUES({placeholder})", row)
        except Exception as e:
            print(e)
    mysql_conn.commit()


def populate_sample_matches(mysql_cursor, sqlite_cursor, mysql_conn):
    get_teams_in_mysql = "SELECT team_id FROM Teams"
    mysql_cursor.execute(get_teams_in_mysql)
    rows = mysql_cursor.fetchall()

    id_in = []
    for row in rows:
        id_in.append(str(row[0]))

    ids = ", ".join(id_in)

    get_matches_in_sqlite = f"""
    SELECT id, season, home_team_goal, away_team_goal
    FROM Match
    WHERE home_team_id IN ({ids})
    OR away_team_id IN ({ids})
    """
    sqlite_cursor.execute(get_matches_in_sqlite)
    matches = sqlite_cursor.fetchall()

    for match in matches:
        try:
            placeholder = ",".join(["%s"] * len(match))
            mysql_cursor.execute(f"INSERT INTO Matches VALUES ({placeholder})", match)
        except Exception as e:
            print(e)
    mysql_conn.commit()


def populate_sample_matches_played(mysql_cursor, sqlite_cursor, mysql_conn):
    get_teams_in_mysql = "SELECT team_id FROM Teams"
    mysql_cursor.execute(get_teams_in_mysql)
    rows = mysql_cursor.fetchall()

    id_in = []
    for row in rows:
        id_in.append(str(row[0]))

    ids = ", ".join(id_in)

    get_match = f"""
    SELECT id, home_team_id, away_team_id
    FROM Match
    WHERE home_team_id IN ({ids})
    OR away_team_id IN ({ids})
    """

    sqlite_cursor.execute(get_match)
    matches = sqlite_cursor.fetchall()

    for match in matches:
        try:
            placeholder = ",".join(["%s"] * len(match))
            mysql_cursor.execute(
                f"INSERT INTO MatchesPlayed VALUES ({placeholder})", match
            )
        except Exception as e:
            # do nothing
            e

    mysql_conn.commit()


def populate_is_in_league(mysql_cursor, sqlite_cursor, mysql_conn):
    get_team_league_sql = sqlFileContent("sample-data/GET_TEAM_LEAGUE.sql")

    sqlite_cursor.execute(get_team_league_sql)
    rows = sqlite_cursor.fetchall()

    for row in rows:
        try:
            placeholder = ",".join(["%s"] * len(row))
            mysql_cursor.execute(f"INSERT INTO IsInLeague VALUES ({placeholder})", row)
        except Exception as e:
            # do nothing
            e
    mysql_conn.commit()


def populate_user_teams(mysql_cursor, mysql_conn):
    sample_user_teams = sqlFileContent("sample-data/SAMPLE_USER_TEAMS.sql")

    inserts = sample_user_teams.split(";")

    for insert in inserts:
        if insert.strip() != "":
            try:
                mysql_cursor.execute(insert)
            except Exception as e:
                # do nothing
                e
    mysql_conn.commit()


def populate_is_owner_of(mysql_cursor, mysql_conn):
    sample_is_owner_sql = sqlFileContent("sample-data/SAMPLE_IS_OWNER_OF.sql")

    inserts = sample_is_owner_sql.split(";")

    for insert in inserts:
        if insert.strip() != "":
            try:
                mysql_cursor.execute(insert)
            except Exception as e:
                # do nothing
                e

    mysql_conn.commit()


def populate_is_in_user_team(mysql_cursor, mysql_conn):
    sample_sql = sqlFileContent("sample-data/SAMPLE_ISINUSERTEAM.sql")

    inserts = sample_sql.split(";")

    for insert in inserts:
        if insert.strip() != "":
            try:
                mysql_cursor.execute(insert)
            except Exception as e:
                print(e)

    mysql_conn.commit()


def populate_player_history(mysql_cursor, sqlite_cursor, mysql_conn):
    sample_sql = sqlFileContent("sample-data/GET_PLAYER_HISTORY.sql")

    sqlite_cursor.execute(sample_sql)
    rows = sqlite_cursor.fetchall()

    for row in rows:
        try:
            placeholder = ",".join(["%s"] * len(row))
            mysql_cursor.execute(
                f"INSERT INTO PlayerTeamHistory VALUES ({placeholder})", row
            )
        except Exception as e:
            # do nothing
            e
    mysql_conn.commit()


def create_user_team_index(mysql, conn):
    index_sql = sqlFileContent("indexes/USER_TEAMS.sql")

    mysql.execute(index_sql, multi=True)
    conn.commit()


if __name__ == "__main__":
    main()
