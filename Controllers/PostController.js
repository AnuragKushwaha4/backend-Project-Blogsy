const usermodel = require("../Models/usermodel")
const userpost = require("../Models/userpost")

async function EditPost(req,res){
    await userpost.findOneAndUpdate({_id:req.params.id},{content:req.body.content},{new:true});
    //await userpost.save();
    res.redirect("/profile");
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
    res.redirect("/profile")
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
        res.redirect("/first")
}

async function LikePost(req,res){
    let post = await userpost.findOne({_id:req.params.id});
    await post.populate("user");

    if(post.likes.indexOf(req.user.userid)===-1)post.likes.push(req.user.userid);
    else post.likes.splice(req.user.userid,1);
    await post.save();
    if(post.user.email===req.user.email)res.redirect("/profile");
    req.redirect(`/viewing/${post.user.email}`)
}

async function LikePost1(req,res){
    let post = await userpost.findOne({_id:req.params.id});
    await post.populate("user");

    if(post.likes.indexOf(req.user.userid)===-1)post.likees.push(req.likes.push(req.user.userid));
    else post.likes.splice(req.user.userid,1);
    await post.save();
    res.redirect("/first");
}