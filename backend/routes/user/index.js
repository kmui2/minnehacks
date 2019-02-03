const express = require("express");
const controller = require("./user.controller.js");
const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
    destination: path.resolve('./uploads/'),
    filename: function(req, file, cb){
       cb(null, file.originalname);
    },
  });

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
});


const router = express.Router();
module.exports.router = router;

// CREATE and RESET tables
router.post('/tables',controller.createTables);

// Delete all 7 tables
router.delete('/tables', controller.resetTable);


//POST request API for /user
router.post('/mentor', controller.postMentor);
router.post('/linkedin', controller.linkedin);
router.post('/mentee', controller.postMentee);

//GET request API for /user
router.get('/mentors',controller.getAllMentors);
router.get('/mentees',controller.getAllMentees);
router.get('/passwords',controller.getAllPasswords);
router.get('/skills',controller.getAllSkills);
router.get('/professions',controller.getAllProfessions);

//GET by UserID
router.get("/:id", controller.getUserById);
router.get("/:id/email", controller.getEmailById);
router.get("/:id/hobbies", controller.getHobbiesById);
router.get("/:id/skills", controller.getSkillbyId);
router.get("/name/:id", controller.getFirstLastById);
router.get("/:id/profilepic", controller.getProfilePic);
router.get("/:id/profession", controller.getProfessionById);
router.get("/:id/bio", controller.getBio);

//GET by skill and profession
router.get("/skill/:skill", controller.getUsersbySkill);
router.get("/profession/:profession", controller.getUsersbyProfession);


//Update by UserID
router.put("/:id/firstname", controller.updateFirstNameById)
router.put("/:id/lastname", controller.updateLastNameById)
router.put("/:id/email", controller.updateEmailById);
router.put("/:id/hobbies", controller.updateHobbiesById);
router.put("/:id/addskill", controller.addSkill);
router.put("/:id/removeskill", controller.removeSkill);
router.put("/:id/profilepic", controller.updateProfilePic);
router.put("/:id/bio", controller.updateBio);
router.delete("/:id/bio", controller.deleteBio);
router.put("/:id/zipcode",controller.updateZipcode);
router.post("/:id/profilepic", upload.single('photo'), controller.postProfilePic);
router.put("/:id/profession", controller.updateProfession);

//Register and Login
router.post("/password",controller.register);
router.post("/login",controller.login);
router.put("/password",controller.changePassword);
router.post("/sendemail",controller.sendEmail);


// //MESSAGE API

//create a new message
router.post('/message', controller.postMessage);
//get all messages
router.get('/message/all', controller.getMessages);
//get latest message by message id
router.get('/message/:matchid', controller.getLatestMessagesById);
//get all message by message id
router.get('/message/all/:matchid', controller.getMessageChain);
//delete all message by message id
router.delete('/message/all/:matchid', controller.deleteMessageChain);
// create a conversation ws connection
router.ws('/conversation', controller.conversation);
// setup push notification
router.post('/:id/push-token', controller.registerPushToken);
