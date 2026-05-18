import mongoose, { Schema } from "mongoose";


// 1. Create an interface representing a document in MongoDB
export interface Icompany extends Document{
    name : string,
    email : string,
    phone : string,
    address : string, 
    createdAt : Date, 
    updatedAt : Date, 
}

// 2. Create the Schema using the interface
const companySchema = new Schema<Icompany>({
    name : { type : String, required : true},
    email : { type : String, required : true, unique : true},
    phone : { type : String, required : true, unique : true},
    address : { type : String, required : true},
}, {timestamps : true})

const Company = mongoose.model<Icompany>("Company", companySchema);

export default Company;