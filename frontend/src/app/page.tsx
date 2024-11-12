"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Bars } from "react-loading-icons";
import ImageSkelton from "./components/uis/ImageSkelton";
import Switch from "react-switch";

import { NavDropdown } from "react-bootstrap";
import { DropdownSubmenu, NavDropdownMenu } from "react-bootstrap-submenu";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [textMode, setTextMode] = useState(true);
  const [text, setText] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false); // State

  const [genLoading, setGenLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null); // State to hold the file
  const [generated, setGenerated] = useState(false);
  const [generatedText, setGeneratedText] = useState<{ text: string }[]>([]);
  const [audioURL, setAudioURL] = useState("");
  const [audioLoading, setAudioLoading] = useState(false);
  const [prompts, setPrompts] = useState<
    { id: number; title: string; description: string }[]
  >([]);
  const [selectedPrompt, setSelectedPrompt] = useState<{
    id: number;
    title: string;
    description: string;
  }>();
  const [userPrompts, setUserPrompts] = useState<
    { id: number; title: string; description: string }[]
  >([]);
  const [selectedUserPrompt, setSelectedUserPrompt] = useState<{
    id: number;
    title: string;
    description: string;
  }>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUserAddModalOpen, setIsUserAddModalOpen] = useState(false);
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ title: "", description: "" });
  const [voiceList,setVoiceList] = useState([]);
  const [editingPrompt, setEditingPrompt] = useState<{
    id: number;
    title: string;
    description: string;
  } | null>(null);
  // Add these new handlers
  const [currentSpeaker,setCurrentSpeaker]=useState({person1:"en-US-Casual-K",person2:"en-US-Casual-K"})
  const handleEditPrompt = async () => {
    if (!editingPrompt) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/prompts/${editingPrompt.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingPrompt),
        }
      );

      if (response.ok) {
        // Refresh prompts list
        const updatedPrompts = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/prompts`
        ).then((res) => res.json());
        setPrompts(updatedPrompts);
        setEditingPrompt(null);
        setSelectedPrompt(editingPrompt); // Update the selected prompt with edited values
      }
    } catch (error) {
      console.error("Error updating prompt:", error);
    }
  };

  const handleDeletePrompt = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/prompts/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Refresh prompts list
        const updatedPrompts = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/prompts`
        ).then((res) => res.json());
        setPrompts(updatedPrompts);
        if (updatedPrompts.length > 0) {
          setSelectedPrompt(updatedPrompts[0]);
        }
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting prompt:", error);
    }
  };

  const handleAddPrompt = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/prompts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPrompt),
        }
      );

      if (response.ok) {
        // Refresh prompts list
        const updatedPrompts = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/prompts`
        ).then((res) => res.json());
        setPrompts(updatedPrompts);
        setIsAddModalOpen(false);
        setNewPrompt({ title: "", description: "" });
      }
    } catch (error) {
      console.error("Error adding prompt:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch prompts
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/prompts`
        );
        const data = await response.json();
        setPrompts(data);
        
        // Fetch user prompts
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/userprompts`
        );
        const userData = await userResponse.json();
        setUserPrompts(userData);
        
        // Fetch voice list
        const voiceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-voice-list`, {
          method: 'POST'
        });
        const voiceData = await voiceResponse.json();
        setVoiceList(voiceData.voice_list);
  
        // Set initial selected prompts
        if (data.length > 0) {
          setSelectedPrompt(data[0]);
        }
        if (userData.length > 0) {
          setSelectedUserPrompt(userData[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handlePromptChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedID = parseInt(event.target.value);
    setSelectedPrompt(prompts[selectedID - 1]);
  };

  const handleEditUserPrompt = async () => {
    if (!editingPrompt) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/userprompts/${editingPrompt.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingPrompt),
        }
      );

      if (response.ok) {
        const updatedPrompts = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/userprompts`
        ).then((res) => res.json());
        setUserPrompts(updatedPrompts);
        setEditingPrompt(null);
        setSelectedUserPrompt(editingPrompt);
      }
    } catch (error) {
      console.error("Error updating user prompt:", error);
    }
  };

  const handleDeleteUserPrompt = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/userprompts/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updatedPrompts = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/userprompts`
        ).then((res) => res.json());
        setUserPrompts(updatedPrompts);
        if (updatedPrompts.length > 0) {
          setSelectedUserPrompt(updatedPrompts[0]);
        }
        setIsUserEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting user prompt:", error);
    }
  };

  const handleAddUserPrompt = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/userprompts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPrompt),
        }
      );

      if (response.ok) {
        const updatedPrompts = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/userprompts`
        ).then((res) => res.json());
        setUserPrompts(updatedPrompts);
        setIsUserAddModalOpen(false);
        setNewPrompt({ title: "", description: "" });
      }
    } catch (error) {
      console.error("Error adding user prompt:", error);
    }
  };

  const handleUserPromptChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedID = parseInt(event.target.value);
    setSelectedUserPrompt(userPrompts[selectedID - 1]);
  };
  const handleGenerateAudio = async () => {
    setAudioLoading(true);
    try {
      const formData = new FormData();
      formData.append("conversation", JSON.stringify(generatedText));
      formData.append("currentSpeaker",JSON.stringify(currentSpeaker))
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/generate-audio`,
        {
          method: "POST",
          body: formData, // Always send formData
          headers: undefined, // No need for Content-Type header with FormData
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      setAudioURL(audioUrl);
    } catch (error) {
      console.error("Error generating audio:", error);
    } finally {
      setAudioLoading(false);
    }
  };
  const handleAudioPlay = () => {
    const audio = new Audio(audioURL);
    audio.play();
  };
  const handleGenerate = async () => {
    setGenLoading(true); 
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
      formData.append("prompt", selectedPrompt?.description || "");
      formData.append("userPrompt",selectedUserPrompt?.description || "")
    } else if (textMode) {
      formData.append("text", text); // Append text as form data
      formData.append("prompt", selectedPrompt?.description || "");
      formData.append("userPrompt",selectedUserPrompt?.description || "") 
    }

    try {
      const endpoint = textMode
        ? `${process.env.NEXT_PUBLIC_API_URL}/generate-conversation-by-text`
        : `${process.env.NEXT_PUBLIC_API_URL}/generate-conversation`;

      const response = await fetch(endpoint, {
        method: "POST",
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
      console.error("Error generating conversation:", error);
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
    <main
      className="flex min-h-screen flex-col items-center justify-between w-full"
      style={{
        backgroundImage: "url('/assets/imgs/bg.png')",
        backgroundSize: "cover",
      }}
    >
      {isLoading ? (
      <div className="flex items-center justify-center h-screen">
        <Bars fill="cyan" className="h-12 w-12" />
      </div>
    ) :(
      <div className="w-[80%] pt-16 flex flex-col gap-8">
        <div className="flex w-full drop-shadow-lg  gap-8">
          <div className="w-1/4">
            <div className="w-full bg-slate-800 px-4 py-4 rounded-xl border-l-4 border-sky-500 flex flex-col gap-3">
              <div className="flex items-center gap-4 py-1">
                <span className="text-white">Text Mode: </span>
                <Switch
                  onChange={() => setTextMode(!textMode)}
                  checked={textMode}
                  id="checkbox"
                />
              </div>
              {!textMode ? (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-gray-700 dark:bg-gray-700 hover:bg-gray-10 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 ">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      {fileUploaded ? (
                        <p className="text-cyan-500 font-bold">
                          File Uploaded.
                        </p>
                      ) : (
                        <>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Meida file such as video, image or audio
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              ) : (
                <div>
                  <textarea
                    id="message1"
                    rows={6}
                    className="block p-2.5 w-full text-sm rounded-lg border bg-gray-700 outline-none border-gray-600 placeholder-gray-400 text-white  focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Write a small description of type of style you want your space to be..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  ></textarea>
                </div>
              )}
              <div className="flex flex-col gap-3">
                
                <div className="flex gap-2 ">
                  <div className="flex items-center">
                    <p className="text-white">System:</p>
                  </div>
                  <select
                    id="prompt-select"
                    className="p-2.5 w-full text-sm rounded-lg border bg-gray-700 outline-none border-gray-600 placeholder-gray-400 text-white focus:ring-sky-500 focus:border-sky-500"
                    onChange={handlePromptChange} // Add onChange handler
                  >
                    {prompts.map((prompt, index) => (
                      <option key={index} value={prompt.id}>
                        {prompt.title}
                      </option>
                    ))}
                  </select>
                  <button
                    className="px-3  text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg flex items-center"
                    title="Add New Prompt"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    className="px-3 text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg flex items-center"
                    title="Edit Prompts"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
                <textarea
                  id="message"
                  rows={5}
                  className="block p-2.5 w-full text-sm rounded-lg border bg-gray-700 outline-none border-gray-600 placeholder-gray-400 text-white focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Write a small description of type of style you want your space to be..."
                  value={selectedPrompt?.description || ""} // Bind textarea value to selectedPrompt state
                  onChange={(e) =>
                    selectedPrompt
                      ? setSelectedPrompt({
                          ...selectedPrompt,
                          description: e.target.value,
                        })
                      : null
                  } // Allow manual editing
                ></textarea>
              </div>
              <div className="flex flex-col gap-3 ">
                <div className="flex gap-2">
                <div className="flex items-center ">
                    <p className="text-white">User:</p>
                  </div>
                  <select
                    id="user-prompt-select"
                    className="p-2.5 w-full text-sm rounded-lg border bg-gray-700 outline-none border-gray-600 placeholder-gray-400 text-white focus:ring-sky-500 focus:border-sky-500"
                    onChange={handleUserPromptChange}
                  >
                    {userPrompts.map((prompt, index) => (
                      <option key={index} value={prompt.id}>
                        {prompt.title}
                      </option>
                    ))}
                  </select>
                  <button
                    className="px-3  text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg flex items-center"
                    title="Add New User Prompt"
                    onClick={() => setIsUserAddModalOpen(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    className="px-3  text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg flex items-center"
                    title="Edit User Prompts"
                    onClick={() => setIsUserEditModalOpen(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
                <textarea
                  id="user-prompt-message"
                  rows={6}
                  className="block p-2.5 w-full text-sm rounded-lg border bg-gray-700 outline-none border-gray-600 placeholder-gray-400 text-white focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Write a small description of type of style you want your space to be..."
                  value={selectedUserPrompt?.description || ""}
                  onChange={(e) =>
                    selectedUserPrompt
                      ? setSelectedUserPrompt({
                          ...selectedUserPrompt,
                          description: e.target.value,
                        })
                      : null
                  }
                ></textarea>
              </div>

              <div className="flex justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="prompt-select" className="text-white">
                    Speaker 1
                  </label>
                <select
                  id="speaker1-select"
                  className="block p-2.5 w-full text-sm rounded-lg border bg-gray-700 outline-none border-gray-600 placeholder-gray-400 text-white focus:ring-sky-500 focus:border-sky-500"
                  onChange={(e)=>setCurrentSpeaker({...currentSpeaker,person1:e.target.value})}
                  value={currentSpeaker.person1}
                  >
                  {voiceList.map((voice) => (
                    <option key={voice} value={voice}>
                      {voice}
                    </option>
                  ))}
                </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="prompt-select" className="text-white text-right">
                    Speaker 2
                  </label>
                <select
                  id="speaker2-select"
                  className="block p-2.5 w-full text-sm rounded-lg border bg-gray-700 outline-none border-gray-600 placeholder-gray-400 text-white focus:ring-sky-500 focus:border-sky-500"
                  onChange={(e)=>setCurrentSpeaker({...currentSpeaker,person2:e.target.value})}
                  value={currentSpeaker.person2}
                >
                  {voiceList.map((voice) => (
                    <option key={voice} value={voice}>
                      {voice}
                    </option>
                  ))}
                </select>
                </div>
              </div>

              <button
                className={`w-full text-white bg-cyan-500 py-2 rounded-lg disabled:bg-cyan-800 hover:bg-cyan-600 cursor-pointer`}
                disabled={
                  (!fileUploaded && !textMode) || (textMode && text === "")
                }
                onClick={handleGenerate}
              >
                <div className="flex justify-center items-center gap-4">
                  {genLoading && <Bars fill="cyan" className="h-4 w-4" />}
                  Generate
                </div>
              </button>
              <div className="w-full flex justify-between  gap-2">
                <button
                  className={`${
                    audioURL ? "w-3/4" : "w-full"
                  } text-white bg-cyan-500 py-2 rounded-lg disabled:bg-cyan-800  hover:bg-cyan-600 cursor-pointer`}
                  disabled={generatedText.length === 0}
                  onClick={handleGenerateAudio}
                >
                  <div className="flex justify-center items-center gap-4">
                    {audioLoading && <Bars fill="cyan" className="h-4 w-4" />}
                    Generate Audio
                  </div>
                </button>
                {audioURL && (
                  <button
                    onClick={handleAudioPlay}
                    className="w-1/4 text-white bg-cyan-500 py-2 rounded-lg disabled:bg-cyan-800 hover:bg-cyan-600 cursor-pointer"
                  >
                    Play
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="w-3/4 flex flex-col gap-5 ">
            <h1 className="text-white/80 w-full font-extrabold text-4xl py-6 px-8 drop-shadow-lg bg-slate-800 rounded-xl border-l-4 border-sky-500">
              Podcast AI
            </h1>
            <div className="w-full p-5 h-[700px] bg-slate-800 rounded-xl relative  flex flex-col overflow-auto ">
              {generatedText.map((message, index) => (
                <div
                  key={index}
                  className={` max-w-[60%] mb-4 p-3 rounded-lg ${
                    index % 2 === 1
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-300 text-black self-start"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-slate-800 p-6 rounded-lg w-96">
              <h2 className="text-white text-xl mb-4">Add New Prompt</h2>
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                value={newPrompt.title}
                onChange={(e) =>
                  setNewPrompt({ ...newPrompt, title: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                value={newPrompt.description}
                onChange={(e) =>
                  setNewPrompt({ ...newPrompt, description: e.target.value })
                }
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-cyan-600 text-white rounded"
                  onClick={handleAddPrompt}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-slate-800 p-6 rounded-lg w-96">
              <h2 className="text-white text-xl mb-4">Edit Prompts</h2>
              <div className="max-h-96 overflow-y-auto">
                {editingPrompt ? (
                  <div className="mb-4 p-4 bg-gray-700 rounded">
                    <input
                      type="text"
                      className="w-full p-2 mb-2 bg-gray-600 text-white rounded"
                      value={editingPrompt.title}
                      onChange={(e) =>
                        setEditingPrompt({
                          ...editingPrompt,
                          title: e.target.value,
                        })
                      }
                    />
                    <textarea
                      className="w-full p-2 mb-2 bg-gray-600 text-white rounded"
                      value={editingPrompt.description}
                      onChange={(e) =>
                        setEditingPrompt({
                          ...editingPrompt,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        className="px-3 py-1 bg-gray-600 text-white rounded"
                        onClick={() => setEditingPrompt(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-3 py-1 bg-cyan-600 text-white rounded"
                        onClick={handleEditPrompt}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 p-4 bg-gray-700 rounded">
                    <h3 className="text-white font-bold">
                      {selectedPrompt?.title}
                    </h3>
                    <p className="text-gray-300 max-w-96">
                      {selectedPrompt?.description}
                    </p>
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        className="px-3 py-1 bg-cyan-600 text-white rounded"
                        onClick={() =>
                          selectedPrompt
                            ? setEditingPrompt(selectedPrompt)
                            : null
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded"
                        onClick={() =>
                          selectedPrompt &&
                          handleDeletePrompt(selectedPrompt.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingPrompt(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {isUserAddModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-slate-800 p-6 rounded-lg w-96">
      <h2 className="text-white text-xl mb-4">Add New User Prompt</h2>
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        value={newPrompt.title}
        onChange={(e) =>
          setNewPrompt({ ...newPrompt, title: e.target.value })
        }
      />
      <textarea
        placeholder="Description"
        className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        value={newPrompt.description}
        onChange={(e) =>
          setNewPrompt({ ...newPrompt, description: e.target.value })
        }
      />
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded"
          onClick={() => setIsUserAddModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-cyan-600 text-white rounded"
          onClick={handleAddUserPrompt}
        >
          Add
        </button>
      </div>
    </div>
  </div>
)}

{/* User Edit Modal */}
{isUserEditModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-slate-800 p-6 rounded-lg w-96">
      <h2 className="text-white text-xl mb-4">Edit User Prompts</h2>
      <div className="max-h-96 overflow-y-auto">
        {editingPrompt ? (
          <div className="mb-4 p-4 bg-gray-700 rounded">
            <input
              type="text"
              className="w-full p-2 mb-2 bg-gray-600 text-white rounded"
              value={editingPrompt.title}
              onChange={(e) =>
                setEditingPrompt({
                  ...editingPrompt,
                  title: e.target.value,
                })
              }
            />
            <textarea
              className="w-full p-2 mb-2 bg-gray-600 text-white rounded"
              value={editingPrompt.description}
              onChange={(e) =>
                setEditingPrompt({
                  ...editingPrompt,
                  description: e.target.value,
                })
              }
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="px-3 py-1 bg-gray-600 text-white rounded"
                onClick={() => setEditingPrompt(null)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-cyan-600 text-white rounded"
                onClick={handleEditUserPrompt}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-4 bg-gray-700 rounded">
            <h3 className="text-white font-bold">
              {selectedUserPrompt?.title}
            </h3>
            <p className="text-gray-300 max-w-96">
              {selectedUserPrompt?.description}
            </p>
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="px-3 py-1 bg-cyan-600 text-white rounded"
                onClick={() =>
                  selectedUserPrompt
                    ? setEditingPrompt(selectedUserPrompt)
                    : null
                }
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={() =>
                  selectedUserPrompt &&
                  handleDeleteUserPrompt(selectedUserPrompt.id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded"
          onClick={() => {
            setIsUserEditModalOpen(false);
            setEditingPrompt(null);
          }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      </div>)}
    </main>
  );
}
