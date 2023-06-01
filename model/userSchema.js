import mongoose from "mongoose";
const Schema = mongoose.Schema

const userSchema = new Schema({
    userName:String,
    email:String,
    password:String,

})


const userModel = mongoose.model('User',userSchema)
export default userModel