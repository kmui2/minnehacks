const { createTables,
    deletetable,
    postMentor, postMentee, 
    postPasswords,
    getAllMentors, getAllMentees, getAllPasswords,
    getUserById,
    checkEmail,
    getEmailById,
    updateEmailById,
    getHobbiesById,
    updateHobbiesById,
    deleteHobbiesById,
    getSkillbyId,
    addSkill,
    getProfilePic,
    updateProfilePic,
    getProfession,
    updateProfession,
    getBio,
    updateBio,
    deleteBio,
    updateZipcode,
    login,
} = require('../user.controller');

jest.mock('../../../db');
jest.mock('../../../utils/getRandomArbitrary', () => ({
    getRandomArbitrary: () => 1,
}));

const db = require('../../../db');

/**
 * Removes extra whitespace and new line characters.
 * @param {String} string 
 */
const parse = string => string.replace(/\s+/g, ' ').trim();

describe('createTables', () => {
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

        createTables(req, res);

        expect(db.all.mock.calls[0][0]).toMatchSnapshot();
        expect(db.all.mock.calls[1][0]).toMatchSnapshot();
        expect(db.all.mock.calls[2][0]).toMatchSnapshot();
        expect(db.all.mock.calls[3][0]).toMatchSnapshot();

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {};

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => createTables(req, res)).toThrowError(err);
    });
});


describe('deletetable', () => {
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

        deletetable(req, res);

        expect(db.all.mock.calls[0][0]).toEqual('DROP TABLE IF EXISTS Mentors;');
        expect(db.all.mock.calls[1][0]).toEqual('DROP TABLE IF EXISTS Mentees;');
        expect(db.all.mock.calls[2][0]).toEqual('DROP TABLE IF EXISTS Matches;');
        expect(db.all.mock.calls[3][0]).toEqual('DROP TABLE IF EXISTS Messages;');

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {};

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => deletetable(req, res)).toThrowError(err);
    });
});

describe('postMentor', () => {
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
                user_id: 'MyUserId',
                first_name: 'MyFirstName',
                last_name: 'MyLastName',
            },
        };

        postMentor(req, res);

        expect(res.status.mock.calls[0][0]).toBe(500);
        expect(res.json.mock.calls).toHaveLength(1);
    });

    it('should respond with rows when db is valid', () => {
        const req = {
            body: {
                user_id: 'MyUserId',
                first_name: 'MyFirstName',
                last_name: 'MyLastName',
                email_address: 'MyEmailAddress',
                biography: 'MyBiography',
                zipcode: 'MyZipcode',
                date_of_birth: 'MyDateOfBirth',
                profession: 'Myprofession',
                skills: 'MySkills',
                profile_pic_URL: 'MyProfilePicUrl',
                hobbies: 'MyHobbies',
            },
        };

        postMentor(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual(
            `INSERT INTO Mentors VALUES ('MyUserId', 'MyFirstName', 'MyLastName', 'MyEmailAddress', 'MyBiography', 'MyZipcode', 'MyDateOfBirth', 'Myprofession', 'MySkills', 'MyProfilePicUrl', 'MyHobbies')`
        );

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            body: {
                user_id: 'MyUserId',
                first_name: 'MyFirstName',
                last_name: 'MyLastName',
                email_address: 'MyEmailAddress',
                biography: 'MyBiography',
                zipcode: 'MyZipcode',
                date_of_birth: 'MyDateOfBirth',
                profession: 'Myprofession',
                skills: 'MySkills',
                profile_pic_URL: 'MyProfilePicUrl',
                hobbies: 'MyHobbies',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => postMentor(req, res)).toThrowError(err);
    });
});


describe('postMentee', () => {
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
                user_id: 'MyUserId',
                first_name: 'MyFirstName',
                last_name: 'MyLastName',
                email_address: 'MyEmailAddress',
            },
        };

        postMentee(req, res);

        expect(res.status.mock.calls[0][0]).toBe(500);
        expect(res.json.mock.calls).toHaveLength(1);
    });

    it('should respond with user object when db is valid', () => {
        const req = {
            body: {
                user_id: 'MyUserId',
                first_name: 'MyFirstName',
                last_name: 'MyLastName',
                email_address: 'MyEmailAddress',
                biography: 'MyBiography',
                zipcode: 'MyZipcode',
                date_of_birth: 'MyDateOfBirth',
                profession: 'Myprofession',
                skills: 'MySkills',
                profile_pic_URL: 'MyProfilePicUrl',
                hobbies: 'MyHobbies',
            },
        };

        postMentee(req, res);

        // console.log(db.all.mock.calls);

        expect(parse(db.all.mock.calls[0][0])).toEqual(
            "INSERT INTO Mentees VALUES ('1', 'MyFirstName', 'MyLastName', 'MyEmailAddress', 'MyBiography', 'MyZipcode', 'MyDateOfBirth', 'MySkills', 'http://10.140.65.177:8000/user/1/profilepic', 'MyHobbies')"
        );

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            mentee: {"mentee": {"biography": "MyBiography", "date_of_birth": "MyDateOfBirth", "email_address": "MyEmailAddress", "first_name": "MyFirstName", "hobbies": "MyHobbies","last_name": "MyLastName", "profile_pic_URL": "http://10.140.65.177:8000/user/1/profilepic", "skills": "MySkills", "user_id": 1, "zipcode": "MyZipcode"}, "success": true},
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            body: {
                user_id: 'MyUserId',
                first_name: 'MyFirstName',
                last_name: 'MyLastName',
                email_address: 'MyEmailAddress',
                biography: 'MyBiography',
                zipcode: 'MyZipcode',
                date_of_birth: 'MyDateOfBirth',
                profession: 'Myprofession',
                skills: 'MySkills',
                profile_pic_URL: 'MyProfilePicUrl',
                hobbies: 'MyHobbies',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => postMentee(req, res)).toThrowError(err);
    });
});

describe('postPasswords', () => {
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
                user_id: 'MyUserId',
                email_address: 'MyEmailAddress',
            },
        };

        postPasswords(req, res);

        expect(res.status.mock.calls[0][0]).toBe(500);
        expect(res.json.mock.calls).toHaveLength(1);
    });

    it('should respond with rows when db is valid', () => {
        const req = {
            body: {
                user_id: 'MyUserId',
                email_address: 'MyEmailAddress',
                password: 'MyPassword',
            },
        };

        postPasswords(req, res);

        // console.log(db.all.mock.calls);

        expect(parse(db.all.mock.calls[0][0])).toEqual(
            "INSERT INTO Passwords VALUES ('MyUserId', 'MyEmailAddress', 'MyPassword')"
        );

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            body: {
                user_id: 'MyUserId',
                email_address: 'MyEmailAddress',
                password: 'MyPassword',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => postPasswords(req, res)).toThrowError(err);
    });
});


describe('getAllMentors', () => {
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

        getAllMentors(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT * FROM Mentors;");

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
        expect(() => getAllMentors(req, res)).toThrowError(err);
    });
});



describe('getAllMentees', () => {
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

        getAllMentees(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT * FROM Mentees;");

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
        expect(() => getAllMentees(req, res)).toThrowError(err);
    });
});


describe('getAllPasswords', () => {
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

        getAllPasswords(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT * FROM Passwords;");

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
        expect(() => getAllPasswords(req, res)).toThrowError(err);
    });
});


describe('getUserById', () => {
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

    it('should respond with Mentor when db is valid', () => {
        const req = {
            params: {
                id: 1000,
            },
        };

        getUserById(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT * FROM Mentees where Mentees.user_id = 1000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee when db is valid', () => {
        const req = {
            params: {
                id: 2000,
            },
        };

        getUserById(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT * FROM Mentees where Mentees.user_id = 2000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => getUserById(req, res)).toThrowError(err);
    });
});


describe('checkEmail', () => {
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

    it('should respond with Mentor email address when db is valid', () => {
        const req = {
            params: {
                id: 1000,
                email: 'myemail@yahoo.com',
            },
        };

        checkEmail(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT email_address FROM Mentees WHERE user_id = 1000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee email address when db is valid', () => {
        const req = {
            params: {
                id: 2000,
                email: 'myemail@yahoo.com',
            },
        };

        checkEmail(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT email_address FROM Mentees WHERE user_id = 2000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
                email: 'myemail@yahoo.com',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => checkEmail(req, res)).toThrowError(err);
    });
});


describe('getEmailById', () => {
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

    it('should respond with Mentor email address when db is valid', () => {
        const req = {
            params: {
                id: 1000,
                email: 'myemail@yahoo.com',
            },
        };

        getEmailById(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT email_address FROM Mentees WHERE user_id = 1000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee email address when db is valid', () => {
        const req = {
            params: {
                id: 2000,
                email: 'myemail@yahoo.com',
            },
        };

        getEmailById(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT email_address FROM Mentees WHERE user_id = 2000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
                email: 'myemail@yahoo.com',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => getEmailById(req, res)).toThrowError(err);
    });
});



describe('updateEmailById', () => {
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

    it('should respond with Mentor email address when db is valid', () => {
        const req = {
            params: {
                id: 1000,
                email: 'myemail@yahoo.com',
            },
        };

        updateEmailById(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("UPDATE Mentees SET email_address='myemail@yahoo.com' WHERE user_id = 1000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee email address when db is valid', () => {
        const req = {
            params: {
                id: 2000,
                email: 'myemail@yahoo.com',
            },
        };

        updateEmailById(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("UPDATE Mentees SET email_address='myemail@yahoo.com' WHERE user_id = 2000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
                email: 'myemail@yahoo.com',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => updateEmailById(req, res)).toThrowError(err);
    });
});




describe('getHobbiesById', () => {
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

    it('should respond with Mentor hobbies when db is valid', () => {
        const req = {
            params: {
                id: 1000,
            },
        };

        getHobbiesById(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT hobbies FROM Mentees WHERE Mentees.user_id = 1000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee hobbies when db is valid', () => {
        const req = {
            params: {
                id: 2000,
            },
        };

        getHobbiesById(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT hobbies FROM Mentees WHERE Mentees.user_id = 2000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => getHobbiesById(req, res)).toThrowError(err);
    });
});



describe('updateHobbiesById', () => {
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

    it('should respond with Mentor hobbies when db is valid', () => {
        const req = {
            params: {
                id: 1000,
                hobby: 'MyHobbie',
            },
        };

        updateHobbiesById(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("UPDATE Mentees SET hobbies='MyHobbie' WHERE user_id = 1000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee hobbies when db is valid', () => {
        const req = {
            params: {
                id: 2000,
                hobby: 'MyHobbie',
            },
        };

        updateHobbiesById(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("UPDATE Mentees SET hobbies='MyHobbie' WHERE user_id = 2000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
                hobby: 'MyHobbie',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => updateHobbiesById(req, res)).toThrowError(err);
    });
});



describe('deleteHobbiesById', () => {
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

    it('should respond with Mentor hobbies when db is valid', () => {
        const req = {
            params: {
                id: 1000,
            },
        };

        deleteHobbiesById(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual( "UPDATE Mentees SET hobbies='' WHERE user_id = 1000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee hobbies when db is valid', () => {
        const req = {
            params: {
                id: 2000,
            },
        };

        deleteHobbiesById(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("UPDATE Mentees SET hobbies='' WHERE user_id = 2000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => deleteHobbiesById(req, res)).toThrowError(err);
    });
});



describe('getSkillbyId', () => {
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

    it('should respond with Mentor skills when db is valid', () => {
        const req = {
            params: {
                id: 1000,
            },
        };

        getSkillbyId(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT skills FROM Mentees WHERE Mentees.user_id = 1000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee skills when db is valid', () => {
        const req = {
            params: {
                id: 2000,
            },
        };

        getSkillbyId(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT skills FROM Mentees WHERE Mentees.user_id = 2000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => getSkillbyId(req, res)).toThrowError(err);
    });
});

describe('addSkill', () => {
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

    it('should respond with Mentor skills when db is valid', () => {
        const req = {
            params: {
                id: 1000,
                skill: 'MySkill',
            },
        };

        addSkill(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("UPDATE Mentees SET skills = printf('%s,%s', skills, 'MySkill') WHERE user_id = 1000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee skills when db is valid', () => {
        const req = {
            params: {
                id: 2000,
                skill: 'MySkill',
            },
        };

        addSkill(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("UPDATE Mentees SET skills = printf('%s,%s', skills, 'MySkill') WHERE user_id = 2000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
                skill: 'MySkill',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => addSkill(req, res)).toThrowError(err);
    });
});

describe('getProfilePic', () => {
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

    it('should respond with Mentor profile pic when db is valid', () => {
        const req = {
            params: {
                id: 1000,
            },
        };

        getProfilePic(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT profile_pic_URL FROM Mentees WHERE Mentees.user_id = 1000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee profile pic when db is valid', () => {
        const req = {
            params: {
                id: 2000,
            },
        };

        getProfilePic(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT profile_pic_URL FROM Mentees WHERE Mentees.user_id = 2000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => getProfilePic(req, res)).toThrowError(err);
    });
});

describe('updateProfilePic', () => {
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

    it('should respond with Mentor profile pic when db is valid', () => {
        const req = {
            params: {
                id: 1000,
                profilepic: 'MyProfilePic',
            },
        };

        updateProfilePic(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("UPDATE Mentees SET profile_pic_URL ='MyProfilePic' WHERE user_id = 1000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee profile pic when db is valid', () => {
        const req = {
            params: {
                id: 2000,
                profilepic: 'MyProfilePic',
            },
        };

        updateProfilePic(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("UPDATE Mentees SET profile_pic_URL ='MyProfilePic' WHERE user_id = 2000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
                profilepic: 'MyProfilePic',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => updateProfilePic(req, res)).toThrowError(err);
    });
});


describe('getProfession', () => {
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

    it('should respond with Mentor profile pic when db is valid', () => {
        const req = {
            params: {
                id: 1000,
                profilepic: 'MyProfilePic'
            },
        };

        updateProfilePic(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("UPDATE Mentees SET profile_pic_URL ='MyProfilePic' WHERE user_id = 1000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee profile pic when db is valid', () => {
        const req = {
            params: {
                id: 2000,
                profilepic: 'MyProfilePic',
            },
        };

        updateProfilePic(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("UPDATE Mentees SET profile_pic_URL ='MyProfilePic' WHERE user_id = 2000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
                profilepic: 'MyProfilePic',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => updateProfilePic(req, res)).toThrowError(err);
    });
});


describe('getProfession', () => {
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

    

    

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => getProfession(req, res)).toThrowError(err);
    });
});

describe('updateProfession', () => {
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

   

    

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
                profession: 'MyProfession',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => updateProfession(req, res)).toThrowError(err);
    });
});

describe('getBio', () => {
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

    it('should respond with Mentor bio when db is valid', () => {
        const req = {
            params: {
                id: 1000,
            },
        };

        getBio(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT biography FROM Mentees WHERE Mentees.user_id = 1000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee bio when db is valid', () => {
        const req = {
            params: {
                id: 2000,
            },
        };

        getBio(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT biography FROM Mentees WHERE Mentees.user_id = 2000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => getBio(req, res)).toThrowError(err);
    });
});

describe('updateBio', () => {
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

    it('should respond with Mentor bio when db is valid', () => {
        const req = {
            params: {
                id: 1000,
                bio: 'MyBio',
            },
        };

        updateBio(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual( "UPDATE Mentees SET biography ='MyBio' WHERE user_id = 1000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee bio when db is valid', () => {
        const req = {
            params: {
                id: 2000,
                bio: 'MyBio',
            },
        };

        updateBio(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("UPDATE Mentees SET biography ='MyBio' WHERE user_id = 2000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
                bio: 'MyBio',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => updateBio(req, res)).toThrowError(err);
    });
});

describe('deleteBio', () => {
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

    it('should respond with Mentor bio when db is valid', () => {
        const req = {
            params: {
                id: 1000,
            },
        };

        deleteBio(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual( "UPDATE Mentees SET biography =' ' WHERE user_id = 1000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee bio when db is valid', () => {
        const req = {
            params: {
                id: 2000,
            },
        };

        deleteBio(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("UPDATE Mentees SET biography =' ' WHERE user_id = 2000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => deleteBio(req, res)).toThrowError(err);
    });
});

describe('updateZipcode', () => {
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

    it('should respond with Mentor zipcode when db is valid', () => {
        const req = {
            params: {
                id: 1000,
                zipcode: 'MyZipCode',
            },
        };

        updateZipcode(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("UPDATE Mentees SET zipcode ='MyZipCode' WHERE user_id = 1000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee zipcode when db is valid', () => {
        const req = {
            params: {
                id: 2000,
                zipcode: 'MyZipCode',
            },
        };

        updateZipcode(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("UPDATE Mentees SET zipcode ='MyZipCode' WHERE user_id = 2000");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            params: {
                id: 2000,
                zipcode: 'MyZipCode',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => updateZipcode(req, res)).toThrowError(err);
    });
});


describe('login', () => {
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

    it('should respond with Mentor login when db is valid', () => {
        const req = {
            body: {
                id: 1000,
                zipcode: 'MyZipCode',
                email_address: 'MyEmailAddress',
                password: 'MyPassword',
            },
        };

        login(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT COUNT(*) FROM (SELECT * FROM Passwords WHERE email_address='MyEmailAddress' AND password='MyPassword');");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should respond with Mentee login when db is valid', () => {
        const req = {
            body: {
                id: 2000,
                zipcode: 'MyZipCode',
                email_address: 'MyEmailAddress',
                password: 'MyPassword',
            },
        };

        login(req, res);

        expect(parse(db.all.mock.calls[0][0])).toEqual("SELECT COUNT(*) FROM (SELECT * FROM Passwords WHERE email_address='MyEmailAddress' AND password='MyPassword');");

        expect(res.json.mock.calls[0][0]).toEqual({
            success: true,
            rows: rows,
        });
    });

    it('should throw an error on database error', () => {
        const req = {
            body: {
                id: 2000,
                zipcode: 'MyZipCode',
                email_address: 'MyEmailAddress',
                password: 'MyPassword',
            },
        };

        err = new Error('Some Fatal Database Error');

        // NOTE: Create a new anonymous function that returns the function
        // that throws the error.
        expect(() => login(req, res)).toThrowError(err);
    });
});
