const usermodel = require("../Models/usermodel")
const userpost = require("../Models/userpost")

async function EditPost(req,res){
    await userpost.findOneandUpdate({_id:req.params.id},{content:req.body.content},{new:true});
    await userpost.save();
    res.ridirect("/profile");
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