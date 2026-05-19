import mongoose, { Schema } from "mongoose";

// 1. Create an interface representing a Customer document in MongoDB
export interface ICustomer extends Document {
    name: string,
    email?: string,
    phone: string,
    address?: string,
    gstNumber?: string,
    supportNotes?: string,
    company: mongoose.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
}

// 2. Create the Schema using the interface
const customerSchema = new Schema<ICustomer>({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    address: { type: String },
    gstNumber: { type: String },
    supportNotes: { type: String },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
}, { timestamps: true })

const Customer = mongoose.model<ICustomer>("Customer", customerSchema);

export default Customer;
