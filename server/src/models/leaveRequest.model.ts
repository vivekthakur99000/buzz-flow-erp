import mongoose, { Schema } from "mongoose";

export interface ILeaveRequest extends Document {
    user: mongoose.Types.ObjectId,
    leaveType: "Sick" | "Casual" | "Earned",
    startDate: Date,
    endDate: Date,
    reason: string,
    status: "Pending" | "Approved" | "Rejected",
    approvedBy?: mongoose.Types.ObjectId,
    company: mongoose.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
}

const leaveRequestSchema = new Schema<ILeaveRequest>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    leaveType: {
        type: String,
        enum: ["Sick", "Casual", "Earned"],
        required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
}, { timestamps: true });

const LeaveRequest = mongoose.model<ILeaveRequest>("LeaveRequest", leaveRequestSchema);

export default LeaveRequest;