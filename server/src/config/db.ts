import mongoose from "mongoose";

const connectDB = async () => {

    try {

        mongoose.set('strictQuery', false);

        await mongoose.connect(process.env.MONGO_URI as string);

        console.log("Database connected successfully...");
        
        
    } catch (error) {
        console.log((error as Error).message);
        process.exit(1);
    }

}

export default connectDB;