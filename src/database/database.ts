import { Dialect, Sequelize } from "sequelize";
import { CONFIG } from "../config";

export let sequelize = new Sequelize("sqlite::memory:");

if (CONFIG.nodeEnv !== "dev") {
	const connString = `${CONFIG.dbDialect}://${CONFIG.dbUserName}:${CONFIG.dbPassword}@${CONFIG.dbHost}:${CONFIG.dbPort}/bookshop`;
	sequelize = new Sequelize(connString);
}
