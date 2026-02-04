const express = require("express");
const upload=require("../Config/multer");

const {FirstInterfaceView,ViewOthersProfile,ViewProfile,Follow,Follow1,Upload}= require("../Controllers/UserControlller");


const router = express.Router();

router.post("/upload",upload.single("image"),Upload);
router.get("/follow/:id",Follow);
router.get("/follow1/:id",Follow1);
router.get("profile",ViewProfile);
router.get("viewing/:email",ViewOthersProfile);
router.get("/first",FirstInterfaceView)

module.exports = router;