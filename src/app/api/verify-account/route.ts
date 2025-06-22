import DbConnect from "@/lib/DbConnect";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";
import { verifySchema } from "@/schemas/verifySchema";
import { usernameValidation } from "@/schemas/signUpSchema";

export async function POST(request: NextRequest) {
    DbConnect();

    try {

        const {username, verifyCode} = await request.json()
        //console.log({username, verifyCode})
        //const decodedUsername = decodeURIComponent(username);
        const validateUsername = usernameValidation.safeParse(username);
        const validateVerifyCode = verifySchema.safeParse({
            verifyCode
        })

        if(!validateUsername.success){
            return NextResponse.json({success: false, message: validateUsername.error.issues[0].message},{status: 400})
        }

        if(!validateVerifyCode.success){
            return NextResponse.json({success: false, message: validateVerifyCode.error.issues[0].message},{status: 400})
        }

        const user = await UserModel.findOne({username});

        if(!user){
            return NextResponse.json({success: false, message: "User does not exists. Please check username"},{status: 400})
        }else if(user.isVerified){
            return NextResponse.json({success: false, message: "User already verified. You can sing in"},{status: 409})
        }
        else if(!(user.verifyCode === verifyCode)){
            return NextResponse.json({success: false, message: "Invalid verification code. Please enter correct code"},{status: 400})
        }else if(!(user.verifyCodeExpiry.getTime() > Date.now())){
            return NextResponse.json({success: false, message: "Verification code expired. Please sign up again"},{status: 400})
        }else{
            user.isVerified = true;
            user.verifyCode = "";
            await user.save();
        }

        return NextResponse.json({success: true, message: "Account verification successfull"},{status: 200})
              
        
    } catch (error: unknown) {
        console.log(`Error verifying account: ${error}`)
        if(error instanceof Error){
           return NextResponse.json({success: false, message: error.message},{status: 500})
        }else{
            return NextResponse.json({success: false, message: "Internal server error"},{status: 500})
        }
    }
}