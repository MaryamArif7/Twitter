import { Timestamp } from "mongodb";
import mongoose from "mongoose";
const UserSchema =new mongoose.Schema(
{
    firstName:{
        type:String,
        required: true,
        min:2,
        max:50,
    },
    
    
    lastName:{
        type:String,
        required: true,
        min:2,
        max:50,
    },
    
    email:{
        type:String,
        requird: true,
        max:50,
        unique:true,
    },
    password:
    {
        type:String,
        require: true,
        min:2,
        max:50,
    },
    
    picturePath:{
        type:String,
        default:"",
  
    },
    
    friends:{
        type:[String],
        default:[]
    },
    location:String,
    ocupation:String,
    viewedProfile:  Number,
    impressions:Number,
},
{
Timestamps:true}
);
const User=mongoose.model("User",UserSchema);
export default User;
