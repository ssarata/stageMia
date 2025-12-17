#!/bin/bash
set -e

echo "🔄 Waiting for PostgreSQL to be ready..."

# Attendre que PostgreSQL soit prêt (max 60 secondes)
timeout=60
counter=0

until npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1 || [ $counter -eq $timeout ]; do
  counter=$((counter + 1))
  echo "⏳ Waiting for database... ($counter/$timeout)"
  sleep 1
done

if [ $counter -eq $timeout ]; then
  echo "❌ Database connection timeout"
  exit 1
fi

echo "✅ PostgreSQL is ready!"

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

echo "🚀 Starting application..."
node dist/index.js
