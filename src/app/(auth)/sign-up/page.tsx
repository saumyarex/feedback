"use client";
import React, { useState, useEffect } from "react";
import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { isAxiosError } from "axios";
import { handleFrontendErrors } from "@/helpers/handleFrontendErrors";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    async function isUsernameUnique() {
      try {
        const response = await axios.get("/api/check-unique-username");
      } catch (error: unknown) {
        handleFrontendErrors(error);
      }
    }
  }, []);
  return <div>SignUpPage</div>;
}

export default SignUpPage;
