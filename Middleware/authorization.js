const jwt = require("jsonwebtoken")

async function isloggedin(req,res,next){
    if(!req.cookies.token)return res.status(500).render("Login");

    const data = jwt.verify(req.cookies.token,"secret");

    req.user = data;
    next();
}

module.exports={isloggedin};