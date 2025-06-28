import DbConnect from "@/lib/DbConnect";
import UserModel from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { User } from "next-auth";


export async function GET() {
    await DbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!user){
            return NextResponse.json({success: false, message:"Unathorized request. Please login first"}, {status: 401})
        }

    try {

        const receivedMessages = await UserModel.aggregate([
            {$match: {_id : new mongoose.Types.ObjectId(user._id)}},
            {$unwind: "$messages" },
            {$sort: { "messages.createdAt" : -1 }},
            {$group: {
                _id: "$_id",
                messages: {$push: "$messages"}

            } }
        ])

        console.log("received messages",receivedMessages)
        
        if(receivedMessages.length === 0){
            return NextResponse.json({success: true, message: "No messages yet", messages: []}, {status: 200})
        }

        return NextResponse.json({success: true, message: "Messages fetched successfully", messages: receivedMessages[0].messages}, {status: 200})

        
    } catch (error) {
        console.log("Error fetching messages: ", error)
        if(error instanceof Error){
            return NextResponse.json({success: false, message: error.message}, {status: 500})
        }else {
            return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
        }
    }
}