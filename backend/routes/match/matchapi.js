const express = require("express");
const controller = require("./match.controller.js");

const router = express.Router();
module.exports.router = router;

//create a new match entry
router.post('/', controller.postMatches);

//get everything from match tables
router.get('/',controller.getAllMatches);

//get match by match id
router.get('/matchid/:id',controller.getMatchById);

//get match by user id
router.get('/userid/:id',controller.getMatchByUserId);

//get match by user ids
router.get('/userid',controller.getMatchByUserIds);

//get a rating by match id
router.get('/rating/:matchid',controller.getRatingByMatchId);
//get a rating by mentor id
router.get('/rating/userid/:id',controller.getMentorAverageRating);
//add a rating in a new match
router.put("/rating/:matchid/:rating",controller.updateRating);

router.get('/mentors', controller.getMatchingMentors);
router.get('/mentees', controller.getMatchingMentees);
