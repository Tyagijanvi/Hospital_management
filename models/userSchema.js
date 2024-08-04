
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: [3, "First name must contain at least 3 characters"]
    },
    lastname: {
        type: String,
        required: true,
        minLength: [3, "Last name must contain at least 3 characters"]
    },
    email: {
        type: String,
        required: true,
       validate: [validator.isEmail, "Plese provide a valid email"]
        
    },
    phone: {
        type: String,
        required: true,
        minLength: [11, "phon nu. must contain exact 11 digits"],
        maxLength: [11, "phon nu. must contain exact 11 digits"]
    },
    nic: {
        type: String,
        required: true,
        minLength: [11, "NIC must contain exact 11 digits!"],
        maxLength: [11, "NIC must contain exact 11 digits!"],
    },
    dob: {
        type: Date,
        required : [true,"DOB is required!"],
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
    },
    password: {
        type: String,
        minLength: [8, "Password must contain at least 8 characters!"],
        required: true,
        select: false,

    },
    role: {
        type: String,
        required: true,
        enum:["Admin", "Patient", "Doctor"],
    },
    doctorDepartement:{
        type: String,
    },
    docAvatar:{
  public_id: String,
  url: String
    },
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};
 userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({ id: this._id} , process.env.JWT_SECRET_KEYS,{
        expiresIn:process.env.JWT_EXPIRES,
    });
 };

export const User = mongoose.model("User", userSchema)
