import * as dotenv from "dotenv";
dotenv.config();
export const CONFIG = {
	nodeEnv: process.env.NODE_ENV ?? "dev",
	port: process.env.PORT ?? 3000,
	dbName: process.env.DB_NAME ?? "sqlite::memory:",
	dbUserName: process.env.DB_USERNAME ?? "",
	dbPassword: process.env.DB_PASSWORD ?? "",
	dbHost: process.env.DB_HOST ?? "localhost",
	dbDialect: process.env.DB_DIALECT ?? "sqlite",
	dbPort: process.env.DB_PORT ?? "",
} as const;

console.log(CONFIG);
console.log(process.env.NODE_ENV);
