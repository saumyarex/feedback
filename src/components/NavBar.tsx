"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { handleFrontendErrors } from "@/helpers/handleFrontendErrors";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function NavBar() {
  const { data: session } = useSession();
  const router = useRouter();

  async function logout() {
    try {
      await signOut();
      router.replace("/");
      toast.success("Logout successfully");
    } catch (error) {
      handleFrontendErrors(error, true);
    }
  }
  return (
    <nav className="absolute z-10 w-full">
      <div className="flex flex-col sm:flex-row gap-5 p-5 bg-gray-800 justify-between items-center">
        <div className="text-xl font-bold text-neutral-100">
          <Link href={"/"}>TRUE FEEDBACK</Link>
        </div>
        {session ? (
          <>
            <span className="text-white text-center font-bold sm:-ml-20">
              Welcome {session.user.username}
            </span>
            <Button
              className="bg-neutral-200 text-black font-semibold hover:bg-neutral-300 hover:cursor-pointer"
              onClick={() => logout()}
            >
              Logout
            </Button>
          </>
        ) : (
          <div className="space-x-5">
            <Link href={"/sign-in"}>
              <Button className="bg-neutral-200 text-black font-semibold hover:bg-neutral-300 hover:cursor-pointer">
                Sign In
              </Button>
            </Link>

            <Link href={"/sign-up"}>
              <Button className="bg-neutral-300 text-black font-semibold hover:bg-neutral-300 hover:cursor-pointer">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
