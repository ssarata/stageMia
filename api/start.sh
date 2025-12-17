#!/bin/bash
set -e

echo "========================================="
echo "🚀 Starting MIA API Deployment"
echo "========================================="

# Vérifier que DATABASE_URL est définie
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL is not set!"
  echo "Please configure DATABASE_URL in Railway variables"
  exit 1
fi

echo "✅ DATABASE_URL is configured"
echo "📦 Installing dependencies..."
npm install --production=false

echo "🔧 Generating Prisma Client..."
npx prisma generate

echo "🏗️ Building application..."
npm run build

echo "🔄 Waiting for PostgreSQL to be ready..."

# Attendre que PostgreSQL soit prêt (max 90 secondes)
max_attempts=90
attempt=0

until npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ $attempt -eq $max_attempts ]; then
    echo "❌ Database connection timeout after ${max_attempts} seconds"
    echo "DATABASE_URL format: ${DATABASE_URL%%:*}://****"
    exit 1
  fi
  echo "⏳ Waiting for database... (${attempt}/${max_attempts})"
  sleep 1
done

echo "✅ PostgreSQL is ready!"

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

echo "✅ Migrations completed!"

echo "🚀 Starting application..."
node dist/index.js
