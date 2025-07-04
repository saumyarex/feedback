"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { messageFormSchema } from "@/schemas/messageSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { handleFrontendErrors } from "@/helpers/handleFrontendErrors";
import axios from "axios";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useCompletion } from "@ai-sdk/react";
import { Separator } from "@/components/ui/separator";

function PublicProfilePage() {
  const { username } = useParams();

  // general state variables
  const [isSendingMessage, setIsSedingMessage] = useState(false);
  const [isSuggestMessageClicked, setIsSuggestMessageClicked] = useState(false);
  const [currentClickedMessage, setCurrentClickedMessage] = useState("");

  const form = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const { setValue } = form;

  // submitting message to user
  const onSubmit = async (data: z.infer<typeof messageFormSchema>) => {
    try {
      setIsSedingMessage(true);
      const response = await axios.post("/api/send-messages", {
        username,
        message: data.content,
      });
      toast.success(response.data.message);
    } catch (error) {
      handleFrontendErrors(error, true);
    } finally {
      setIsSedingMessage(false);
    }
  };

  const copySuggestedMessage = (id: string, message: string) => {
    setIsSuggestMessageClicked(true);
    setCurrentClickedMessage(id);
    setValue("content", message);
    setTimeout(() => {
      setIsSuggestMessageClicked(false);
    }, 200);
  };

  //getting suggest messages from ai
  const {
    completion,
    complete,
    error: apiError,
    isLoading,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion:
      "Love your work||When are you launching next product line||When are you coming to India",
  });

  const getSuggestedMessages = async () => {
    try {
      await complete("");
    } catch (error) {
      console.error(error);
      console.log("Error suggesting messages :", apiError);
    }
  };
  return (
    <div
      id="message-box"
      className="flex flex-col p-5 py-10 md:p-20 sm:mx-20 lg:mx-40 mx-5"
    >
      <div>
        {/* Main heading */}
        <h1 className="text-center font-extrabold text-4xl">
          Public Profile Link
        </h1>

        {/* Anonymous message box */}
        <div className="mt-10 flex flex-col gap-4">
          <h2 className="font-semibold sm:text-lg">
            Send Anonymous Message to @{username}
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 flex flex-col"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here"
                        className="border-gray-900 font-medium "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="self-center hover:cursor-pointer"
                type="submit"
              >
                {isSendingMessage ? (
                  <>
                    {" "}
                    <LoaderCircle className="animate-spin" /> Sending ...
                  </>
                ) : (
                  "Send message"
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* suggest messgaes */}
        <div className="mt-10 flex flex-col gap-5">
          <Button
            disabled={isLoading}
            className="self-start"
            onClick={getSuggestedMessages}
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin/>" />
            ) : (
              "Suggest Messages"
            )}
          </Button>
          <h2 className="font-medium text-lg">
            Click on any message to select it.
          </h2>

          {/* suggested messages options */}
          <div className="flex flex-col gap-5 px-5 py-6 border-2 border-gray-100 rounded-md">
            <h3 className="text-xl font-semibold">Messages</h3>
            {isLoading ? <LoaderCircle className="animate-spin" /> : null}
            {completion.split("||").map((message, index) => (
              <Link href={"#message-box"} key={index}>
                <div
                  className={` text-center border-2 border-gray-50 py-2 hover:bg-gray-100 hover:cursor-pointer font-medium rounded-md ${isSuggestMessageClicked && currentClickedMessage === index.toString() ? "bg-gray-100" : ""} `}
                  onClick={() =>
                    copySuggestedMessage(index.toString(), message)
                  }
                >
                  {message}
                </div>
              </Link>
            ))}
          </div>

          <Separator className="mt-10" />
          {/* create your own account */}
          <div className="flex flex-col items-center gap-3 mt-5">
            <h2 className="font-semibold text-base">Get Your Message Board</h2>
            <Link href={"/sign-up"}>
              <Button className="font-medium hover:cursor-pointer">
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicProfilePage;
