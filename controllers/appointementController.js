import app from "../app.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointement } from "../models/appointementSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointement = catchAsyncError(async(req, res, next)=>{
    const{ firstName,
         lastname,
          email, 
          phone,
           nic,
            dob,
             gender, 
              appointement_date, 
           departement,
           
           doctor_firstName,
           doctor_lastname,
            hasVisited,
             address,
           
            } = req.body;
    if(!firstName ||
        !lastname ||
         !email || 
         !phone || 
         !nic ||  
         !dob || 
         !gender ||  
         !appointement_date ||    
         !departement ||  
         !doctor_firstName || 
         !doctor_lastname || 
      
         
         !address){
            return next(new ErrorHandler("Please Fill Full Form!", 400))
         }

         const isConflict = await User.find({
            firstName: doctor_firstName,
            lastname: doctor_lastname,
            role: "Doctor",
            doctorDepartement: departement
         });
         if(isConflict.length === 0){
            return next(new ErrorHandler("Doctor not Found!", 404))
         }
         if(isConflict.length > 1){
            return next(new ErrorHandler("Doctor Conflicr! Please contact through Email or Phone!", 404))
         }
  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;
  const appointement = await Appointement.create({
    firstName,
         lastname,
          email, 
          phone,
           nic,
            dob,
             gender, 
              appointement_date, 
           departement,
           doctor:{
            firstName:  doctor_firstName,
            lastname: doctor_lastname
           },
      
            hasVisited,
             address,
             doctorId,
              patientId
  });
  res.status(200).json({
    success: true,
    message: "Appointement Send Successfully",
    appointement,
  });
});

export const getAllAppointement = catchAsyncError(async(req, res, next) =>{
   const appointement = await Appointement.find();
   res.status(200).json({
      success: true,
   appointement,
    });
  });

  export const updateAppointementStstus = catchAsyncError(async(req, res, next)=>{
   const {id} = req.params;
   let appointement = await Appointement.findById(id);
   if(!appointement){
      return next(new ErrorHandler("Appointement not Found!", 404))
   }
   appointement = await Appointement.findByIdAndUpdate(id, req.body,{
      new: true,
      runValidators: true,
      useFindAndModify: false,
   });
   res.status(200).json({
      success: true,
      message: "Appointement ststus updated",
   appointement,
    });
  });


  export const deleteAppointement = catchAsyncError(async(req, res, next)=>{
   const {id} = req.params;
   let appointement = await Appointement.findById(id);
   if(!appointement){
      return next(new ErrorHandler("Appointement not Found!", 404));
   }
   await appointement.deleteOne();
   res.status(200).json({
      success: true,
      message: "Appointement Deleted!",
   })
  })
