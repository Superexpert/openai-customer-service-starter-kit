'use client'

import {useState} from "react";
import { AssistantStream } from 'openai/lib/AssistantStream';


export default function OpenAICustomerService({    
    greeting = "I am a helpful chat assistant. How can I help you?",
}) {

  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string>();
  const [prompt, setPrompt] = useState("");
  const [streamingMessage, setStreamingMessage] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // clear streaming message
    setStreamingMessage("Thinking...");

    // add busy indicator
    setIsLoading(true);

    setPrompt("");

    // post new message to server and stream OpenAI Assistant response
    const response = await fetch('/api/openai-customer-service', {
        method: 'POST',
        body: JSON.stringify({
            threadId: threadId,
            content: prompt,
        }),
    });

    if (!response.ok) {
        console.error("Failed to send message to server");
        return;
    }

    if (!response.body) {
        console.error("Response body is undefined");
        return;
    }
    
    const runner = AssistantStream.fromReadableStream(response.body);

    // handle messages from the assistant
    runner.on('messageCreated', (message) => {
        setThreadId(message.thread_id);
    });

    runner.on('textDelta', (_delta, contentSnapshot) => {
        setStreamingMessage(contentSnapshot.value);
    });

    runner.on('messageDone', (message) => {
        // get final message content
        const finalContent =  message.content[0].type == "text" ? message.content[0].text.value : "";

        // add assistant message to list of messages
        setStreamingMessage(finalContent);

      // remove busy indicator
      setIsLoading(false);
    });
}

// handles changes to the prompt input field
function handlePromptChange(e:React.ChangeEvent<HTMLInputElement>) {
    setPrompt(e.target.value);
}

return (
    <div id="openai-customer-server-starter-kit-container">
      <form onSubmit={handleSubmit} className="m-2 flex">
          <input 
            placeholder="Type your question here..." 
            autoFocus
            onChange={handlePromptChange}
            value={prompt}
            className="border rounded w-full py-2 px-3 text-gray-70" 
            />
          <button id="ssa-send">Send</button>
      </form>
      <div>{streamingMessage}</div>
    </div>
  );
}
