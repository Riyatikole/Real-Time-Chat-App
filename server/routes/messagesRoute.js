const {createMessage, getAllMessage } = require("../controllers/messagesController");


const router = require("express").Router();

router.post("/createmsg/", createMessage);
router.post("/getmsg/", getAllMessage);

module.exports = router;