
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import {  NextResponse } from 'next/server';
const google = createGoogleGenerativeAI({
  // custom settings
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

export async function POST() {
    try {
        const model = google('gemini-1.5-flash');
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";


        const result =  streamText({
            model,
            maxTokens: 400,
            prompt : prompt,
            onError({ error }) {
            console.error(error); // your error logging logic here
            },
        });


        //return result.toTextStreamResponse();
        return result.toDataStreamResponse();

    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, error: error},{status:500})
    }
}



