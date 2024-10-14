const{model,Schema}=require("mongoose")
const mongoose = require('mongoose');


const userSchema=new mongoose.Schema({
    username:{type:String,required:true,minlenght:[3,"error name"]},
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true}
})
const userModel=new mongoose.model("user",userSchema)

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
})
const TaskModel =new mongoose.model("task", taskSchema);

module.exports={userModel,TaskModel}