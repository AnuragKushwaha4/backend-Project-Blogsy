const usermodel = require("../Models/usermodel")
const userpost = require("../Models/userpost")

async function EditPost(req,res){
    await userpost.findOneAndUpdate({_id:req.params.id},{content:req.body.content},{new:true});
    //await userpost.save();
    res.redirect("/users/profile");
}

async function NewPost(req,res){
    const user = await usermodel.findOne({email:req.user.email});

    let {content}= req.body;

    let newpost = await userpost.create({
        content:content,
        user:user.id
    })

    user.post.push(newpost._id);

    await user.save();
    res.redirect("/users/profile")
}

async function NewPost1(req,res){
    const user=await usermodel.findOne({email:req.user.email});
        let {content}=req.body;
    
        let newpost = await userpost.create({
            user:user._id,
            content:content
        })
    
        user.post.push(newpost._id);
        await user.save();
        res.redirect("/users/first")
}

async function LikePost(req,res){
    let post = await userpost.findOne({_id:req.params.id});
    await post.populate("user");

    if(post.likes.indexOf(req.user.userid)===-1)post.likes.push(req.user.userid);
    else post.likes.splice(post.likes.indexOf(req.user.userid),1);
    await post.save();
    if(post.user.email===req.user.email)res.redirect("/users/profile");
    res.redirect(`/users/viewing/${post.user.email}`)
}

async function LikePost1(req,res){
    let post = await userpost.findOne({_id:req.params.id});
    await post.populate("user");

    if(post.likes.indexOf(req.user.userid)===-1)post.likes.push(req.user.userid);
    else post.likes.splice(post.likes.indexOf(req.user.userid),1);
    await post.save();
    res.redirect("/users/first");
}


module.exports ={EditPost,NewPost,NewPost1,LikePost,LikePost1}