const dbPromise = require("../../db");
const sql = require('sql-template-strings');

/**
 * TODO:
 * MATCHING ALGORITHM FUNCTION
 */
module.exports = (mentee, usersWithSameProfession, usersWithSameSkills) => {
  const userScores = {};

  // Add 2 for users with same profession.
  usersWithSameProfession.forEach(user => {
    userScores[user] = 2;
  });

  // Add 1 for users with same skills.
  usersWithSameSkills.forEach(user => {
    userScores[user] =
      userScores[user] === undefined ? 1 : userScores[user] + 1;
  });

  const listOfUserScores = Object.entries(userScores).map(([user_id, score ]) => {
    return { user_id, score };
  })

  // Sore the users by score.
  const sortedUsers = listOfUserScores
    .sort((userA, userB) => {
      return userB.score - userA.score;
    });

  return sortedUsers;
};


// /**
//  * FOR DEVELOPMENT AND DEBUGGING.
//  * For a test mentee, you must edit the mentee object below.
//  * For menteors, you must create them via Postman.
//  *
//  * Run using the following command:
//  *  node routes/user/match-algorithm.js
//  *
//  */
// (async () => {

//   // CHANGE ME
//   const mentee = {
//     skills: '',
//     profession: 'Computer Software',
//   };



















//   // DO NOT TOUCH BELOW
//   const db = await dbPromise;
//   const { skills, profession } = mentee;

//   const selectUsersByProfessionSql = sql`SELECT users FROM Profession WHERE profession = ${profession}`;
//   const mentorsWithProfession = (await db.get(selectUsersByProfessionSql))
//     .users
//     .split(",")
//     .filter(user => user[0] === "1");

//   const selectUsersBySkillsSql = sql`SELECT users FROM Skills WHERE skills = ${skills}`;
//   const mentorsWithSkills = (await db.get(selectUsersBySkillsSql))
//     .users
//     .split(",")
//     .filter(user => user[0] === "1");

//   const mentorIds = module.exports(mentee, mentorsWithProfession, mentorsWithSkills).map(obj => obj[0]);

//   const mentors = await Promise.all(mentorIds.map(mentorId => {
//     return db.get(sql`SELECT * FROM Users WHERE user_id = ${mentorId}`);
//   }));

//   console.log(mentors);
// })();
