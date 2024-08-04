import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {User} from "../models/userSchema.js";
import {generateToken} from "../utils/jwtToken.js"
import cloudinary from "cloudinary";
export const patientRegister = catchAsyncError(async(req, res, next) =>{
    const {
        firstName,
        lastname,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role,
    } = req.body;
    if(
        !firstName ||
        !lastname ||
        !email ||
       !phone ||
        !password ||
        !gender ||
        !dob ||
        !nic ||
        !role
    ) {
        return next(new ErrorHandler("Please fill full form!"));
    };
  let user = await User.findOne({email});
    if(user){
        return next(new ErrorHandler("User already registered!", 400))
    }
    user = await User.create({
        firstName,
        lastname,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role,
    });
    generateToken(user, "User registered", 200, res)
  
    
    });

    export  const login = catchAsyncError(async(req, res, next)=>{
        const {email, password, confirmPassword, role} = req.body;
        if(!email || !password || !confirmPassword || !role){
            return next (new ErrorHandler("Please provide all details!", 400));
        }
        if(password !== confirmPassword){
            return next (new ErrorHandler("Password  and confirmPassword don't match!!", 400));
        }
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return next (new ErrorHandler("Invalid Password and Email!", 400));  
        }
      const isPasswordMatched = await user.comparePassword(password);
      if(!isPasswordMatched){
        return next (new ErrorHandler("Invalid Password and Email!", 400));  
      }
      if(role !== user.role){
    return next(new ErrorHandler("User with this role is not found!", 400));
    
      }
     
      
      generateToken(user, "User logged In Successfully!", 200, res)
      })

      export const addNewAdmin = catchAsyncError(async(req, res, next)=>{
        const {
            firstName,
            lastname,
            email,
            phone,
            password,
            gender,
            dob,
            nic,
            
        } = req.body;
        if(
            !firstName ||
            !lastname ||
            !email ||
           !phone ||
            !password ||
            !gender ||
            !dob ||
            !nic 
        ) {
            return next(new ErrorHandler("Please fill full form!"));
        }
      const isRegistered = await User.findOne({email});
      if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with this email is already exists!`));
      }
     const admin = await User.create({
        firstName,
        lastname,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role: "Admin",
     });
     res.status(200).json({
        success: true,
        message: "New Admin Regustered!"
     });
      });
      export const getAllDoctors = catchAsyncError(async(req, res, next)=>{
        const doctors = await User.find({role: "Doctor"});
        res.status(200).json({
            success: true,
            doctors,
        });
      });
    
      export const getUserDetails = catchAsyncError(async(req, res, next)=>{
        const user = req.user;
        res.status(200).json({
            success: true,
            user,
        });
      });
      
      export const logoutAdmin = catchAsyncError(async(req, res, next)=>{
        res.status(200).cookie("adminToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
             secure: true,
    sameSite: "None",
        })
        .json({
            success:true,
            message: "Admin Logout Successfully!"
        })
      });

      export const logoutPatient = catchAsyncError(async(req, res, next)=>{
        res.status(200).cookie("patientToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
             secure: true,
    sameSite: "None",
        })
        .json({
            success:true,
            message: " Patient Logout Successfully!"
        })
      });

      export const  addNewDoctor = catchAsyncError(async(req, res, next)=>{
        if(!req.files || Object.keys(req.files).length === 0){
            return next(new ErrorHandler("Doctor Avatar Required!", 400));
        }
    
        const {docAvatar} = req.files;
        const allowedFormates = ["image/png", "image/jpeg", "image/jpg"];
        if(!allowedFormates.includes(docAvatar.mimetype)){
            return next(new ErrorHandler("File Formate Not Supported!", 400));
        }
        const {
            firstName,
            lastname,
            email,
            phone,
            password,
            gender,
            dob,
            nic,
            doctorDepartement
        } = req.body;
        if(  
            !firstName ||
            !lastname ||
            !email ||
            !phone ||
            !password ||
            !gender ||
            !dob ||
            !nic ||
            !doctorDepartement
        ){
            return next(new ErrorHandler("Please Provide full Details!", 400));
        }
        const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next (
            new ErrorHandler(`${isRegistered.role} already registered with this email`, 400)
        );
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
        docAvatar.tempFilePath
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error || "Unknown cloudinary error"
        );
    }
    const doctor = await User.create({
        firstName,
        lastname,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartement,
        role: "Doctor",
        docAvatar:{
            public_id: cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success: true,
        message: "New Doctor Registered!",
        doctor
    });
     });