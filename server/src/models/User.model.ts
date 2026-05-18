import mongoose, {Schema} from "mongoose"
import bcrypt from "bcryptjs";

export interface IUser{
    name : string,
    email : string, 
    password : string, 
    role: "Admin" | "Manager" | "Employee"; // Use string literal types for safety
    company: mongoose.Types.ObjectId; 
    createdAt : Date, 
    updatedAt : Date
}

const userSchema = new Schema<IUser>({
    name : {type : String, required: true},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true },
    role : {
        type : String,
        enum : ["Admin", "Manager", "Employee"],
        default : "Employee",
        required : true
    },
    company : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Company",  
        required : true
    },


}, {timestamps : true})

userSchema.pre('save', async function(this: mongoose.HydratedDocument<IUser>
    
) {
    if (!this.isModified('password')) return;
    
    this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
