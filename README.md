# CS348 Project - FootyFiend

## C1 - Loading and Running

To load our sample database, follow these steps:
1. Download the dataset that are database inherits from. It can be found [here](https://www.kaggle.com/datasets/hugomathien/soccer).
2. Rename this file to `database.db` and move this file into the `migration/` directory of this repository.

For the next part to work, you will need a valid MySQL commnuity server running on your computer (localhost) or another valid commuity for which you know the credentials (host, username, password). You will also need to have python3 installed on your command line. I think Python3 comes installed with all the newer MacOS versions. I'm not sure about Windows / Linux.

3. Run the `migrate.sh` script as such: `bash migrate.sh [username] [password] [host]`. Run this file from the root level of the repository.
- The username defaults to "username".
- The password defaults to "password". 
- The host defaults to "localhost".

This means, if you have a local MySQL server and "username" and "password" are valid credentials for this MySQL server, you can just type `bash migrate.sh` and everything will work as expected. I'm not sure what happens if you only pass one argument, but I suggest passing zero arguments (your credentials match ours) or passing at least both the username and password as arguments to the bash script. 

Any errors that popup will be related to the credentials for the SQL server, or the lack of the database.db file. If there are no errors with these, then after the script sucessfully completes, you will see a database called 'footyfiend' in your MySQL server, which has all the data for our application.

To run our data-driven application, follow these steps.
1. Go to the root level of the project
2. Type in this command into the cli: `cd backend/`
3. Type in this command into the cli: `./gradlew bootRun`

**TODO: add how to run frontend once connection between backend and frontend is complete**


# Contributors
- Aryaman Dhingra
- Rishad Luthra
- Justin Toft
- Justun Gao
- Amman Waheed
