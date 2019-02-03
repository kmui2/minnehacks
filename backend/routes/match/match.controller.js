const dbPromise = require("../../db");
const sql = require("sql-template-strings");
const matchAlgorithm = require("./match-algorithm");

//create new match
module.exports.postMatches = async (req, res) => {
  const fields = ["mentor_id", "mentee_id"];
  const match = {};
  fields.some(field => {
    if (req.body[field] === undefined) {
      res
        .status(422)
        .json({ error: `Missing credential ${field}`, success: false });
      return true;
    }
    match[field] = req.body[field];
    return false;
  });
  try {
    const db = await dbPromise;
    const match_id = match.mentor_id + match.mentee_id;
    const insertMatchesSql =
      sql`INSERT OR IGNORE INTO Matches VALUES (${match_id},
      ${match.mentor_id},${match.mentee_id},NULL);`;
    await db.run(insertMatchesSql);
    res.json({ success: true, rows: match_id });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//get all matches
module.exports.getAllMatches = async (req, res) => {
  try {
    const db = await dbPromise;
    const getAllMatchesSql = sql`SELECT * FROM Matches;`;
    const MatchesRows = await db.all(getAllMatchesSql);
    res.json({ success: true, rows: MatchesRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
//get match by match id
module.exports.getMatchById = async (req, res) => {
  try {
    const db = await dbPromise;
    const matchID = req.params.id;
    console.log(matchID);
    const getAllMatchesSql = sql`SELECT * FROM Matches WHERE match_id = ${matchID};`;
    const matchRows = await db.all(getAllMatchesSql);
    res.json({ success: true, rows: matchRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//get match by user id
module.exports.getMatchByUserId = async (req, res) => {
  try {
    const db = await dbPromise;
    const userID = req.params.id;
    const getAllMatchesSql = sql`SELECT * FROM Matches WHERE mentor_id = ${userID}
    UNION SELECT * FROM Matches WHERE mentee_id = ${userID};`;
    const matchRows = await db.all(getAllMatchesSql);
    res.json({ success: true, rows: matchRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//get match by user ids
module.exports.getMatchByUserIds = async (req, res) => {
  try {
    const db = await dbPromise;
    const { mentor_id, mentee_id } = req.query;
    const getAllMatchesSql = sql`SELECT * FROM Matches WHERE mentor_id = ${mentor_id} AND mentee_id = ${mentee_id}`;
    const matchRows = await db.all(getAllMatchesSql);
    res.json({ success: true, rows: matchRows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports.getRatingByMatchId = async (req, res) => {
  try {
    const db = await dbPromise;
    const matchID = req.params.matchid;
    const getRatingSql = sql`SELECT ratings FROM Matches WHERE match_id = ${matchID};`;
    const ratingObject = await db.all(getRatingSql)
    res.json({ success: true, rows: ratingObject });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//average rating
module.exports.getMentorAverageRating = async (req, res) => {
  try {
    const db = await dbPromise;
    const userID = req.params.id;
    const getRatingSql = sql`SELECT avg(ratings) FROM Matches WHERE mentor_id = ${userID};`;
    const ratingObject = await db.all(getRatingSql)
    res.json({ success: true, rows: ratingObject });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//update a rating
module.exports.updateRating = async (req, res) => {
  try {
    const db = await dbPromise;
    const matchID = req.params.matchid;
    const rating = req.params.rating
    const updateRatingSql = sql`UPDATE Matches SET ratings = ${rating} WHERE match_id = ${matchID};`;
    await db.run(updateRatingSql)
    res.json({ success: true, rows: "rating updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.getMatchingMentors = async (req, res) => {
  const mentee_id = req.query.mentee_id;

  try {
    const db = await dbPromise;
    const getMenteeSql = sql`SELECT * FROM Users WHERE user_id = ${mentee_id}`;
    const mentee = await db.get(getMenteeSql);
    const { skills, profession } = mentee;

    const selectUsersByProfessionSql = sql`SELECT users FROM Profession WHERE profession = ${profession}`;
    const mentorsWithProfessionObject = (await db.get(
      selectUsersByProfessionSql
    ));

    let mentorsWithProfession = [];
    if (mentorsWithProfessionObject !== undefined) {
      mentorsWithProfession = mentorsWithProfessionObject.users
        .split(",")
        .filter(user => user[0] === "1");
    }

    const mentorsWithSkillsObjects = await Promise.all(skills.split(',').map(skill => {
      const selectUsersBySkillsSql = sql`SELECT users FROM Skills WHERE skills = ${skill} COLLATE NOCASE`;
      return db.get(selectUsersBySkillsSql);
    }))

    let mentorsWithSkills = [];
    mentorsWithSkillsObjects.forEach(mentorsWithSkillsObject => {
      if (mentorsWithSkillsObject !== undefined) {
        mentorsWithSkills = mentorsWithSkills.concat(mentorsWithSkillsObject.users
          .split(",")
          .filter(user => user[0] === "1"));
      }
    })

    const mentorIdsWithScores = matchAlgorithm(
      mentee,
      mentorsWithProfession,
      mentorsWithSkills
    );

    let mentors = await Promise.all(
      mentorIdsWithScores.map(({ user_id }) => {
        return db.get(sql`SELECT * FROM Users WHERE user_id = ${user_id} COLLATE NOCASE`);
      })
    );

    mentors = mentors.map((mentor, i) => ({ ...mentor, score: mentorIdsWithScores[i].score }));

    res.json({ success: true, rows: mentors });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.getMatchingMentees = async (req, res) => {
  const mentor_id = req.query.mentor_id;

  try {
    const db = await dbPromise;
    const getMentorSql = sql`SELECT * FROM Users WHERE user_id = ${mentor_id}`;
    const mentor = await db.get(getMentorSql);
    const { skills, profession } = mentor;

    const selectUsersByProfessionSql = sql`SELECT users FROM Profession WHERE profession = ${profession} COLLATE NOCASE`;
    const menteesWithProfessionObject = (await db.get(
      selectUsersByProfessionSql
    ));
    let menteesWithProfession = [];
    if (menteesWithProfessionObject !== undefined) {
      menteesWithProfession = menteesWithProfessionObject.users
        .split(",")
        .filter(user => user[0] !== "1");
    }

    const menteesWithSkillsObjects = await Promise.all(skills.split(',').map(skill => {
      const selectUsersBySkillsSql = sql`SELECT users FROM Skills WHERE skills = ${skill} COLLATE NOCASE`;
      return db.get(selectUsersBySkillsSql);
    }))

    let menteesWithSkills = [];
    menteesWithSkillsObjects.forEach(menteesWithSkillsObject => {
      if (menteesWithSkillsObject !== undefined) {
        menteesWithSkills = menteesWithSkills.concat(menteesWithSkillsObject.users
          .split(",")
          .filter(user => user[0] !== "1"));
      }
    })

    const menteeIdsWithScores = matchAlgorithm(
      mentor,
      menteesWithProfession,
      menteesWithSkills
    );

    let mentees = await Promise.all(
      menteeIdsWithScores.map(({ user_id }) => {
        return db.get(sql`SELECT * FROM Users WHERE user_id = ${user_id}`);
      })
    );

    mentees = mentees.map((mentee, i) => ({ ...mentee, score: menteeIdsWithScores[i].score }));

    res.json({ success: true, rows: mentees });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
