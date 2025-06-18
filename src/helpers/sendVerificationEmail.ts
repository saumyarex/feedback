import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> {
    
    try {
        resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Feedback | Verification email',
        react: VerificationEmail({username, otp: verifyCode})
    });

    return {
        success: true,
        message: "Verification email sent successfully"
    }

    } catch (error) {
        console.log(`Verification sending mail error: ${error}`)
        return {
            success: false,
            message: "Failed to send verification email"
        }
    }
}