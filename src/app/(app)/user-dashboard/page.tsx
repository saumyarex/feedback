"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { acceptMessageSchmea } from "@/schemas/acceptMessageSchema";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { handleFrontendErrors } from "@/helpers/handleFrontendErrors";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { RefreshCcw, LoaderCircle, X } from "lucide-react";
import { Message } from "@/models/User";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dayjs from "dayjs";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function UserDashboard() {
  // extracting user's session info
  const { data: session } = useSession();
  const userUniqueURL = `${process.env.NEXT_PUBLIC_BASE_URL}/user/${session?.user.username}`;
  const uniqueURLRef = useRef<HTMLInputElement>(null);

  // all state variables
  const [copyMessage, setCopyMessage] = useState("Copy");
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // react-hook-from variables
  const form = useForm<z.infer<typeof acceptMessageSchmea>>({
    resolver: zodResolver(acceptMessageSchmea),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages") || false;

  // function to handle on/off message accept switch
  async function handleSwitchChange() {
    try {
      setIsSwitchLoading(true);
      axios.post("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success("Accepting messages updated");
    } catch (error) {
      handleFrontendErrors(error, true);
    } finally {
      setIsSwitchLoading(false);
    }
  }

  // funtion to handle copy to clipboard
  function copyToClipboard() {
    uniqueURLRef.current?.select();
    window.navigator.clipboard
      .writeText(userUniqueURL)
      .then(() => {
        setCopyMessage("Copied");
        toast("Link copied ");
        setTimeout(() => {
          setCopyMessage("Copy");
        }, 1500);
      })
      .catch((err) => {
        console.log("Falied to copy", err);
      });
  }

  //fucntion to check user accepting messages or not
  const getAcceptMessages = useCallback(async () => {
    try {
      setIsSwitchLoading(true);
      const response = await axios.get("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      handleFrontendErrors(error, true);
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  //fucntion to get messages from database
  const getMessages = useCallback(async () => {
    try {
      setIsMessagesLoading(true);
      const response = await axios.get("/api/get-messages");
      setMessages(response.data.messages);
    } catch (error) {
      console.log(error);
      handleFrontendErrors(error, true);
    } finally {
      setIsMessagesLoading(false);
    }
  }, []);

  //fucntion to run on each render
  useEffect(() => {
    getAcceptMessages();
    getMessages();
  }, [getAcceptMessages, getMessages]);

  // function to delte messages
  const deleteMessage = async (messageID: string) => {
    try {
      setMessages(messages.filter((message) => message._id !== messageID));
      const response = await axios.delete(`/api/delete-message/${messageID}`);
      console.log(response);
      toast.success(response.data.message);
    } catch (error) {
      handleFrontendErrors(error, true);
    }
  };

  return (
    <>
      {session && (
        <div className="flex flex-col p-5 py-10 md:p-20 sm:mx-20 lg:mx-30 mx-5">
          {/* Main container */}
          <div className="space-y-4">
            {/* Main heading: User Dashboard */}
            <h1 className="sm:text-4xl text-3xl font-extrabold">
              User Dashboard
            </h1>
            <h2 className="text-base sm:text-lg font-bold">
              Copy your unique link
            </h2>

            {/* Unique message link for user */}
            <div className="flex ">
              <input
                type="text"
                defaultValue={userUniqueURL}
                className="w-full bg-gray-50 px-2 py-2 rounded-l text-black text-sm sm:text-base font-medium"
                ref={uniqueURLRef}
              />
              <Button
                className="rounded-r rounded-l-none hover:cursor-pointer font-semibold py-5"
                onClick={() => copyToClipboard()}
              >
                {copyMessage}
              </Button>
            </div>

            {/* toggle message acceptance */}
            <div className="flex gap-4 mt-6 ">
              <Switch
                {...register("acceptMessages")}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                id="accept-message"
                className="w-12 h-7  self-center"
                disabled={isSwitchLoading}
              />
              <Label
                htmlFor="accept-message"
                className="text-base sm:text-lg font-medium"
              >
                Accep messages :{" "}
                {session?.user.isAcceptingMessages ? "On" : "Off"}
              </Label>
            </div>
            <Separator />

            {/* Refresh messages */}
            <div
              className="size-10 flex justify-center items-center rounded border-gray-200 border hover:cursor-pointer hover:border-gray-300"
              onClick={getMessages}
            >
              {isMessagesLoading ? (
                <LoaderCircle className="animate-spin size-5" />
              ) : (
                <RefreshCcw className="size-5 " />
              )}
            </div>

            {/* Messages */}
            <div className="grid lg:grid-cols-2 grid-cols-1  gap-10 justify-items-center ">
              {messages.map((message, index) => (
                <Card className="w-full max-w-md " key={index}>
                  <CardHeader>
                    <CardTitle className="text-xl">{message.content}</CardTitle>
                    <CardDescription className="font-medium">
                      {dayjs(message.createdAt).format("YYYY MM-DD hh:mm A")}
                    </CardDescription>
                    <CardAction>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <X className="text-white bg-red-500 size-7 hover:cursor-pointer hover:bg-red-600 " />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the message.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                deleteMessage(message._id as string)
                              }
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardAction>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserDashboard;
