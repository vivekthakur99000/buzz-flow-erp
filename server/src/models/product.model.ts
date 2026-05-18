import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IProduct extends Document {
    name: string;
    sku: string;
    price: number;
    stock: number;
    company: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        sku: { type: String, required: true, unique: true },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0, default: 0 },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
    },
    { timestamps: true },
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;