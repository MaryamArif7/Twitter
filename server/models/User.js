import { Timestamp } from "mongodb";
import mongoose from "mongoose";
/*Route handlers or controllers interact with the Model to perform business logic,
 such as querying or updating data in the database. */
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
/* User modal name and UserSchema is schema name */
const User=mongoose.model("User",UserSchema);
export default User;
