import mongoose, {Schema, Types} from "mongoose";

export interface ISupplier{
    name : string,
    contactPerson : string,
    email : string,
    phone : string,
    company : Types.ObjectId,
    createdAt : Date,
    updatedAt : Date,
}

const supplierSchema = new Schema<ISupplier>({
    name : {type : String, required : true },
    contactPerson : {type : String, required : true },
    email : {type : String, required : true },
    phone : {type : String, required : true },
    company : {type : Schema.Types.ObjectId, ref : "Company", required : true}
    
}, {timestamps : true})

const Supplier = mongoose.model<ISupplier>("Supplier", supplierSchema);

export default Supplier;