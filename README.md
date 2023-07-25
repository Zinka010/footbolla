# CS348 Project - Footbolla

## C1 - Loading and Running

### Technical Requirements
- Java SDK 17
- Node.js (latest stable) and NPM
- Python3 and pip3 (or Python and pip if you're on Windows)
- MySQL Community Server on your machine

To load our sample database, follow these steps:
1. Download the dataset that are database inherits from. It can be found [here](https://www.kaggle.com/datasets/hugomathien/soccer).
2. Rename this file to `database.db` and move this file into the `migration/` directory of this repository.
  - If migration dir contains both database.db and database.sqlite, with database.db being empty, delete database.db and rename database.sqlite to database.db

For the next part to work, you will need a valid MySQL community server running on your computer (localhost) or another valid community for which you know the credentials (host, username, password). You will also need to have python3 installed on your command line. I think Python3 comes installed with all the newer MacOS versions. I'm not sure about Windows / Linux.

### Mac/Linux Users
3. Run the `migrate.sh` script as such: `bash migrate.sh [username] [password] [host]`. Run this file from the root level of the repository.
- The username defaults to "root".
- The password defaults to "password". 
- The host defaults to "localhost".

### Windows Users
3. Run the following sequence of commands in PowerShell, from the root directory. Keep in mind that `python` and `pip` can be replaced with `python3` and `pip3`, if you have only one installed on your path.
```
pip install -r migration/requirements.txt
python migration/main.py [mysql_username] [mysql_password] [mysql_host]
```
- The username defaults to "username".
- The password defaults to "password". 
- The host defaults to "localhost".

---

This means, if you have a local MySQL server and "username" and "password" are valid credentials for this MySQL server, you can just type `bash migrate.sh` and everything will work as expected. I'm not sure what happens if you only pass one argument, but I suggest passing zero arguments (your credentials match ours) or passing at least both the username and password as arguments to the bash script. 

Any errors that pop up will be related to the credentials for the SQL server or the lack of the database.db file. If there are no errors with these, then after the script successfully completes, you will see a database called 'footyfiend' in your MySQL server, which has all the data for our application.

To run our data-driven application, follow these steps.
1. Go to the root level of the project
2. Type in this command into the cli: `cd backend/`
3. Type in this command into the cli: `./gradlew bootRun` or `gradle bootRun`. Whichever works first.
4. Go into the frontend folder in a new terminal tab: `cd ../frontend` and type `npm install`
5. Run this command: `npm run dev` and it should tell you the link that the application is being served on.
6. You will need to sign up for an account by clicking `Sign up here` and signing up.
7. Login with the account you created.

### Currently Supported Features
- Create an account/login
- Search/order players
  - View player
- Search teams/leagues
  - View team/league 
- Create user teams and add players to these teams
- Simulate a match between two of your user teams and get a result
  
## C2 - SQL Code
All SQL code for this project can be found in `migration / relation-schema`

## C3 - SQL Queries for Features (sample data)
All SQL queries can be found in `sample-sql`

## C4 - SQL Queries for Features (production data)
- Need to populate C4

## C5 - Application Code
All application code for this project lives in the `frontend/` and `backend/` directories.



# Contributors
- Aryaman Dhingra
- Rishad Luthra
- Justin Toft
- Justun Gao
- Amman Waheed
