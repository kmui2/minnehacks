const dbPromise = require("./index");
const sql = require("sql-template-strings");

module.exports.addWeather = async (city, weather) => {
	const db = await dbPromise;
	await db.run(sql`INSERT INTO Weather VALUES (
		${city},
		${weather}
	)`)
}

module.exports.createWeatherTable = async () => {
	const db = await dbPromise;
	const dropUsersTableSql = sql`DROP TABLE IF EXISTS Weather;`;
	await db.run(sql`
		CREATE TABLE IF NOT EXISTS Weather (
				city varchar(255) NOT NULL,
				weather varchar(255) NOT NULL
		);
	`);
}

module.exports.getRandomWeather = async () => {
	const db = await dbPromise;
	return await db.get(sql`
		SELECT * FROM Weather ORDER BY RANDOM() LIMIT 1;
	`)
}
