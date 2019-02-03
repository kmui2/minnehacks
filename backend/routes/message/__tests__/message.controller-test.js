const {
    postMessage,
    getMessages,
    getLatestMessageById,
    getMessageChain,
} = require('../message.controller');


jest.mock('../../../db');
const db = require('../../../db');

/**
 * Removes extra whitespace and new line characters.
 * @param {String} string 
 */
const parse = string => string.replace(/\s+/g, ' ').trim();

describe('postMessage', () => {
    let res;
    let rows;
    let err;

    beforeEach(() => {
        rows = [['yo mamma'], ['suckerbergs']];
        err = undefined;
        db.all = jest.fn((sql, args, cb) => {
            cb(err, rows);
        });

        res = {
            json: jest.fn(() => res),
            status: jest.fn(() => res),
        };
    });

    it('should respond 500 with missing fields', () => {
        const req = {
            body: {
                message_id: 'MyMessageId',
                to_id: 'MyToId',
                from_id: 'MyFromId',
                message_body: 'MyMessageBody',
                timestamp: 'MyTimestamp',
            },
        };

        postMessage(req, res);

        expect(res.status.mock.calls[0][0]).toBe(500);
        expect(res.json.mock.calls).toHaveLength(1);
    });

    it('should respond with rows when db is valid', () => {
        const req = {
            body: {
                message_id: 'MyMessageId',
                to_id: 'MyToId',
                from_id: 'MyFromId',
                message_body: 'MyMessageBody',
                timestamp: 'MyTimestamp',
                match_id: 'MyMatchId',
            },
        };

        postMessage(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("INSERT INTO Messages VALUES ('MyMessageId','MyMatchId', 'MyToId', 'MyFromId','MyMessageBody','MyTimestamp')");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            body: {
                message_id: 'MyMessageId',
                to_id: 'MyToId',
                from_id: 'MyFromId',
                message_body: 'MyMessageBody',
                timestamp: 'MyTimestamp',
                match_id: 'MyMatchId',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => postMessage(req, res)).toThrowError(err);
    });
});

describe('getMessages', () => {
    let res;
    let rows;
    let err;

    beforeEach(() => {
        rows = [['yo mamma'], ['suckerbergs']];
        err = undefined;
        db.all = jest.fn((sql, args, cb) => {
            cb(err, rows);
        });

        res = {
            json: jest.fn(() => res),
            status: jest.fn(() => res),
        };
    });

    it('should respond with rows when db is valid', () => {
        const req = {
        };

        getMessages(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual('SELECT * FROM Messages;');

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => getMessages(req, res)).toThrowError(err);
    });
});

describe('getLatestMessageById', () => {
    let res;
    let rows;
    let err;

    beforeEach(() => {
        rows = [['yo mamma'], ['suckerbergs']];
        err = undefined;
        db.all = jest.fn((sql, args, cb) => {
            cb(err, rows);
        });

        res = {
            json: jest.fn(() => res),
            status: jest.fn(() => res),
        };
    });

    it('should respond with rows when db is valid', () => {
        const req = {
            params: {
                matchid: 'MyMatchId',
            },
        };

        getLatestMessageById(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT * FROM Messages WHERE match_id = MyMatchId order by timestamp LIMIT 1;");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                matchid: 'MyMatchId',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => getLatestMessageById(req, res)).toThrowError(err);
    });
});

describe('getMessageChain', () => {
    let res;
    let rows;
    let err;

    beforeEach(() => {
        rows = [['yo mamma'], ['suckerbergs']];
        err = undefined;
        db.all = jest.fn((sql, args, cb) => {
            cb(err, rows);
        });

        res = {
            json: jest.fn(() => res),
            status: jest.fn(() => res),
        };
    });

    it('should respond with rows when db is valid', () => {
        const req = {
            params: {
                matchid: 'MyMatchId',
            },
        };

        getMessageChain(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT * FROM Messages WHERE match_id = MyMatchId order by timestamp;");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                matchid: 'MyMatchId',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => getMessageChain(req, res)).toThrowError(err);
    });
});
