const path = require("path");
const fs = require("fs");
const dbPromise = require("../../db");
const sql = require("sql-template-strings");
const ip = require("ip");
const axios = require("axios");
const qs = require("qs");

const SQL = require("../../config/user_sql_constants.js");
const hp = require("../../config/helper.js");
const ip_address = ip.address();


//create all tables
module.exports.createTables = async (req, res) => {
  try {
    const db = await dbPromise;
    await Promise.all([
      db.run(SQL.CREATE_USERS_TABLE),
      db.run(SQL.CREATE_PASSWORD_TABLE),
      db.run(SQL.CREATE_MATCHES_TABLE),
      db.run(SQL.CREATE_MESSAGES_TABLE),
      db.run(SQL.CREATE_SKILLS_TABLE),
      db.run(SQL.CREATE_PROFESSIONS_TABLE),
      db.run(SQL.CREATE_PUSH_TOKENS_TABLE),
    ]);
    res.status(201).json({ success: true, rows: "all tables created" });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ success: false, error: e.message });
  }
};

//drop table
module.exports.resetTable = async (req, res) => {
  const dropUsersTableSql = sql`DROP TABLE IF EXISTS Users;`;
  const dropPasswordsTableSql = sql`DROP TABLE IF EXISTS Passwords;`;
  const dropMatchesTableSql = sql`DROP TABLE IF EXISTS Matches;`;
  const dropMessagesTableSql = sql`DROP TABLE IF EXISTS Messages;`;
  const dropSkillsTableSql = sql`DROP TABLE IF EXISTS Skills;`;
  const dropProfessionTableSql = sql`DROP TABLE IF EXISTS Profession;`;
  const dropPushTokensTableSql = sql`DROP TABLE IF EXISTS Push_Tokens;`;

  try {
    const db = await dbPromise;
    await Promise.all([
      db.run(dropUsersTableSql),
      db.run(dropPasswordsTableSql),
      db.run(dropMatchesTableSql),
      db.run(dropMessagesTableSql),
      db.run(dropSkillsTableSql),
      db.run(dropProfessionTableSql),
      db.run(dropPushTokensTableSql),
    ]);

    await Promise.all([
      db.run(SQL.CREATE_USERS_TABLE),
      db.run(SQL.CREATE_PASSWORD_TABLE),
      db.run(SQL.CREATE_MATCHES_TABLE),
      db.run(SQL.CREATE_MESSAGES_TABLE),
      db.run(SQL.CREATE_SKILLS_TABLE),
      db.run(SQL.CREATE_PROFESSIONS_TABLE),
      db.run(SQL.CREATE_PUSH_TOKENS_TABLE),
    ]);

    res.status(205).json({ success: true, rows: "reset all tables" });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ success: false, error: e.message });
  }
};

//create new mentor
module.exports.linkedin = async (req, res) => {
  const requestBody = {
    grant_type: "authorization_code",
    code: req.body.code,
    redirect_uri: req.body.redirect_uri,
    client_id: process.env.LINKEDIN_CLIENT_ID,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET,
  };
  try {
    const response = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      qs.stringify(requestBody)
    );
    const {
      data: { access_token },
    } = response;
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };
    const linkedinFileds = [
      "id",
      "first-name",
      "last-name",
      "maiden-name",
      "formatted-name",
      "phonetic-first-name",
      "phonetic-last-name",
      "formatted-phonetic-name",
      "headline",
      "location",
      "industry",
      "current-share",
      "num-connections",
      "num-connections-capped",
      "summary",
      "specialties",
      "positions",
      "picture-urls::(original)",
      "site-standard-profile-request",
      "api-standard-profile-request",
      "public-profile-url",
      "email-address",
    ];
    const fieldsString = linkedinFileds.join(",");
    const linkedinApiUrl = `https://api.linkedin.com/v1/people/~:(${fieldsString})?format=json`;
    const { data } = await axios.get(linkedinApiUrl, config);
    const {
      emailAddress: email_address,
      firstName: first_name,
      industry: profession,
      lastName: last_name,
      pictureUrls,
      summary: biography,
    } = data;
    const profile_pic_URL = pictureUrls.values[0];
    const result = {
      email_address,
      first_name,
      profession,
      last_name,
      biography,
      profile_pic_URL,
    };
    res.status(200).json({ success: true, fields: result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//create new mentor
module.exports.postMentor = async (req, res) => {
  const fields = [
    "first_name",
    "last_name",
    "email_address",
    "biography",
    "zipcode",
    "date_of_birth",
    "profession",
    "skills",
    "hobbies",
  ];
  const user = {};

  fields.forEach(field => {
    if (req.body[field] === undefined) {
      res.status(422).json({ error: `Missing credential ${field}`, success: false });
      return
    }
    user[field] = req.body[field];
  });


  try {
    const db = await dbPromise;
    const getMentorsByEmailSql = sql`Select * from Users WHERE email_address = ${user.email_address}`;
    const emailRows = await db.all(getMentorsByEmailSql);
    //post mentor
    if (emailRows.length != 0) {
      res.status(409).json({ success: false, error: "Email is not unique" });
      return false;
    }

    user.profile_pic_URL = `http://${ip_address}:8000/user/${user.user_id}/profilepic`;
    const date = new Date();
    user.user_id = "1" + iid(date.getTime());
    const insertMentorsSql = sql`INSERT INTO Users VALUES (
        ${user.user_id},
         ${user.first_name} ,
         ${user.last_name},
         ${user.email_address},
         ${user.biography},
         ${user.zipcode},
         ${user.date_of_birth},
         ${user.profession},
         ${user.skills},
         ${user.profile_pic_URL},
         ${user.hobbies},
         1
      )`;
    await db.run(insertMentorsSql);


    let skills = user.skills.split(",");
    for (let i in skills) {
      const skill = skills[i]
      const getUsersBySkillSql = sql`SELECT users FROM Skills WHERE skills = ${skill}`;
      const usersWithSkillObject = await db.all(getUsersBySkillSql);
      if (usersWithSkillObject === undefined || usersWithSkillObject.length == 0) {
        const insertSkillSql = sql`INSERT INTO Skills VALUES (${skill}, ${user.user_id})`;
        await db.run(insertSkillSql);
      } else {
        let usersWithSkill = usersWithSkillObject[0]["users"];
        usersWithSkill = addToString(usersWithSkill, user.user_id);
        const updateSkillSql = sql`UPDATE Skills SET users = ${usersWithSkill} WHERE skills = ${skill}`;
        await db.run(updateSkillSql);
      }
    }
    const selectUsersByProfessionSql = sql`SELECT users FROM Profession WHERE profession =
          ${user.profession}`;
    const usersWithProfessionObject = await db.get(selectUsersByProfessionSql);

    if (usersWithProfessionObject === undefined) {
      const insertProfessionSql = sql`INSERT INTO Profession VALUES (${
        user.profession
        }, ${user.user_id})`;
      await db.run(insertProfessionSql);
    } else {
      let { users: usersWithProfession } = usersWithProfessionObject;
      usersWithProfession = addToString(usersWithProfession, user.user_id);
      const updateProfessionSql = sql`UPDATE Profession SET users = ${usersWithProfession} WHERE profession = ${user.profession}`;
      await db.run(updateProfessionSql);
    }

    res.status(200).json({ success: true, mentor: user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//create new mentee
module.exports.postMentee = async (req, res) => {
  const fields = [
    "first_name",
    "last_name",
    "email_address",
    "biography",
    "zipcode",
    "date_of_birth",
    "skills",
    "profession",
    "hobbies",
  ];
  const user = {};
  fields.some(field => {
    if (req.body[field] === undefined) {
      res.status(422).json({ error: `Missing credential ${field}`, success: false });
      return
    }
    user[field] = req.body[field];
  });

  try {
    const db = await dbPromise;
    const sql_email = sql`select * from Users where email_address = ${user.email_address}`;
    const usersWithEmailObject = await db.get(sql_email);

    if (usersWithEmailObject !== undefined) {
      res.status(409).json({ success: false, error: "Email is not unique" });
      return;
    }
    user.skills = user.skills || '';
    user.profession = user.profession || '';
    const date = new Date();
    user.user_id = "2" + iid(date.getTime());
    console.log(user.user_id)
    user.profile_pic_URL = `http://${ip_address}:8000/user/${user.user_id}/profilepic`;

    const insertMenteeSql = sql`INSERT INTO Users VALUES (
        ${user.user_id},
        ${user.first_name},
        ${user.last_name},
        ${user.email_address},
        ${user.biography},
        ${user.zipcode},
        ${user.date_of_birth},
        ${user.profession},
        ${user.skills},
        ${user.profile_pic_URL},
        ${user.hobbies},
        0
      ) `;
    await db.run(insertMenteeSql);

    let skills = user.skills.split(",");
    for (let i in skills) {
      const skill = skills[i]
      const getUsersBySkillSql = sql`SELECT users FROM Skills WHERE skills = ${skill}`;
      const usersWithSkillObject = await db.all(getUsersBySkillSql);
      if (usersWithSkillObject === undefined || usersWithSkillObject.length == 0) {
        const insertSkillSql = sql`INSERT INTO Skills VALUES (${skill}, ${user.user_id})`;
        await db.run(insertSkillSql);
      } else {
        let usersWithSkill = usersWithSkillObject[0]["users"];
        usersWithSkill = addToString(usersWithSkill, user.user_id);
        const updateSkillSql = sql`UPDATE Skills SET users = ${usersWithSkill} WHERE skills = ${skill}`;
        await db.run(updateSkillSql);
      }
    }
    const selectUsersByProfessionSql = sql`SELECT users FROM Profession WHERE profession =
          ${user.profession}`;
    const usersWithProfessionObject = await db.get(selectUsersByProfessionSql);

    if (usersWithProfessionObject === undefined) {
      const insertProfessionSql = sql`INSERT INTO Profession VALUES (${
        user.profession
        }, ${user.user_id})`;
      await db.run(insertProfessionSql);
    } else {
      let { users: usersWithProfession } = usersWithProfessionObject;
      usersWithProfession = addToString(usersWithProfession, user.user_id);
      const updateProfessionSql = sql`UPDATE Profession SET users = ${usersWithProfession} WHERE profession = ${user.profession}`;
      await db.run(updateProfessionSql);
    }

    res.status(200).json({ success: true, mentee: user });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//create a new message
module.exports.postMessage = async (req, res) => {
  const fields = ["match_id", "to_id", "from_id", "message_body"];
  const user = {};
  fields.some(field => {
    if (req.body[field] === undefined) {
      res.status(422).json({ error: "Missing credentials", success: false });
      return true;
    }
    user[field] = req.body[field];
    return false;
  });



  try {
    const db = await dbPromise;
    const date = new Date();
    const time = date.getTime();
    const insertMessageSql = sql`INSERT INTO Messages VALUES (
      ${iid(time)},
      ${user.match_id},
      ${user.to_id},
      ${user.from_id},
      ${user.message_body},
      ${time}
    )`;
    await db.run(insertMessageSql);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.registerPushToken = async (req, res) => {
  const { token: pushToken } = req.body;
  const { id: user_id } = req.params;
  if (pushToken === undefined) {
    res.status(422).json({ error: "Missing credentials", success: false });
    return;
  }

  try {
    const db = await dbPromise;
    const insertPushToken = sql`INSERT INTO Push_Tokens VALUES (
      ${user_id},
      ${pushToken}
    )`;
    await db.run(insertPushToken);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

const sockets = {};

//create a new message
module.exports.conversation = (ws, req) => {
  const { from_id } = req.query;
  sockets[from_id] = ws;
  ws.on('message', stringifiedMessage => {
    console.log(`received ws message: ${stringifiedMessage}`);


    const message = JSON.parse(stringifiedMessage);
    const { to_id } = message;

    if (Object.keys(sockets).includes(to_id)) {
      const toWs = sockets[to_id];
      toWs.send(stringifiedMessage);
    }

    const req = {
      body: {
        match_id: message.match_id,
        to_id: message.to_id,
        from_id: message.from_id,
        message_body: message.message_body,
      },
    };

    const res = {
      status: function () { return this; },
      json: function () { return this; },
    };

    module.exports.postMessage(req, res);
    sendPushNotification(to_id, message);
  });

  ws.on('close', () => {
    delete sockets[from_id];
    console.log('closed!');
  })
}

//create new password (SQL INJ.)
module.exports.postPassword = async (req, res) => {
  const fields = ["email_address", "password"];
  const user = {};
  fields.some(field => {
    if (req.body[field] === undefined) {
      res
        .status(422)
        .json({ error: `Missing credential ${field}`, success: false });
      return;
    }
    user[field] = req.body[field];
  });

  try {
    const db = await dbPromise;
    const getUsersByEmailSql = sql`Select * from Users where email_address = ${user.email_address}`;
    const mentorsWithEmailObject = await db.get(getUsersByEmailSql);
    if (mentorsWithEmailObject !== undefined) {
      res.status(409).json({ success: false, error: "Email already exists" });
      return;
    }

    const salt = hp.genRandomString(16);
    const passwordData = hp.saltPassword(user.password, salt);

    const insertPasswordSql = sql`INSERT INTO Passwords VALUES (
      ${user.email_address},
      ${passwordData.passwordHash},
      ${passwordData.salt}
    ) `;

    await db.run(insertPasswordSql);
    res.status(200).json({ success: true, passwordHash: passwordData.passwordHash });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//get all mentors
module.exports.getAllMentors = async (req, res) => {
  try {
    const db = await dbPromise;
    if (req.query.user_ids !== undefined) {
      // Get Specific User Ids
      const user_ids = JSON.parse(req.query.user_ids);
      const getMentorsByUserIdSql = sql`SELECT * FROM Users WHERE is_mentor=1 AND user_id IN (${user_ids.join(',')})`;
      const mentorRows = await db.all(getMentorsByUserIdSql);
      res.status(200).json({ success: true, rows: mentorRows });
    } else {
      const getAllMentorsSql = `SELECT * FROM Users WHERE is_mentor=1;`;
      const mentorRows = await db.all(getAllMentorsSql);
      res.status(200).json({ success: true, rows: mentorRows });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//get all mentees
module.exports.getAllMentees = async (req, res) => {
  try {
    const db = await dbPromise;
    if (req.query.user_ids !== undefined) {
      // Get Specific User Ids
      const user_ids = JSON.parse(req.query.user_ids);
      const getMenteesByUserIdSql = sql`SELECT * FROM Users WHERE is_mentor=0 AND user_id IN (${user_ids.join(',')})`;
      const mentorRows = await db.all(getMenteesByUserIdSql);
      res.status(200).json({ success: true, rows: mentorRows });
    } else {
      const getAllMenteesSql = `SELECT * FROM Users WHERE is_mentor=0;`;
      const mentorRows = await db.all(getAllMenteesSql);
      res.status(200).json({ success: true, rows: mentorRows });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//get all passwords
module.exports.getAllPasswords = async (req, res) => {
  try {
    const db = await dbPromise;
    const getAllPasswordsSql = sql`SELECT * FROM Passwords;`;
    const passwordRows = await db.all(getAllPasswordsSql);
    res.status(200).json({ success: true, rows: passwordRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//get all skills
module.exports.getAllSkills = async (req, res) => {
  try {
    const db = await dbPromise;
    const getAllSkillsSql = sql`SELECT * FROM Skills`;
    const skillRows = await db.all(getAllSkillsSql)
    res.status(200).json({ success: true, rows: skillRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//get all skills
module.exports.getAllProfessions = async (req, res) => {
  try {
    const db = await dbPromise;
    const getAllProfessionsSql = sql`SELECT * FROM Profession`;
    const professionRows = await db.all(getAllProfessionsSql);
    res.status(200).json({ success: true, rows: professionRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//get user by ID
module.exports.getUserById = async (req, res) => {
  try {
    const db = await dbPromise;
    const userID = req.params.id;
    const getAllUsersSql = sql`SELECT * FROM Users WHERE user_id = ${userID};`;
    const userRows = await db.all(getAllUsersSql);
    res.status(200).json({ success: true, rows: userRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.getEmailById = async (req, res) => {
  try {
    const db = await dbPromise;
    const userID = req.params.id;
    const getAllUsersEmailSql = sql`SELECT email_address FROM Users WHERE user_id = ${userID};`;
    const emailRows = await db.all(getAllUsersEmailSql)
    res.status(200).json({ success: true, rows: emailRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.updateEmailById = async (req, res) => {
  const userID = req.params.id;
  const newEmail = req.body.email_address;
  if (newEmail === undefined) {
    res.status(422).json({ error: "Missing credentials", success: false });
    return;
  }
  try {
    const db = await dbPromise;
    const updateEmailSql = sql`UPDATE Users SET email_address = ${newEmail} WHERE user_id = ${userID}`;
    await db.run(updateEmailSql)
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.getHobbiesById = async (req, res) => {
  try {
    const db = await dbPromise;
    const userID = req.params.id;
    const getHobbiesSql = sql`SELECT hobbies FROM Users WHERE user_id = ${userID};`; //starts with 1
    const hobbyRows = await db.all(getHobbiesSql)
    res.status(200).json({ success: true, rows: hobbyRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.updateFirstNameById = async (req, res) => {
  const userID = req.params.id;
  const newFirstName = req.body.first_name;

  if (newFirstName === undefined) {
    res.status(422).json({ error: "Missing credentials", success: false });
    return;
  }

  try {
    const db = await dbPromise;
    const updatenewFirstNameSql = sql`UPDATE Users SET first_name = ${newFirstName} WHERE user_id = ${userID}`;
    const firstNameRows = await db.all(updatenewFirstNameSql);
    res.status(200).json({ success: true, rows: firstNameRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.updateLastNameById = async (req, res) => {
  const userID = req.params.id;
  const newLastName = req.body.last_name;

  if (newLastName === undefined) {
    res.status(422).json({ error: "Missing credentials", success: false });
    return;
  }

  try {
    const db = await dbPromise;
    const updatenewLastNameSql = sql`UPDATE Users SET last_name = ${newLastName} WHERE user_id = ${userID}`;
    const lastNameRows = await db.all(updatenewLastNameSql);
    res.status(200).json({ success: true, rows: lastNameRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.updateHobbiesById = async (req, res) => {
  const userID = req.params.id;
  const newHobbies = req.body.hobbies;

  if (newHobbies === undefined) {
    res.status(422).json({ error: "Missing credentials", success: false });
    return;
  }

  try {
    const db = await dbPromise;
    const updateHobbiesSql = sql`UPDATE Users SET hobbies = ${newHobbies} WHERE user_id = ${userID}`;
    const hobbieRows = await db.all(updateHobbiesSql);
    res.status(200).json({ success: true, rows: hobbieRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.getSkillbyId = async (req, res) => {
  const userID = req.params.id;
  try {
    const db = await dbPromise;
    const getSkillsSql = sql`SELECT skills FROM Users where user_id = ${userID};`;
    const skillRows = await db.all(getSkillsSql);
    res.status(200).json({ success: true, rows: skillRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.getUsersbySkill = async (req, res) => {
  const skill = req.params.skill;

  try {
    const db = await dbPromise;
    const getUsersBySkillSql = sql`SELECT users FROM Skills WHERE skills = ${skill}`;
    const userRows = await db.all(getUsersBySkillSql);
    res.status(200).json({ success: true, rows: userRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.getUsersbyProfession = async (req, res) => {
  const profession = req.params.profession;

  try {
    const db = await dbPromise;
    const getUserByProfessionSql = sql`SELECT users FROM Profession WHERE profession = ${profession}`;

    const professionRows = await db.all(getUserByProfessionSql);
    res.status(200).json({ success: true, rows: professionRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.getFirstLastById = async (req, res) => {
  const userId = req.params.id;
  try {
    const db = await dbPromise;
    const getFirstLastSql = sql`SELECT first_name,last_name FROM Users WHERE user_id = ${userId}`;
    const firstLastRows = await db.all(getFirstLastSql)
    res.status(200).json({ success: true, rows: firstLastRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//LARGE SKILLS METHODS
module.exports.addSkill = async (req, res) => {
  //get input
  const userID = req.params.id;
  if (req.body.skill === undefined && req.body.skills === undefined) {
    res.status(422).json({ error: "Missing credentials", success: false });
    return;
  }
  const skill = req.body.skill || req.body.skills;

  try {
    const db = await dbPromise;
    //add skill to user table
    const getSkillsSql = sql`SELECT skills FROM Users WHERE user_id = ${userID}`;
    const userSkillsObject = await db.get(getSkillsSql);
    if (userSkillsObject === undefined) {
      res.status(400).json({ error: "User not found!", success: false });
      return;
    }
    let skills = userSkillsObject.skills;
    skills = addToString(skills, skill);
    const updateSkillsSql = sql`UPDATE Users SET skills = ${skills} WHERE user_id = ${userID}`;
    await db.run(updateSkillsSql);


    //add user to skills table
    const getUsersBySkillSql = sql`SELECT users FROM Skills WHERE skills = ${skill}`;
    const usersSkillsObject = await db.get(getUsersBySkillSql);
    if (usersSkillsObject == undefined) {
      const insertSkillsSql = sql`INSERT INTO Skills VALUES (${skill},${userID})`;
      await db.run(insertSkillsSql);
      res.status(200).json({ success: true, rows: "insert users into new skill" });
    } else {
      let users = usersSkillsObject.users;
      users = addToString(users, userID);
      const updateSkillsSql = sql`UPDATE Skills SET users = ${users} WHERE skills = ${skill}`;
      await db.run(updateSkillsSql);
      res.status(200).json({ success: true, rows:"insert users into an existed skill" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.removeSkill = async (req, res) => {
  //get input
  const userID = req.params.id;
  if (req.body.skill === undefined && req.body.skills === undefined) {
    res.status(422).json({ error: "Missing credentials", success: false });
    return;
  }
  const skill = req.body.skill || req.body.skill;

  try {
    const db = await dbPromise;
    //remove skill from user table
    const getSkillSql = sql`SELECT skills FROM Users WHERE user_id = ${userID}`
    const skillsObject = await db.get(getSkillSql)
    if (skillsObject.length == 0) {
      res.status(400).json({ error: "User not found!", success: false });
      return
    }
    let skills = skillsObject["skills"]
    skills = removeFromString(skills, skill);

    const removeSkillSql = sql`UPDATE Users SET skills = ${skills} WHERE user_id = ${userID}`;
    await db.run(removeSkillSql);
    //remove user to skill table
    const getUsersSql = sql`SELECT users FROM Skills WHERE skills = ${skill}`
    const usersObject = await db.all(getUsersSql);
    console.log(usersObject)
    if (usersObject.length == 0) {
      res.status(400).json({ error: "Skill not found!", success: false });
      return
    }
    let users = usersObject[0]["users"]
    users = removeFromString(users, userID);
    if (users == "") {
      const deleteEmptySkillSql = sql`DELETE FROM Skills WHERE skills = ${skill}`;
      await db.run(deleteEmptySkillSql);
    } else {
      const removeUserSql = sql`UPDATE Skills SET users = ${users} WHERE skills = ${skill}`;
      await db.run(removeUserSql);
    }
    res.status(200).json({ success: true, rows: "successfully removed skill" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }

};


module.exports.getProfilePic = (req, res) => {
  const userID = req.params.id;
  const uploadsPath = path.join(__dirname, "../../uploads");
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
  }
  const filepath = path.join(uploadsPath, `${userID}.jpg`);
  res.sendFile(filepath);
};

module.exports.updateProfilePic = async (req, res) => {
  const userID = req.params.id;
  if (req.body["profile_pic_URL"] === undefined) {
    res.status(422).json({ error: "Missing credentials", success: false });
    return;
  }
  try {
    const db = await dbPromise;
    const profile_pic = req.body.profile_pic_URL;
    const updateProfilePicSql = `UPDATE Users SET profile_pic_URL = ${profile_pic} WHERE user_id = ${userID}`; //starts with 1
    const profilePicRows = await db.all(updateProfilePicSql);
    res.status(200).json({ success: true, rows: profilePicRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.postProfilePic = (req, res) => {
  res.status(200).json(req.file);
};

module.exports.getProfessionById = async (req, res) => {
  const userId = req.params.id;
  try {
    const db = await dbPromise;
    const getProfessionSql = sql`SELECT profession FROM Users WHERE user_id = ${userId}`;
    const professionRows = await db.all(getProfessionSql)
    res.status(200).json({ success: true, rows: professionRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.updateProfession = async (req, res) => {
  //get input
  const userID = req.params.id;
  if (req.body.profession === undefined && req.body.professions === undefined) {
    res.status(422).json({ error: "Missing credentials", success: false });
    return;
  }
  //THIS IS THE NEW PROFESSION VALUE USED
  const profession = req.body.profession || req.body.professions;
  try {
    const db = await dbPromise;


    const getProfessionSql = sql`SELECT profession FROM Users WHERE user_id = ${userID}`;
    const oldProfession = await db.get(getProfessionSql)

    const updateProfessionInUsersSql = sql`UPDATE Users SET profession = ${profession} WHERE user_id = ${userID}`;
    await db.run(updateProfessionInUsersSql);

    //remove from old profession
    if (oldProfession.length == 0) {
      res.status(400).json({ error: "User not found!", success: false });
      return
    }
    const findUsersFromProfessionSql = sql`SELECT users FROM Profession WHERE profession = ${oldProfession["profession"]}`;
    const usersToRemove = await db.all(findUsersFromProfessionSql);
    if (usersToRemove.length == 0) {
      res.status(204).json({ success: false, error: "Profession not found !" });
      return
    }
    let users = usersToRemove[0]["users"];
    users = removeFromString(users, userID);
    if (users == "") {
      const deleteEmptyProfessionSql = sql`DELETE FROM Profession WHERE profession = ${oldProfession["profession"]}`;
      await db.run(deleteEmptyProfessionSql);
    } else {
      const removeUserFromOldProfessionSql = sql`UPDATE Profession SET users = ${users} WHERE profession = ${oldProfession["profession"]}`;
      await db.run(removeUserFromOldProfessionSql);
    }

    //add to new profession
    const findUsersFromNewProfessionSql = sql`SELECT users FROM Profession WHERE profession = ${profession}`;
    const usersToAdd = await db.all(findUsersFromNewProfessionSql);

    if (usersToAdd.length == 0) {
      const addUserToProfessionSql = sql`INSERT INTO Profession VALUES (${profession},${userID});`;
      await db.run(addUserToProfessionSql);
      res.status(200).json({ success: true , rows: "insert user into a new skill"});
      return
    } else {
      users = usersToAdd[0]["users"];
      users = addToString(users, userID);
      const addUserToProfessionSql = sql`UPDATE Profession SET users = ${users} WHERE profession = ${profession}`;
      await db.run(addUserToProfessionSql);
      res.status(200).json({ success: true , rows: "insert user into an existed skill"});
      return
    }



  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}; //end of updatedProfession

module.exports.getBio = async (req, res) => {
  const userId = req.params.id;
  try {
    const db = await dbPromise;
    const getBioSql = sql`SELECT biography FROM Users WHERE user_id = ${userId}`;
    const biographyRows = await db.all(getBioSql)
    res.status(200).json({ success: true, rows: biographyRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.updateBio = async (req, res) => {
  const userID = req.params.id;
  if (req.body["biography"] === undefined) {
    res.status(422).json({ error: "Missing credentials", success: false });
    return;
  }
  try {
    const db = await dbPromise;
    const biography = req.body.biography;
    const updateBiographySql = sql`UPDATE Users SET biography = ${biography} WHERE user_id = ${userID}`; //starts with 1
    const biographyRows = await db.all(updateBiographySql);
    res.status(200).json({ success: true, rows: biographyRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.deleteBio = async (req, res) => {
  const userID = req.params.id;
  try {
    const db = await dbPromise;
    const updateBiographySql = sql`UPDATE Users SET biography = '' WHERE user_id = ${userID}`; //starts with 1
    const biographyRows = await db.all(updateBiographySql);
    res.status(200).json({ success: true, rows: biographyRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.updateZipcode = async (req, res) => {
  const userID = req.params.id;
  if (req.body["zipcode"] === undefined) {
    res.status(422).json({ error: "Missing credentials", success: false });
    return;
  }
  try {
    const db = await dbPromise;
    const zipcode = req.body.zipcode;
    const updateZipcodeSql = sql`UPDATE Users SET zipcode = ${zipcode} WHERE user_id = ${userID}`; //starts with 1
    const zipcodeRows = await db.all(updateZipcodeSql);
    res.status(200).json({ success: true, rows: zipcodeRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
//create new password (SQL INJ.)
module.exports.register = async (req, res) => {
  const fields = ['email_address', 'password'];
  const user = {};
  fields.some(field => {
    if (req.body[field] === undefined) {
      res
        .status(422)
        .json({ error: `Missing credential ${field}`, success: false });
      return;
    }
    user[field] = req.body[field];
  });

  try {
    const db = await dbPromise;
    const getEmailSql = sql`Select * from Passwords where email_address = ${user.email_address};`;
    const emailRows = await db.all(getEmailSql);
    if (emailRows.length != 0) {
      res.status(409).json({ success: false, error: "Email is not unique" });
      return;
    }
    // console.log(emailRows)
    const salt = hp.genRandomString(16)
    const passwordData = hp.saltPassword(user.password, salt)
    const postPasswordSql = sql`INSERT INTO Passwords VALUES (${user.email_address},${passwordData.passwordHash}, ${passwordData.salt})`;
    db.run(postPasswordSql);
    res.status(200).json({ success: true, passwordHash: passwordData.passwordHash })
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.login = async (req, res) => {
  const fields = ["email_address", "password"];
  const user = {};
  fields.some(field => {
    if (req.body[field] === undefined) {
      res.status(422).json({ error: "Missing credentials", success: false });
      return;
    }
    user[field] = req.body[field];
  });


  try {
    const db = await dbPromise;
    const getSaltSql = sql`SELECT salt FROM Passwords WHERE email_address= ${user.email_address};`;
    const saltObject = await db.get(getSaltSql);
    const salt = saltObject["salt"]
    const loginSql = sql`SELECT u.user_id FROM Users u INNER JOIN
    (SELECT email_address FROM Passwords
    WHERE email_address = ${user.email_address}
    AND password = ${hp.saltPassword(user.password, salt)["passwordHash"]}) p
    ON (u.email_address = p.email_address)
    ;`;
    const id = await db.all(loginSql);
    if (id.length == 1) {

      res.status(200).json({ success: true, rows: id });

    } else {
      res.status(401).json({ error: "Wrong email/password!", success: false });
    }
  } catch (error) {

    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.changePassword = async (req, res) => {
  const fields = ["email_address", "password", "new_password"];
  const user = {};
  fields.some(field => {
    if (req.body[field] === undefined) {
      res.status(422).json({ error: "Missing credentials", success: false });
      return;
    }
    user[field] = req.body[field];
  });

  try {
    const db = await dbPromise;
    const getSaltSql = sql`SELECT salt FROM Passwords WHERE email_address= ${user.email_address};`;
    const saltObject = await db.get(getSaltSql);
    const salt = saltObject["salt"]
    const loginSql = sql`SELECT u.user_id FROM Users u INNER JOIN
    (SELECT email_address FROM Passwords
    WHERE email_address = ${user.email_address}
    AND password = ${hp.saltPassword(user.password, salt)["passwordHash"]}) p
    ON (u.email_address = p.email_address)
    ;`;
    const loginObject = await db.all(loginSql);
    //console.log(loginObject)
    if (loginObject.length == 1) {
      const new_salt = hp.genRandomString(16)
      const passwordData = hp.saltPassword(user.new_password, new_salt)
      const postPasswordSql = sql`UPDATE Passwords
      SET Password = ${passwordData.passwordHash}, salt = ${new_salt}
      WHERE email_address = ${user.email_address}`;
      db.run(postPasswordSql);
      res.status(200).json({ success: true, rows: "Change password successfully!" });
    } else {
      res.status(401).json({ success: false, error: "wrong password" });
    }


  } catch (error) {

    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.sendEmail = async (req, res) => {
  const fields = ["email_address", "title", "message"];
  fields.some(field => {
    if (req.body[field] === undefined) {
      res.status(422).json({ error: "Missing credentials", success: false });
      return;
    }
  });
  try {
    const transporter = momo.email();

    var mailOptions = {
      from: 'Rise Carreer Academy',
      to: req.body.email_address,
      subject: req.body.title,
      html: req.body.message
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.status(200).json({ success: true, rows: "Sent email successfully!" });




  } catch (error) {

    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//MESSAGE API

module.exports.getMessages = async (req, res) => {
  try {
    const db = await dbPromise;
    const getAllMessagessSql = `SELECT * FROM Messages;`;
    const messageRows = await db.all(getAllMessagessSql);
    res.status(200).json({ success: true, rows: messageRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//get latest message by match id
module.exports.getLatestMessagesById = async (req, res) => {
  const date = new Date();
  req.body.limit = req.body.limit || 1
  req.body.timestamp = req.body.timestamp || date.getTime();
  //console.log(req.body.timestamp)
  try {
    const db = await dbPromise;
    const matchID = req.params.matchid;
    const getAllMessagesSql =
      sql`SELECT * FROM Messages WHERE match_id = ${matchID}
    AND timestamp <=  ${req.body.timestamp} ORDER BY timestamp LIMIT ${req.body.limit};`;
    const messagesRows = await db.all(getAllMessagesSql);
    res.status(200).json({ success: true, rows: messagesRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//get message chain  by match id
module.exports.getMessageChain = async (req, res) => {
  try {
    const db = await dbPromise;
    const matchID = req.params.matchid;
    const getAllMessagesSql =
      sql`SELECT * FROM Messages WHERE match_id = ${matchID};`;
    const messagesRows = await db.all(getAllMessagesSql);
    res.status(200).json({ success: true, rows: messagesRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//delete message chain  by match id
module.exports.deleteMessageChain = async (req, res) => {
  try {
    const db = await dbPromise;
    const matchID = req.params.matchid;
    const deleteAllMessagesSql =
      sql`DELETE FROM Messages WHERE match_id = ${matchID};`;
    await db.run(deleteAllMessagesSql);
    res.json({ success: true, rows: "deleted all messages!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};


function addToString(string, add) {
  const array = string.split(",");
  if (array.indexOf(add) == -1) {
    array.push(add);
  }
  return array.join(",");
}

function removeFromString(string, rem) {
  const array = string.split(",");
  string = "";
  for (let i = 0; i < array.length; i++) {
    if (array[i] == rem) {
      continue;
    }
    string += array[i] + ",";
  }
  if (string.charAt(string.length - 1) == ",") {
    string = string.substring(0, string.length - 1);
  }
  //console.log(string)
  return string;
}

// function getFormattedDate() {
//   const date = new Date();
//   var str =
//     date.getFullYear() +
//     "-" +
//     (date.getMonth() + 1) +
//     "-" +
//     date.getDate() +
//     " " +
//     date.getHours() +
//     ":" +
//     date.getMinutes() +
//     ":" +
//     date.getSeconds();

//   return str;
// }
function iid(num) {
  let res = ""
  const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B',
    'D', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  while (num > 0) {
    res += chars[num % 62]
    num = (num - num % 62) / 62
  }
  return res
}


