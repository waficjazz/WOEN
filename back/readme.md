docker run --name postgresql -e POSTGRES_USER=1234 -e POSTGRES_PASSWORD=1234 -p 5432:5432 -v /data:/var/lib/postgresql/data -d postgres

export DATABASE_URL=postgresql://1234:1234@localhost:5432/public

npx prisma migrate dev --name init

##push changes to database
npx prisma db push

npx prisma generate

const client = createClient();

import { createClient } from "redis";

client.on("error", (err) => console.log("Redis Client Error", err));

const doWork = async () => {
const pub = client.duplicate();
await pub.connect();
// sleep 10s
await new Promise((resolve) => setTimeout(resolve, 10000));
await pub.publish("channel", "message");
};

const continueWork = async () => {
const sub = client.duplicate();
await sub.connect();
await sub.subscribe("channel", (message) => {
console.log(message); // 'message'
});
await sub.unsubscribe("channel");
};

doWork();

continueWork();

// generate drizzle schema from existing db
npx drizzle-kit introspect:pg --out=migrations/ --connectionString=postgresql://1234:1234@localhost:5432/public
