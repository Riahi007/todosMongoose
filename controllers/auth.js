const {userModel,TaskModel}=require("../Modelles/user.js")
const jwt =require('jsonwebtoken')
const bcryt=require("bcryptjs");
const salt=bcryt.genSaltSync(10)



async function getRegister (req,res){
    const regist=await userModel.find()
    res.render("register.ejs",{regist})
}

async function postRegister(req,res){
    const {username,email,password}=req.body
    const existUser=await userModel.findOne({email:email})
    if(existUser){
        res.send("User already exist")
        return ;
    }
    const hasdpass=bcryt.hashSync(password,salt)
    const regist=await userModel.create({username,email,password:hasdpass})
    res.redirect("/login")
}


function getLogin(req,res){ 
    res.render("login.ejs")
}

async function postLogin(req,res){
    const existUser=await userModel.findOne({email:req.body.email})
    console.log(existUser)
    if(!existUser){
        res.send("User is Not found")
        return
    }
    const isok=bcryt.compareSync(req.body.password,existUser?.password)
    if(!isok){
        res.send("Invalid Password")
        return
    }
    jwt.sign({id:existUser._id},"password",{expiresIn:"1h"},function(err,token){
        if(err){
            res.send("errooor")
            return
        }
        else{
            res.cookie('token',token)
            res.redirect("/")
        }
    })
}

async function getIndex(req, res) {
    const cookie = req.cookies.token;
    if (!cookie) {
        return res.redirect("/register");
    }

    jwt.verify(cookie, "password", async function(err, token) {
        if (err) {
            res.clearCookie('token');
            return res.redirect('/register');
        }

        const user = await userModel.findById(token.id);
        const tasks = await TaskModel.find({ userId: token.id });

        res.render("index.ejs", { user, tasks });
    });
}


function getAddTask(req, res) {
    const cookie = req.cookies.token;
    if (!cookie) {
        return res.redirect("/register");
    }
    jwt.verify(cookie, "password", function(err,token) {
        if (err) {
            res.clearCookie('token');
            return res.redirect('/register');
        }
        res.render("addtodos.ejs"); 
    });
}

async function postAddTask(req, res) {
    const cookie = req.cookies.token;
    if (!cookie) {
        return res.redirect("/register");
    }

    jwt.verify(cookie, "password", async function(err, token) {
        if (err) {
            res.clearCookie('token');
            return res.redirect('/register');
        }
        const { title } = req.body; 
        const newTask = await TaskModel.create({userId:token.id, title, });
        res.redirect("/");
    });
}

async function postTaskComplited(req, res) {
    const taskId = req.params.id;
    await TaskModel.findByIdAndUpdate(taskId, { completed: true });
    res.redirect("/");
}

function postLogout(req, res) {
    res.clearCookie('token'); 
    res.redirect("/login"); 
}

module.exports={getRegister,postRegister,getLogin,postLogin,getIndex,getAddTask,postAddTask,postTaskComplited,postLogout}