import express from "express";
import {deleteAppointement, getAllAppointement, postAppointement, updateAppointementStstus} from "../controllers/appointementController.js"
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.post("/post",isPatientAuthenticated, postAppointement);
router.get("/getall", isAdminAuthenticated, getAllAppointement);
router.put("/update/:id", isAdminAuthenticated, updateAppointementStstus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointement)
export default router;