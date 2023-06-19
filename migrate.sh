#!bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

python3 -m venv .venv

source .venv/bin/activate

pip3 install -r migration/requirements.txt

DB=migration/database.db
if [ -e "$DB" ]; then
    .venv/bin/python migration/main.py $1 $2
else
    echo "$DB does not exist. Place the required dataset inside the migration/ directory, and run this script again."
fi