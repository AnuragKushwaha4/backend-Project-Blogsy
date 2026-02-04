const upload = require("../Config/multer");
const usermodel = require("../Models/usermodel")
const userpost = require("../Models/userpost")


async function Follow(req,res) {
    let loggedinuser = await usermodel.findOne({email:req.user.email})
    let user = await usermodel.findOne({_id:req.params.id})

    if(user.followers.indexOf(loggedinuser._id)===-1){
        user.followers.push(loggedinuser._id);
        loggedinuser.followings.push(user._id);
        await user.save();
        await loggedinuser.save();
    }
    else{
        user.followers.splice(user.followers.indexOf(loggedinuser._id),1);
        loggedinuser.followings.splice(loggedinuser.followings.indexOf(user._id),1);
        await user.save();
        await loggedinuser.save();
    }
    await user.populate("post");
    res.render("visitprofile",{user,loggedinuser});
}


async function Follow1(req,res){
    let user = await usermodel.findOne({_id:req.params.id});
    let loggedinuser =await usermodel.findOne({email:req.user.email})

    if(user.followers.indexOf(loggedinuser._id)===-1){
        user.followers.push(loggedinuser._id);
        loggedinuser.followings.push(user._id);
        await user.save();
        await loggedinuser.save();
    }
    else{
        user.followers.splice(user.followers.indexOf(loggedinuser._id),1);
        loggedinuser.followings.splice(loggedinuser.followings.indexOf(user._id),1);
        await user.save();
        await loggedinuser.save();
    }
    res.redirect("/users/first");
}

async function Upload(req,res){
    let user = await usermodel.findOne({_id:req.user.userid});
    user.profileImage=req.file.filename;
    await user.save();
    res.redirect("/users/profile")
}


async function ViewProfile(req,res){
    let user = await usermodel.findOne({_id:req.user.userid});
    await user.populate("post");
    res.render("profile",{user});
}

async function ViewOthersProfile(req,res){
    let user = await usermodel.findOne({email:req.params.email});
    let loggedinuser = await usermodel.findOne({_id:req.user.userid});
    await user.populate("post");
    if(loggedinuser._id===user._id)res.render("profile",{user});
    res.render("visitprofile",{user,loggedinuser});
}


async function FirstInterfaceView(req,res){
    let user = await usermodel.findOne({_id:req.user.userid});
    let posts = await userpost.find().populate("user");
    res.render("first",{user,posts})
}



module.exports ={FirstInterfaceView,ViewOthersProfile,ViewProfile,Follow,Follow1,Upload}