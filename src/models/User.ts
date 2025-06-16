import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content : string,
    createdAt: Date
}

const MessageSchema : Schema<Message> = new Schema({
    content : {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
},{timestamps: true})



export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    messages: Message[],
    isAcceptingMessages: boolean
}

export const UserSchema : Schema<User> = new Schema({
    username: {
        type: String,
        required: [true,"Username is required"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please give a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: {
        type: [MessageSchema],
    },
    verifyCode: {
        type: String,
    },
    verifyCodeExpiry: {
        type: Date,
    }
})

const UserModel = mongoose.models.User as mongoose
.Model<User> || mongoose.model("User", UserSchema);

export default UserModel;