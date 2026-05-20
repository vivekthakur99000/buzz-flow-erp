import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import Attendance from "../models/attendence.model.js"; // Adjust spelling if you changed it!
import { ApiError, ApiResponse } from "../utils/apiResponse.js";
import LeaveRequest from "../models/leaveRequest.model.js";

export const punchIn = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const companyId = req.user.company;

    // 1. Figure out what "Today" is by setting the time to Midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Check if the user ALREADY punched in today
    const existingRecord = await Attendance.findOne({
      user: userId,
      company: companyId,
      date: { $gte: today }, // Finds any record created from midnight onwards today
    });

    if (existingRecord) {
      return res.status(400).json({ success: false, message: "You have already punched in today!" });
    }

    // 3. Create the punch-in record
    const attendance = await Attendance.create({
      user: userId,
      company: companyId,
      date: new Date(),
      checkInTime: new Date(),
      status: "Present",
    });

    return new ApiResponse(201, "Punched in successfully", { attendance }).send(res);
  } catch (error) {
    console.error(error);
    return new ApiError(500, "Internal server error").send(res);
  }
};

export const punchOut = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const companyId = req.user.company;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Find today's punch-in record
    const attendance = await Attendance.findOne({
      user: userId,
      company: companyId,
      date: { $gte: today },
    });

    if (!attendance) {
      return res.status(404).json({ success: false, message: "No punch-in record found for today." });
    }

    if (attendance.checkOutTime) {
        return res.status(400).json({ success: false, message: "You have already punched out!" });
    }

    // 2. Update the checkout time
    attendance.checkOutTime = new Date();
    await attendance.save();

    return new ApiResponse(200, "Punched out successfully", { attendance }).send(res);
  } catch (error) {
    console.error(error);
    return new ApiError(500, "Internal server error").send(res);
  }
};

export const applyLeave = async ( req : AuthRequest, res : Response) =>{
    try {

        const {leaveType, startDate, endDate, reason} = req.body;
        const {_id, company} = req.user;

        const leaveRequest = await LeaveRequest.create({
            user : _id,
            leaveType,
            startDate,
            endDate,
            reason, 
            status : "Pending",
            company
        })

        return new ApiResponse(201, "Leave request created", {leaveRequest}).send(res);

    } catch (error) {
        return new ApiError(500, "Internal server error").send(res);
    }
}
export const updateLeaveStatus = async ( req : AuthRequest, res : Response) =>{
    try {

        const {leaveId} = req.params;
        const {status} = req.body;
        const managerId = req.user._id;
        const company = req.user.company;

        const leaveRequest = await LeaveRequest.findOne({_id : leaveId, company});

        if (!leaveRequest) {
            return new ApiError(404, "Leave request does not found").send(res);
        }

        if(leaveRequest.status !== 'Pending'){
            return new ApiError(400, "Leave request has already been processed").send(res);
        } 

        leaveRequest.status = status;
        leaveRequest.approvedBy = managerId;

        leaveRequest.save();
       
        return new ApiResponse(201, "Leave request successfully updated", {leaveRequest}).send(res);

    } catch (error) {
        return new ApiError(500, "Internal server error").send(res);
    }
}

export const getAllLeaveRequest = async(req : AuthRequest, res : Response) => {
    try{

        const leaveRequests = await LeaveRequest.find({company : req.user.company});

         return new ApiResponse(200, "Fetched all leave request", {leaveRequests}).send(res);

    }catch{
         return new ApiError(500, "Internal server error").send(res);
    }
}