import mongoose, {Types, Schema} from "mongoose";

export interface IEmployeeProfile extends Document{
    user : Types.ObjectId,
    designation : string,
    department : string,
    baseSalary : number,
    leaveBalance : number,
    company : Types.ObjectId,
    createdAt : Date,
    updatedAt : Date,
}

const employeeProfileSchema = new Schema<IEmployeeProfile>({
    user : {type : Schema.Types.ObjectId, ref : "User", required : true},
    designation : {type : String, required : true},
    department : {type : String, required : true},
    baseSalary : {type : Number, required : true},
    leaveBalance : {type : Number, default : 12},
    company : {type : Schema.Types.ObjectId, ref : "Company", required : true},
}, {timestamps : true})

const EmployeeProfile = mongoose.model<IEmployeeProfile>("EmployeeProfile", employeeProfileSchema);

export default EmployeeProfile;



