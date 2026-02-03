const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usermodel = require("../Models/usermodel");
const userpost = require("../Models/userpost");


async function Register(req,res){
    let {name,username,email,password,age}=req.body;

    let user = await usermodel.findOne({email:email});
    if(user)return res.status(500).render(register);

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async (err,result)=>{
            let user = await usermodel.create({
                name,username,age,email,password:result
            })
        })
    })

    res.render("Login");
}

async function Login(req,res){
    let {email,password}=req.body;
    let user = await usermodel.findOne({email:email,});

    if(!user)return res.status(500).render("Login");

    bcrypt.compare(password,user.password,async (err,result)=>{
        if(!result)return res.status(500).render("Login");

        let token = jwt.sign({email:email,userid:user._id},"secret");

        res.cookie("token",token);
        let posts=await userpost.find().populate("user");       
         res.render("first",{posts,user});
    })

}

async function Logout(req,res){
    if(!req.cookies.token)return res.render("Login");
    res.cookie("token","");
    res.render("Login");
}
module.exports ={Register,Login,Logout};