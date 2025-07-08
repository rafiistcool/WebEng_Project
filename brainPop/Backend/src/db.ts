import pgPromise from "pg-promise";
import "dotenv/config";

const cn = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432",10),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

const pgp = pgPromise();
const db = pgp(cn);

export default db;
