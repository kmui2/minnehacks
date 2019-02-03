const dbPromise = require("./index");
const sql = require("sql-template-strings");

module.exports.addFact = async (fact) => {
	const db = await dbPromise;
	await db.run(sql`INSERT INTO Facts VALUES (
		${fact}
	)`)
}

module.exports.createFactTable = async () => {
	const db = await dbPromise;
	const dropUsersTableSql = sql`DROP TABLE IF EXISTS Facts;`;
	await db.run(sql`
		CREATE TABLE IF NOT EXISTS Weather (
				fact varchar(255) NOT NULL
		);
	`);
}

module.exports.getRandomFact = async () => {
	const db = await dbPromise;
	return await db.get(sql`
		SELECT * FROM Facts ORDER BY RANDOM() LIMIT 1;
	`)
}
