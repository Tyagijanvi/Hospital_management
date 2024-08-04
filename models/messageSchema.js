import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
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
    message: {
        type: String,
        required: true,
        minLength: [10, "message  must contain at least 10 charcters"],
      
        
    },
})
export const Message = mongoose.model("Message", messageSchema)