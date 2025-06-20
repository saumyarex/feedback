import DbConnect from "@/lib/DbConnect";
import UserModel from "@/models/User";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


export async function GET() {
    await DbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!user){
            return NextResponse.json({success: false, error:"Unathorized request. Please login first"}, {status: 401})
        }

    try {

        const receivedUser = await UserModel.aggregate([
            {$match: {_id : new mongoose.Types.ObjectId(user._id)}},
            {$unwind: "$messages" },
            {$sort: { "messages.createdAt" : -1 }},
            {$group: {
                _id: "$_id",
                messages: {$push: "$messages"}

            } }
        ])

        if(!receivedUser){
            return NextResponse.json({success: false, error:"User not found"}, {status: 404})
        }

        return NextResponse.json({success: false, message: "Messages fetched successfully", messages: receivedUser[0].messages}, {status: 200})
        
    } catch (error) {
        console.log("Error fetching messages: ", error)
        if(error instanceof Error){
            return NextResponse.json({success: false, error: error.message}, {status: 500})
        }else {
            return NextResponse.json({success: false, error: "Internal server error"}, {status: 500})
        }
    }
}