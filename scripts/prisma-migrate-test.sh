#!/bin/sh
set -a
. .env.test
npx prisma migrate deploy
