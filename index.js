const express = require("express");
const usermodel=require("./Models/usermodel");
const cookieParser = require("cookie-parser");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const userpost = require("./Models/userpost");

const path=require("path");
const {isloggedin}=require("./Middleware/authorization")
const authRoute=require('./Routes/AuthRoute')
const postRoute = require("./Routes/PostRoute")

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")))


app.use("/auth",authRoute)
app.use("/posts",isloggedin,postRoute)


//const isloggedin=(req,res,next)=>{
//     if(!req.cookies.token){
//         res.status(500).render("Login");
//     }
//     else{
//         const data = jwt.verify(req.cookies.token,"secret");
//         req.user= data;
//         console.log(req.user);
//         next();
//     }
// }



app.get("/edit/:id",isloggedin,async(req,res)=>{
    let post=await userpost.findOne({_id:req.params.id});
    res.render("edit",{post:post});

})

app.get("/change",(req,res)=>{
    res.render("imageUpdate");
})



app.get("/login",(req,res)=>{
    res.render("Login");
})
app.get("/delete",isloggedin,async(req,res)=>{
    //const users=await usermodel.findOne({email:req.user.email});
    //users.followers.splice(0,users.followers.length);
    //await users.save();
    //res.send({users});
})

app.get('/',(req,res)=>{
    res.render("register");
})


// app.post("/edit/:id",isloggedin,async(req,res)=>{
//     await userpost.findOneAndUpdate({_id:req.params.id},{content:req.body.content},{new:true});
//     await user.save();
//     res.redirect("/profile");
// })

// app.post('/post',isloggedin,async (req,res)=>{
//     const user=await usermodel.findOne({email:req.user.email});
//     let {content}=req.body;

//     let newpost = await userpost.create({
//         user:user._id,
//         content:content
//     })

//     user.post.push(newpost._id);
//     await user.save();
//     res.redirect("/profile")

// })
// app.post('/post1',isloggedin,async (req,res)=>{
//     const user=await usermodel.findOne({email:req.user.email});
//     let {content}=req.body;

//     let newpost = await userpost.create({
//         user:user._id,
//         content:content
//     })

//     user.post.push(newpost._id);
//     await user.save();
//     res.redirect("/first")

// })


// app.get("/like1/:id",isloggedin,async(req,res)=>{
//     let post=await userpost.findOne({_id:req.params.id});
//     if(post.likes.indexOf(req.user.userid)===-1)post.likes.push(req.user.userid);
//     else post.likes.splice(post.likes.indexOf(req.user.userid),1);
//     await post.save();
//     res.redirect("/first");
// })
// app.get("/like/:id",isloggedin,async(req,res)=>{
//     let post=await userpost.findOne({_id:req.params.id});
//     await post.populate("user");
//     if(post.likes.indexOf(req.user.userid)===-1)post.likes.push(req.user.userid);
//     else post.likes.splice(post.likes.indexOf(req.user.userid),1);
//     await post.save();
//     console.log(post.user.email);
//     console.log(req.user.email);
//     if(post.user.email===req.user.email)res.redirect('/profile');
//     else res.redirect(`/viewing/${post.user.email}`);
// })




app.post("/upload",isloggedin,upload.single("image"),async (req,res)=>{
    let user= await usermodel.findOne({email:req.user.email});
    user.profileImage = req.file.filename;
    await user.save();
    res.redirect("profile")
    
})


app.get("/follow/:id",isloggedin,async(req,res)=>{
    let loggedinuser = await usermodel.findOne({_id:req.user.userid});
    let user = await usermodel.findOne({_id:req.params.id}).populate("post"); 
    if(loggedinuser.followings.indexOf(req.params.id)===-1){
        loggedinuser.followings.push(user._id);
        user.followers.push(loggedinuser._id);
        await loggedinuser.save();
        await user.save();
    }
    else{
        loggedinuser.followings.splice(loggedinuser.followings.indexOf(user._id),1);
        user.followers.splice(user.followers.indexOf(loggedinuser._id),1);
        await loggedinuser.save();
        await user.save();
    }
    console.log(`follow details: loggedin user: ${loggedinuser} , user: ${user}`);
    res.render("visitprofile",{user,loggedinuser});
    
})
app.get("/follow1/:id",isloggedin,async(req,res)=>{
    let loggedinuser = await usermodel.findOne({_id:req.user.userid});
    let user = await usermodel.findOne({_id:req.params.id}).populate("post"); 
    if(loggedinuser.followings.indexOf(req.params.id)===-1){
        loggedinuser.followings.push(user._id);
        user.followers.push(loggedinuser._id);
        await loggedinuser.save();
        await user.save();
    }
    else{
        loggedinuser.followings.splice(loggedinuser.followings.indexOf(user._id),1);
        user.followers.splice(user.followers.indexOf(loggedinuser._id),1);
        await loggedinuser.save();
        await user.save();
    }
    console.log(`follow details: loggedin user: ${loggedinuser} , user: ${user}`);
    res.redirect("/first");
    
})



app.get("/profile",isloggedin,async(req,res)=>{
    let user=await usermodel.findOne({email:req.user.email});

    //data association: fetching out data of post array's id from userpost
    await user.populate("post");
    res.render("profile",{user});
})

app.get("/viewing/:email",isloggedin,async(req,res)=>{
    let loggedinuser=await usermodel.findOne({email:req.user.email});
    let user= await usermodel.findOne({email:req.params.email});
    await user.populate("post");
    if(loggedinuser.email===user.email)res.render("profile",{user});
    else res.render("visitprofile",{user,loggedinuser});
})

app.get("/first",isloggedin,async(req,res)=>{
    let posts=await userpost.find().populate("user");
    let user= await usermodel.findOne({email:req.user.email});
    res.render("first",{posts,user})
})



// app.get("/logout",async (req,res)=>{
//     console.log("before",req.cookies.token);
//     res.cookie("token","");
//     console.log(req.cookies.token);
//     res.redirect("/login");
// })


// app.post("/login",async(req,res)=>{
//     let {email,password}=req.body;

//     let user= await usermodel.findOne({email:email});
//     if(!user)return res.status(500).send("User Not found");

//     bcrypt.compare(password,user.password, async(err,result)=>{
//         if(result){
//             let token=jwt.sign({email:email,userid:user._id},"secret");
//             res.cookie("token",token);
//             let posts=await userpost.find().populate("user");
//             console.log("user in login:",user);
//             res.render("first",{posts,user});
//         } 
//         else{
//             res.send("user not found");
//         }
//     })
// })



// app.post("/register", async(req,res)=>{
//    let {email,password,username,name,age}=req.body;

//    const user = await usermodel.findOne({email});

//    if(user) return res.status(500).send("User already Registered");

//    bcrypt.genSalt(10,(err,salt)=>{
//     bcrypt.hash(password,salt,async(err,hash)=>{
//         const userCreated=await usermodel.create({
//             age,username, name,email,password:hash
//         })

//         let token=jwt.sign({email:email,userid:userCreated._id},"secret");
//         res.cookie("token",token);
//         res.send("Registered");
//     })
//    })

// })

app.listen(3000);