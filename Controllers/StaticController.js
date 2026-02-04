const userpost = require("../Models/userpost")

function RegistrationCard(req,res){
    res.render("register");
}

function LoginCard(req,res){
    res.render("Login");
}

function ProfileImageChangeCard(req,res){
    res.render("imageUpdate")
}

async function EditPostCard(req,res){
    let post = await userpost.findOne({_id:req.params.id});
    res.render("edit",{post});
}

module.exports = {EditPostCard,ProfileImageChangeCard,LoginCard,RegistrationCard}