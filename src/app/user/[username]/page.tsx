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

function PublicProfilePage() {
  const { username } = useParams();

  // general state variables
  const [isLoading, setIsLoading] = useState(false);

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

  const form = useForm<z.infer<typeof messageFormSchema>>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      content: "",
    },
  });

  return (
    <div className="flex flex-col p-5 py-10 md:p-20 sm:mx-20 lg:mx-40 mx-5">
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
      </div>
    </div>
  );
}

export default PublicProfilePage;
