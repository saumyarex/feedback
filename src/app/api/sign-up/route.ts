import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";
import DbConnect from "@/lib/DbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User";

export async function POST(request: NextRequest){
    await DbConnect();

    try {
        const reqbody = await request.json();

        const {username, email, password} = reqbody;

        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()

        if(existingVerifiedUserByUsername){
            return NextResponse.json({success: false, message: "Username already exists"},{status: 400})
        }

        const existingUserByEmail = await UserModel.findOne({email})

        if(existingUserByEmail){

            if(existingUserByEmail.isVerified){
            return NextResponse.json({success:false, message: "User with this email already exists"},{
                status: 400
            })
        }else{
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.username = username;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingUserByEmail.save();
        }
        }else{
            const expirydate = new Date();
            expirydate.setHours(expirydate.getHours() + 1)

        
            const user = await UserModel.create({
                username,
                email,
                password: hashedPassword,
                isVerified: false,
                verifyCode,
                verifyCodeExpiry: expirydate,
                messages:[],
                isAcceptingMessages: true
            })

            if(!user){
                return NextResponse.json({success: false, message: "User registration failed. Please try again"}, {status: 500})
            }
        }



        //sending verification email
        const response = await sendVerificationEmail(email,username,verifyCode);

        if(!response.success){
            return NextResponse.json({success: false, message: response.message }, {status: 500})
        }

        return NextResponse.json({success: true, message:"User registration successfull. Please verify your account"},{status: 201})

    } catch (error) {
        console.error("signup error : ", error)
        return Response.json({success: false, message: "Error registering user"},{status: 500})
    }
}