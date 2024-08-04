
import mongoose from "mongoose";
import validator from "validator";
//import bcrypt from "bcrypt";
//import jwt from "jsonwebtoken"
const appointementSchema = new mongoose.Schema({
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
   
    appointement_date: {
        type: String,
        required: true,
    },
    departement: {
        type: String,
        required: true,

    },
    doctor:{
        firstName:{
            type: String,
            required: true,
        },
        lastname:{
            type: String,
            required: true,
        }
    },
    hasVisited:{
        type: Boolean,
        default: false

    },
    doctorId:{
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    patientId:{
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    Status:{
        type: String,
        enum:["Pending", "Accepted", "Rejected"],
        default: "Pending"
    }
   
    
});


export const Appointement = mongoose.model("Appointement", appointementSchema)
