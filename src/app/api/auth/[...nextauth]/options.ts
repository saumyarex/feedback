import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DbConnect from "@/lib/DbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions =  { 
    providers : [
    CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        type: "credentials",
        credentials: {
            identifier: { label: "Username or Email", type: "text", placeholder: "Username or Email" },
            password: { label: "Password", type: "password" }
        },
        authorize: async (credentials:any): Promise<any> => {
            await DbConnect();
            console.log(credentials)
            try {
                const user = await UserModel.findOne({
                    $or: [
                        {username: credentials.identifier},
                        {email: credentials.identifier}
                    ]
                })

                if(!user){
                    throw new Error("User doesn't exits")
                }

                if(!user.isVerified){
                    throw new Error("Please verify your account or Sing up again")
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                console.log("password validity:",isPasswordValid);
                if(!isPasswordValid){
                    throw new Error("Invalid password")
                }else{
                    return user
                }

            } catch (error:any) {
                throw new Error(error)
            }
        },
    })
    ],
    callbacks: {
        async session({ session, token, }) {
            if(token){
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
        return session
        },
        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            
        return token
        }
    },
    pages: {
        signIn : "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}