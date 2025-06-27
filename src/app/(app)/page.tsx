"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import messages from "../../message.json";
import { Mail } from "lucide-react";

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnMouseEnter: true, stopOnInteraction: false })
  );
  return (
    <>
      <main className="realtive flex flex-col items-center min-h-screen px-5 w-full">
        <h1 className="sm:text-5xl text-3xl sm:font-black font-extrabold mt-40 text-center">
          Dive into the World of Anonymous Feedback
        </h1>
        <p className="text-xl mt-5 font-medium text-center">
          True Feedback - Where your identity remains a secret.
        </p>

        {/* carousel  */}
        <div className="w-full flex justify-center mt-8">
          <Carousel plugins={[plugin.current]} className="w-full max-w-xl">
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col aspect-square items-center justify-center sm:h-20 h-30 ">
                        <h2 className="self-start font-bold text-xl">
                          {message.title}
                        </h2>
                        <div className="self-start flex gap-4 mt-3 items-center">
                          <Mail />
                          <div>
                            <p className="font-medium text-lg self-start">
                              {message.content}
                            </p>
                            <p className="font-light text-sm self-start">
                              {message.received}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </main>
      <footer className="font-normal bg-gray-800 py-6 w-full text-center absolute z-10 bottom-0  text-white ">
        &copy; True Feedback. All rights reserved.
      </footer>
    </>
  );
}
