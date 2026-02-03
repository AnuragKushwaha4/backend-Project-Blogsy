const express = require("express");
const {isloggedin} = require("../Middleware/authorization");
const router = express.Router();

const {EditPost,NewPost,NewPost1,LikePost,LikePost1}=require("../Controllers/PostController")

router.post("/edit/:id",EditPost)
router.post("/post",NewPost);
router.post("/post1",NewPost1);
router.get("/like/:id",LikePost);
router.get("/like1/:id",LikePost1);

module.exports = router;

