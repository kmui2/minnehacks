jest.mock('sqlite3', () => ({
	Database:() => {}
}));
const db = jest.genMockFromModule('../index.js');

export default db;
