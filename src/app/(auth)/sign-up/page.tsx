"use client";
import React, { useState, useEffect } from "react";
import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { handleFrontendErrors } from "@/helpers/handleFrontendErrors";
import { useDebounceValue } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";

function SignUpPage() {
  const [username, setUsername] = useDebounceValue("", 500);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsSubmitting(true);
    try {
      await axios.post("api/sign-up", values);
      toast.success("Sign Up Success");
      router.replace(`api/verify-account/${username}`);
    } catch (error) {
      handleFrontendErrors(error, true);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    async function isUsernameUnique() {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-unique-username?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            console.log(error);
            setUsernameMessage(error.response?.data.message);
          }

          handleFrontendErrors(error);
        } finally {
          console.log("username text", usernameMessage);
          setIsCheckingUsername(false);
        }
      }
    }
    isUsernameUnique();
  }, [username]);

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <div className=" rounded-md border-black border-4 sm:p-20 p-5 m-5 max-w-xl ">
        <h1 className="text-4xl font-black text-center mb-5 ">
          JOIN FEEBACK FOR <br className="sm:block hidden" /> TRUE FEEDBACK
        </h1>
        <p className="mb-10 font-medium text-center">
          Sign up to start your anonymous adventure
        </p>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setUsername(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isCheckingUsername ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        checking username...
                      </>
                    ) : (
                      <p
                        className={` text-sm ${
                          usernameMessage === "Username available"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        required
                        type="email"
                        placeholder="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Please wait ...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </div>
        <div className="text-center font-medium">
          <p>Already a member? </p>
          <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
