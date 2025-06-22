"use client";
import React from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { useParams } from "next/navigation";
import { handleFrontendErrors } from "@/helpers/handleFrontendErrors";
import axios from "axios";
import { useRouter } from "next/navigation";

function VerifyAccountPage() {
  const { username } = useParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  async function onSubmit(data: z.infer<typeof verifySchema>) {
    try {
      const response = await axios.post("/api/verify-account", {
        username,
        verifyCode: data.verifyCode,
      });
      console.log(response);
      toast.success(response.data.message);
      router.replace("/sign-in");
    } catch (error) {
      //console.error("veriy error: ", error);
      handleFrontendErrors(error, true);
    }
  }
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className=" border-4 border-black max-w-xl rounded-xl flex flex-col items-center p-5 sm:p-10 m-5">
        <div>
          <h1 className="text-4xl font-black text-center mb-5 ">
            Verify your account
          </h1>
          <p className="mb-10 font-medium text-center">
            Enter verification code received on email to proceed further
          </p>
        </div>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="verifyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        {...field}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="border-black" />
                          <InputOTPSlot index={1} className="border-black" />
                          <InputOTPSlot index={2} className="border-black" />
                          <InputOTPSlot index={3} className="border-black" />
                          <InputOTPSlot index={4} className="border-black" />
                          <InputOTPSlot index={5} className="border-black" />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="hover:cursor-pointer">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default VerifyAccountPage;
