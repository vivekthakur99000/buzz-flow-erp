import mongoose, {Schema, Types} from "mongoose";

export interface IAttendence extends Document{
    user : Types.ObjectId,
    date : Date,
    status : 'Present' | 'Absent' | 'halfDay' | 'Leave',
    checkInTime : Date,
    checkOutTime : Date,
    company : Types.ObjectId,
    createdAt : Date,
    updatedAt : Date
}

const attendenceSchema = new Schema<IAttendence>({
    user : {type : Schema.Types.ObjectId, ref : "User", required : true},
    date : {type : Date, required : true},
    status: { 
    type: String, 
    enum: ['Present', 'Absent', 'halfDay', 'Leave'], 
    required: true 
},
    checkInTime : {type : Date},
    checkOutTime : {type : Date},
    company : {type : Schema.Types.ObjectId, ref : "Company", required : true},
}, {timestamps : true})

const Attendence = mongoose.model("Attendence", attendenceSchema);

export default Attendence;