import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";
import DbConnect from "@/lib/DbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function PATCH(request:NextRequest) {
    DbConnect();

     const session = await getServerSession(authOptions);
    
            const user: User = session?.user as User;
    
            if(!user){
                return NextResponse.json({success: false, message:"Unathorized request. Please login first"}, {status: 401})
            }

    try {

        const {messageId} = await request.json();

        const userFound = await UserModel.findById(user._id);
        
        
        if(!userFound){
            return NextResponse.json({success: false, message:"User not found"}, {status: 404})
        }

        

        await UserModel.updateOne(
        { _id: user._id },
        { $pull: { messages: { _id: messageId } } }
        )

        return NextResponse.json({success: true, message: "Message deleted successfully"}, {status: 200})

        
    } catch (error) {
        console.log("Error fetching messages: ", error)
        if(error instanceof Error){
            return NextResponse.json({success: false, message: error.message}, {status: 500})
        }else {
            return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
        }
    }
}