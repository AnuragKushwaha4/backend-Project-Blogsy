const express = require("express");
const {isloggedin} = require("../Middleware/authorization")
const router = express.Router();
const {EditPostCard,ProfileImageChangeCard,LoginCard,RegistrationCard}= require("../Controllers/StaticController")

router.get("/",RegistrationCard);
router.get("/login",LoginCard);
router.get("/change",isloggedin,ProfileImageChangeCard);
router.get("/edit/:id",isloggedin,EditPostCard)

