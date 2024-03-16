#!/usr/bin/bash

if [ -d dev ]; then
  cd dev
else
  echo "-> Creating dev project"
  mkdir dev
  cd dev
  cat >package.json <<EOF
{
  "name": "directus-extension-generate-types-dev"
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
EOF
  yarn add directus --ignore-engines
  yarn directus bootstrap
  mkdir -p extensions
  ln -s ../.. extensions/directus-extension-generate-types
  echo
fi

echo "-> Building extension"

(cd .. && yarn build)

echo
echo "-> Starting dev server"
echo "   You can log in with:"
echo "     email: admin@example.com"
echo "     pw:    admin"
echo

yarn directus start
