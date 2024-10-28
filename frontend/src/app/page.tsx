'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { Bars } from 'react-loading-icons'
import ImageSkelton from "./components/uis/ImageSkelton";
import Switch from "react-switch";

export default function Home() {
  const [textMode, setTextMode] = useState(true);
  const [text, setText] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false); // State

  const [genLoading, setGenLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [file, setFile] = useState<File | null>(null); // State to hold the file
  const [imageUrl, setImageUrl] = useState("");
  const [generated, setGenerated] = useState(false);
  const [generatedText, setGeneratedText] = useState([]);

  const handleGenerate = async () => {
    setGenLoading(true);
  
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else if (textMode) {
      formData.append('text', text); // Append text as form data
    }
  
    try {
      const endpoint = textMode 
        ? 'http://127.0.0.1:8080/generate-conversation-by-text' 
        : 'http://127.0.0.1:8080/generate-conversation';
  
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData, // Always send formData
        headers: undefined, // No need for Content-Type header with FormData
      });
  
      const data = await response.json();
      if (data.error) {
        console.error(data.error);
      } else { 
        setGenerated(true);
        setGeneratedText(data.result);
      }
    } catch (error) {
      console.error('Error generating conversation:', error);
    } finally {
      setGenLoading(false);
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFile(file);
      setFileUploaded(true);
      
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full"
      style={{ backgroundImage: "url('/assets/imgs/bg.png')", backgroundSize: 'cover' }}>
      <div className="w-[80%] pt-16 flex flex-col gap-8">
        <h1 className="text-white/80 w-full font-extrabold text-4xl py-6 px-8 drop-shadow-lg bg-slate-800 rounded-xl border-l-4 border-sky-500">Podcast AI</h1>
        <div className="flex w-full drop-shadow-lg  gap-8">
          <div className="w-1/4">
            <div className="w-full bg-slate-800 px-4 py-6 rounded-xl border-l-4 border-sky-500 flex flex-col gap-4">
              <div className="flex items-center gap-4 py-2">
                <span className="text-white">Text Mode: </span><Switch onChange={() => setTextMode(!textMode)} checked={textMode} />
              </div>
              {!textMode ? (
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-gray-700 dark:bg-gray-700 hover:bg-gray-10 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 ">
                      <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                      {
                        fileUploaded ?
                          (<p className="text-cyan-500 font-bold">File Uploaded.</p>)
                          :
                          (<>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Meida file such as video, image or audio</p>
                          </>
                          )
                      }
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>) : (
                <div>
                  <textarea id="message" rows={15} className="block p-2.5 w-full text-sm rounded-lg border bg-gray-700 outline-none border-gray-600 placeholder-gray-400 text-white  focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Write a small description of type of style you want your space to be..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  ></textarea>
                </div>)
              }
              <button className={`w-full text-white bg-cyan-500 py-3 my-2 rounded-lg disabled:bg-cyan-800 hover:bg-cyan-600 cursor-pointer`
              }
                disabled={(!fileUploaded && !textMode )|| (textMode && text === "")}
                onClick={handleGenerate} >
                <div className="flex justify-center items-center gap-4">
                  {genLoading && <Bars fill="cyan" className="h-4 w-4" />}
                  Generate
                </div>
              </button>
            </div>
          </div>

          <div className="w-3/4 ">
            <div className="w-full p-5 h-[700px] bg-slate-800 rounded-xl relative  flex flex-col overflow-auto ">
            {generatedText.map((message, index) => (
                <div key={index} className={` max-w-[60%] mb-4 p-3 rounded-lg ${index % 2 === 1 ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}`}>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
