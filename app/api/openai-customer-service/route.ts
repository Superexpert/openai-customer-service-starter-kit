import OpenAI from 'openai'
import {NextRequest} from 'next/server'


// this enables Edge Functions in Vercel
// see https://vercel.com/blog/gpt-3-app-next-js-vercel-edge-functions
// and updated here: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const runtime = "edge";

// post a new message and stream OpenAI Assistant response
export async function POST(request:NextRequest) {
    // parse message from post
    const newMessage = await request.json();

    // create OpenAI client
    const openai = new OpenAI();

    // if no thread id then create a new openai thread
    if (newMessage.threadId == null) {
        const thread = await openai.beta.threads.create();
        newMessage.threadId = thread.id;
    }

    // add new message to thread
    await openai.beta.threads.messages.create(
        newMessage.threadId,
        {
            role: "user",
            content: newMessage.content
        }
    );

    // get assistant id from environment
    const assistant_id = process.env.OPENAI_ASSISTANT_ID;
    if (assistant_id == null) {
        return new Response("OpenAI Assistant ID not set", {status: 500});
    }   

    // create a run
    const stream = await openai.beta.threads.runs.create(
        newMessage.threadId, 
        {assistant_id, stream:true}
    );
    

    return new Response(stream.toReadableStream());
}

