#!/bin/sh

echo "⏳ Esperando MySQL subir..."

while ! nc -z db 3306; do
  sleep 1
done

echo "✅ MySQL pronto!"

echo "📦 Gerando Prisma Client..."
npx prisma generate

echo "🧱 Rodando migrations..."
npx prisma migrate deploy

echo "🌱 Rodando seed..."
npx prisma db seed || true

echo "🚀 Iniciando aplicação..."
npm start