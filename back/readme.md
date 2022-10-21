docker run --name postgresql -e POSTGRES_USER=1234 -e POSTGRES_PASSWORD=1234 -p 5432:5432 -v /data:/var/lib/postgresql/data -d postgres

export DATABASE_URL=postgresql://1234:1234@localhost:5432/public

npx prisma migrate dev --name init
