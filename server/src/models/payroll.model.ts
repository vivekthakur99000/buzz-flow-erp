import mongoose, {Schema, Types} from "mongoose";


export interface IPayroll extends Document{
    user : Types.ObjectId,
    month : number,
    year : number,
    baseSalary : number,
    daysWorked : number,
    deductions : number,
    netSalary : number,
    status : 'Draft' | 'Paid',
    company : Types.ObjectId,
    createdAt : Date,
    updatedAt : Date,
}

const payrollSchema = new Schema<IPayroll>({
    user : {type : Schema.Types.ObjectId, ref  : "User" , required : true},
    month : {type : Number, required : true},
    year : {type : Number, required : true},
    baseSalary : {type : Number, required : true},
    daysWorked : {type : Number, required : true},
    deductions : {type : Number, required : true, default : 0},
    netSalary : {type : Number, required : true},
    status : {type : String, enum : ['Draft', 'Paid'] , default : 'Draft'},
    company : {type : Schema.Types.ObjectId, ref  : "Company" , required : true},
}, {timestamps : true})

const Payroll = mongoose.model<IPayroll>("Payroll", payrollSchema);

export default Payroll;