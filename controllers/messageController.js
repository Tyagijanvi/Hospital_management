import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

export const sendMessage = catchAsyncError(async(req, res, next) =>{
    const {firstName, lastname, email, phone, message} = req.body;

    if(!firstName || !lastname || !email || !phone || !message){
      // return res.status(400).json({
       //  success: false,
       // message: "Fill Fill Full Form"
      // })
        return next(new ErrorHandler("Please Fill Full Form!", 400))
    }
    await Message.create({firstName, lastname, email, phone, message});
    return res.status(200).json({
        success: true,
        message: "message send successfully"
    })
})

export const getAllMessages = catchAsyncError(async(req, res, next)=>{
    const messages = await Message.find();
    return res.status(200).json({
        success: false,
        messages
    })
})