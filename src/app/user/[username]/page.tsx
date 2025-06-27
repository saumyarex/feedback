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

function PublicProfilePage() {
  const { username } = useParams();

  // general state variables
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestMessageClicked, setIsSuggestMessageClicked] = useState(false);
  const [currentClickedMessage, setCurrentClickedMessage] = useState("");

  //messages state varialbes
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "Love your work",
    },
    {
      id: 2,
      message: "When are you launching next product line",
    },
    {
      id: 3,
      message: "When are you coming to India",
    },
  ]);

  const form = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const { setValue } = form;

  const onSubmit = async (data: z.infer<typeof messageFormSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/send-messages", {
        username,
        message: data.content,
      });
      toast.success(response.data.message);
    } catch (error) {
      handleFrontendErrors(error, true);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="flex flex-col p-5 py-10 md:p-20 sm:mx-20 lg:mx-40 mx-5">
      <div>
        {/* Main heading */}
        <h1 className="text-center font-extrabold text-4xl">
          Public Profile Link
        </h1>

        {/* Anonymous message box */}
        <div id="message-box" className="mt-10 flex flex-col gap-4">
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
                {isLoading ? (
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
          <Button className="self-start">Suggest Messages</Button>
          <h2 className="font-medium text-lg">
            Click on any message to select it.
          </h2>

          {/* suggested messages options */}
          <div className="flex flex-col gap-5 px-5 py-6 border-2 border-gray-100 rounded-md">
            <h3 className="text-xl font-semibold">Messages</h3>
            {messages.map((message) => (
              <Link href={"#message-box"} key={message.id}>
                <div
                  className={` text-center border-2 border-gray-50 py-2 hover:bg-gray-100 hover:cursor-pointer font-medium rounded-md ${isSuggestMessageClicked && currentClickedMessage === message.id.toString() ? "bg-gray-100" : ""} `}
                  onClick={() =>
                    copySuggestedMessage(message.id.toString(), message.message)
                  }
                >
                  {message.message}
                </div>
              </Link>
            ))}
          </div>

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
