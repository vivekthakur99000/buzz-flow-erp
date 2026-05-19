import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IPurchaseOrderItem {
    product: Types.ObjectId;
    quantity: number;
    costPrice: number;
}

export interface IPurchaseOrder extends Document {
    supplier: Types.ObjectId;
    items: IPurchaseOrderItem[];
    totalCost: number;
    status: "Pending" | "Received" | "Cancelled";
    company: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const purchaseOrderItemSchema = new Schema<IPurchaseOrderItem>(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        costPrice: { type: Number, required: true, min: 0 },
    },
    { _id: false },
);

const purchaseOrderSchema = new Schema<IPurchaseOrder>(
    {
        supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
        items: { type: [purchaseOrderItemSchema], required: true, default: [] },
        totalCost: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: ["Pending", "Received", "Cancelled"],
            default: "Pending",
        },
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    },
    { timestamps: true },
);

const PurchaseOrder = mongoose.model<IPurchaseOrder>("PurchaseOrder", purchaseOrderSchema);

export default PurchaseOrder;

