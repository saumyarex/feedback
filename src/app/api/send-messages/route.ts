import DbConnect from "@/lib/DbConnect";
import UserModel from "@/models/User";
import { NextRequest,NextResponse } from "next/server";
import { messageSchema } from "@/schemas/messageSchema";
import { usernameValidation } from "@/schemas/signUpSchema";
import { Message } from "@/models/User";

export async function POST(request: NextRequest) {
    await DbConnect();

    try {
        const {username, message} = await request.json()

        //zod validation
        const validUsername = usernameValidation.safeParse(username);
        if(!validUsername.success){
            return NextResponse.json({success: false, message: validUsername.error}, {status: 400})
        }

        const validMessage = messageSchema.safeParse(message);
        if(!validMessage.success){
            return NextResponse.json({success: false, message: validMessage.error}, {status: 400})
        }

        const user = await UserModel.findOne({username});

        if(!user){
            return NextResponse.json({success: false, message: "User not found. Please check username"}, {status: 404})
        }

        if(!user.isAcceptingMessages){
            return NextResponse.json({success: false, message: "User is no longer accepting feedbacks"}, {status: 403})
        }

        const feedBackMessage = {
            content: message,
            createdAt: new Date()
        } 

        user.messages.push(feedBackMessage as Message );
        await user.save();

        return NextResponse.json({success: true, message: "Message sent successfully"}, {status: 201})


    } catch (error) {
         console.log("Error sending messages: ", error)
        if(error instanceof Error){
            return NextResponse.json({success: false, message: error.message}, {status: 500})
        }else {
            return NextResponse.json({success: false, message: "Internal server error"}, {status: 500})
        }
    }
}