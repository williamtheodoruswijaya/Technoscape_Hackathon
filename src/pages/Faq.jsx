import React, { useEffect, useRef, useState } from 'react';
import { pipeline } from '@xenova/transformers';

import { GoogleGenerativeAI } from "@google/generative-ai";

import { env } from '@xenova/transformers';
import Navbar from '../components/Navbar';
import { BeatLoader } from "react-spinners";

env.allowLocalModels = false;
env.useBrowserCache = false;

const genAI = new GoogleGenerativeAI("AIzaSyDPBX4bbIvXcupKTOc63rfpqismkktMLeU");

function Faq() {
  const [response, setResponse] = useState("");
  const [model, setModel] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatContent, setChatContent] = useState([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Fetch the generative model when the component mounts
    const fetchModel = async () => {
      try {
        setLoading(true);
        const generativeModel = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        setModel(generativeModel);
      } catch (error) {
        console.error('Error loading generative model:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchModel();
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [prompt]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset the height
    textarea.style.height = `${textarea.scrollHeight + 10}px`; // Set it to the scrollHeight
  };

  const getResponse = async () => {
    if (model) {
      if (!prompt) {
        setResponse('Prompt cannot be empty');
        return;
      }
      try {
        setLoading(true);
        // Add the user's prompt to the chat content
        setChatContent(prevChatContent => [
          ...prevChatContent,
          { user: prompt, bot: "" }
        ]);
        const tempPrompt = prompt;
        setPrompt('');
        const result = await model.generateContent(tempPrompt);
        const res = await result.response;
        const text = await res.text(); // Await the text response
        
        setResponse(text);
        // Update the bot response in the chat content
        setChatContent(prevChatContent => {
          const updatedChatContent = [...prevChatContent];
          updatedChatContent[updatedChatContent.length - 1].bot = text;
          return updatedChatContent;
        });

      } catch (error) {
        console.error('Error generating content:', error);
        setResponse('Error: ', error.message);
      } finally {
        setLoading(false);
        setPrompt('');
      }
    } else {
      setResponse('Generative model not loaded');
    }
  };

  const getSentiment = async () => {
    try {
      console.log("clicked");
      const classifier = await pipeline('sentiment-analysis');
      console.log("here");
      const result = await classifier(prompt);
      setResponse(result[0].label);
    } catch (error) {
      console.error('Error getting sentiment:', error);
      setResponse('Error: ', error.message);
    }
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
      
      <div className="w-screen min-h-screen flex font-sans bg-background">
        <Navbar />
        
        <div className="mx-10 py-5 flex items-end justify-start">
          <div className="w-[100vh]">
            {chatContent.map((content, index) => (
              <div key={index} className="w-full">
                <div className="justify-end flex">
                  <div className="my-5 text-white bg-blueuser p-5 rounded-3xl max-w-[65%]">{content.user}</div>
                </div>
                <div className="justify-start flex">
                  {content.bot ? <div className="my-5 text-white bg-blueres p-5 rounded-3xl max-w-[65%]">{content.bot}</div> : <div className="my-5 text-white bg-bluefield p-5 rounded-3xl max-w-[65%]"><BeatLoader loading={loading} size={10} color="white" margin={3} /></div>}
                </div>
              </div>
            ))}
            <div className="flex items-center">  
            <textarea 
                id="multiliner" 
                placeholder="Type something ..." 
                className="px-3 pt-3 rounded-xl bg-bluefield text-white min-w-[100vh] font-sans mr-5 resize-none overflow-hidden" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                ref={textareaRef}
              />
              <button onClick={getResponse} disabled={loading} className="rounded-xl text-black bg-white h-[4rem]">Send</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Faq;