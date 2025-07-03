import pgPromise from "pg-promise";

const pgp = pgPromise();
const db = pgp(process.env.DATABASE_URL as string);

export default db;
