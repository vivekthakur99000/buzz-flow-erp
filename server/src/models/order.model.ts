import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IOrderItem {
    product: Types.ObjectId;
    quantity: number;
    priceAtPurchase: number;
}

export interface IOrder extends Document {
    customerName: string;
    customerEmail?: string;
    items: IOrderItem[];
    totalAmount: number;
    status: "Pending" | "Completed" | "Cancelled";
    company: Types.ObjectId;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: { type: Number, required: true },
        priceAtPurchase: { type: Number, required: true },
    },
    { _id: false },
);

const orderSchema = new Schema<IOrder>(
    {
        customerName: { type: String, required: true },
        customerEmail: { type: String },
        items: { type: [orderItemSchema], required: true, default: [] },
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["Pending", "Completed", "Cancelled"],
            default: "Completed",
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true },
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;