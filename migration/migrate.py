import sqlite3
import pymysql
import re


def sqlite_to_mysql(sqlite_db, mysql_host, mysql_user, mysql_password, mysql_db):
    sqlite_conn = sqlite3.connect(sqlite_db)
    sqlite_cursor = sqlite_conn.cursor()

    mysql_conn = pymysql.connect(
        host=mysql_host, user=mysql_user, password=mysql_password, db=mysql_db
    )
    mysql_cursor = mysql_conn.cursor()

    attribute_tables = [
        "Team_Attributes",
        "Player_Attributes",
    ]

    non_attribute_tables = [
        "Player",
        "Team",
        "Country",
        "League",
        "Matches",
    ]

    table_drop_order = [
        "Matches",
        "Team_Attributes",
        "Team",
        "League",
        "Player_Attributes",
        "Country",
        "Player",
    ]

    for table_name in table_drop_order:
        drop_query = f"DROP TABLE IF EXISTS {table_name}"
        mysql_cursor.execute(drop_query)

    create_team_sql = open("sql/CREATE_TEAM.sql").read()
    mysql_cursor.execute(create_team_sql)

    create_country_sql = open("sql/CREATE_COUNTRY.sql").read()
    mysql_cursor.execute(create_country_sql)

    create_player_sql = open("sql/CREATE_PLAYER.sql").read()
    mysql_cursor.execute(create_player_sql)

    create_league_sql = open("sql/CREATE_LEAGUE.sql").read()
    mysql_cursor.execute(create_league_sql)

    create_player_attributes_sql = open("sql/CREATE_PLAYER_ATTRIBUTES.sql").read()
    mysql_cursor.execute(create_player_attributes_sql)

    create_team_attributes_sql = open("sql/CREATE_TEAM_ATTRIBUTES.sql").read()
    mysql_cursor.execute(create_team_attributes_sql)

    create_match_sql = open("sql/CREATE_MATCH.sql").read()
    mysql_cursor.execute(create_match_sql)

    errors = []

    for table_name in non_attribute_tables:
        sqlite_table_name = "Match" if table_name == "Matches" else table_name

        # Retrieve the data from SQLite
        sqlite_cursor.execute(f"SELECT * FROM {sqlite_table_name}")
        rows = sqlite_cursor.fetchall()

        # Insert the data into MySQL
        for row in rows:
            # try:
            placeholders = ",".join(["%s"] * len(row))
            mysql_cursor.execute(
                f"INSERT INTO {table_name} VALUES ({placeholders})", row
            )
            # except:
            #     errors.append({table_name, row})

        # Commit changes for each table
        mysql_conn.commit()

    # Close connections
    sqlite_cursor.close()
    sqlite_conn.close()
    mysql_cursor.close()
    mysql_conn.close()


# Usage example
sqlite_db = "database.db"
mysql_host = "localhost"
mysql_user = "root"
mysql_password = "password"
mysql_db = "test_db"

sqlite_to_mysql(sqlite_db, mysql_host, mysql_user, mysql_password, mysql_db)
