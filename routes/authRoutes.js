const express = require("express");
const router = express.Router();
const verify = require('../verifyToken')

const UserController = require('../controllers/userController')


router.post("/", UserController.register);

// router.post("/create", UserController.user_create);

router.post("/login", UserController.user_login);

router.put("/:id",verify, UserController.update);

router.delete("/:id",verify, UserController.delete);


module.exports = router;