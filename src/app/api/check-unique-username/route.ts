import DbConnect from "@/lib/DbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { usernameValidation } from "@/schemas/signUpSchema";


export async function GET(request: NextRequest) {
    DbConnect();

    try {

        const {searchParams} = new URL(request.url)
        const usernameByUser = searchParams.get("username")

        const result = usernameValidation.safeParse(usernameByUser);
        //console.log(result)

        if(!result.success){
             return NextResponse.json({success : false, message: result.error.issues[0].message}, {status: 400})
        }

        const verifiedUsernameExist =  await UserModel.findOne({username: usernameByUser, isVerified: true})

        if(verifiedUsernameExist){
             return NextResponse.json({success : false, message: "Username already taken"}, {status: 400})
        }else{
            return NextResponse.json({success : true, message: "Username available"}, {status: 200})
        }

        
    } catch (error: unknown) {
        console.log(`Error checking username availablity : ${error}`)
        if(error instanceof Error){
            return NextResponse.json({success : false, message: error.message}, {status: 500})
        }else{
            return NextResponse.json({success : false, message: "Internal server error"}, {status: 500})
        }

    }
}