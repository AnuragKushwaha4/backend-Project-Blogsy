const usermodel = require("../Models/usermodel")
const userpost = require("../Models/userpost")


async function Follow(req,res) {
    let loggedinuser = await usermodel.findOne({email:req.user.email})
    let user = await userpost.findOne({_id:req.params.id})

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
    res.render("visitprofile",{user,loggedinuser});
}


async function Follow1(req,res){
    let user = await usermodel.findOne({_id:req.params.id});
    let loggedinuser =await usermodel.findOne({email:req.user.email})

    if(user.followers.indexOf(loggedinuser._id)===-1){
        user.followers.push(loggedinuser._id);
        loggedinuser.following.push(user._id);
        await user.save();
        await loggedinuser.save();
    }
    else{
        user.followers.splice(user.followers.indexOf(loggedinuser._id),1);
        loggedinuser.following.splice(loggedinuser.followings.indexOf(user._id),1);
        await user.save();
        await loggedinuser.save();
    }
    res.redirect("/first");
}

async function Upload(req,res){
    let user = await usermodel.findOne({_id:req.user.userid});
    user.profileImage=req.file.filename;
    await user.save();
    res.redirect("/profile")
}