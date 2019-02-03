const db = require('../index');

jest.mock('sqlite3', () => ({
	Database:(dbPath, cb) => {
        cb();
    }
}));

const sqlite3 = require('sqlite3');

it('connects to the database', () => {
    expect(db).toBeTruthy();
})
