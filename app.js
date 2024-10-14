const express = require('express');
const mongoose = require('mongoose');
const {join}=require('path')
const cookie=require('cookie-parser')
require('dotenv').config()
const { postRegister, getLogin, getIndex, getRegister, getAddTask, postAddTask, postTaskComplited, postLogout, postLogin } = require('./controllers/auth');
const app = express();



app.use(express.urlencoded({extended:true}))
app.use(express.static(join(__dirname,'styles')))
app.use (cookie())




app.get("/register",getRegister)

app.post("/registerUser",postRegister)

app.get("/login",getLogin)

app.post("/login",postLogin)
 

app.get("/",getIndex);


app.get("/addtask", getAddTask);


app.post("/addtask",postAddTask);

app.post("/tasks/:id/complete",postTaskComplited);

app.post("/logout",postLogout);



const PORT = process.env.PORT || 8000
app.listen(PORT, async ()=>{
    mongoose.connect(process.env.DB_URI,{dbName:"todos"})
    .then(()=>console.log("connect to db"))
    .catch((e)=>process.exit(1))
    console.log('App running in port: '+PORT)
}) 