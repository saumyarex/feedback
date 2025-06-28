import DbConnect from "@/lib/DbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await DbConnect();

    const session = await getServerSession(authOptions);

        const user: User = session?.user as User;

        if(!user){
            return NextResponse.json({success: false, message:"Unathorized request. Please login first"}, {status: 401})
        }

    try {

        const {acceptMessages} = await request.json();
        

        const userFound = await UserModel.findById(user._id);

        if(!userFound){
            return NextResponse.json({success: false, message:"User not found"}, {status: 404})
        }

        userFound.isAcceptingMessages = acceptMessages;
        await userFound.save();

        return NextResponse.json({success: true, message:"User message accepting prefrence updated"}, {status: 200})
        
    } catch (error:unknown) {
        console.log("Error updating reqest message option: ", error)
        
        if(error instanceof Error){
            return NextResponse.json({success: false, message: error.message}, {status: 500})
        }else {
            return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
        }
    }
}

export async function GET() {
    await DbConnect();

    const session = await getServerSession(authOptions);

        const user: User = session?.user as User;

        if(!user){
            return NextResponse.json({success: false, error:"Unathorized request. Please login first"}, {status: 401})
        }

        try {

            const userFound = await UserModel.findById(user._id);

            if(!userFound){
                return NextResponse.json({success: false, error:"User not found"}, {status: 404})
            }

            return NextResponse.json({success: true, isAcceptingMessages: userFound.isAcceptingMessages}, {status: 200})
            
        } catch (error: unknown) {
            console.log("Error retrieving message acceptance status : ", error)
        if(error instanceof Error){
            return NextResponse.json({success: false, error: error.message}, {status: 500})
        }else {
            return NextResponse.json({success: false, error: "Internal server error"}, {status: 500})
        }
    
    }
}