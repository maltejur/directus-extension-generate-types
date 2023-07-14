#!/usr/bin/bash

if [ -d dev ]; then
  cd dev
else
  echo "-> Creating dev project"
  mkdir dev
  cd dev
  cat >package.json <<EOF
{
  "name": "directus-extension-generate-types-dev",
  "scripts": {
    "dev:nodemon": "nodemon --exec 'directus start' --watch extensions/directus-extension-generate-types/dist"
  }
}
EOF
  cat >.env <<EOF
DB_CLIENT="sqlite3"
DB_FILENAME="dev-data.db"
PUBLIC_URL="http://localhost:8055"
HOST="localhost"
KEY="_"
SECRET="_"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin"
EXTENSIONS_AUTO_RELOAD="true"

GENERATE_TYPES_SYNCED_TS_FILES="my-synced-types.d.ts, my-second-synced-types.d.ts"

EOF
  yarn add directus nodemon
  yarn directus bootstrap
  echo
fi

echo "-> Building and linking extension"

(cd .. && yarn directus-extension link ./dev/extensions)
(cd .. && yarn dev &)

echo
echo "-> Starting dev server"
echo "   You can log in with:"
echo "     email: admin@example.com"
echo "     pw:    admin"
echo

yarn directus start
# yarn dev:nodemon # using nodemon produces more readable log than EXTENSIONS_AUTO_RELOAD="true"
