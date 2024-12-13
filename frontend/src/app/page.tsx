"use client";

import { useEffect, useState } from "react";
import { Bars, Circles } from "react-loading-icons";
import Switch from "react-switch";
import React, { useRef } from "react";
import { ModalStatus, PromptType } from "./components/types";
import { formatDuration, formatDownloadFile } from "./components/utils";

import {
  AiOutlineDownload,
  AiFillPlayCircle,
  AiFillPauseCircle,
  AiOutlineArrowRight,
  AiOutlineArrowLeft,
  AiOutlineUpload,
  AiOutlineEllipsis,
  AiOutlineHistory,
  AiOutlineRotateRight,
  AiFillPlusSquare,
  AiFillEdit,
  AiTwotoneSave,
} from "react-icons/ai";
import { DownloadModal } from "./components/modals/DownloadModal";
import { Timer } from "./components/labels/Timers";
import SetStartIndexModal from "./components/modals/SetStartIndexModal";
import { HistoryModal } from "./components/modals/HistoryModal";
import { Title } from "./components/labels/Title";
import { GeneratedTextPanel } from "./components/labels/GeneratedTextPanel";
import { title } from "process";
export default function Home() {
  const [modalStatus, setModalStatus] = useState<ModalStatus>(
    ModalStatus.Closed
  );
  const [isNoUpdate, setIsNoUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenCategory, setIsGenCategory] = useState(true);
  const [textMode, setTextMode] = useState(true);
  const [text, setText] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false); // State
  const [genLoading, setGenLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null); // State to hold the file
  const [generated, setGenerated] = useState(false);
  const [generatedText, setGeneratedText] = useState<
    Array<{ id: number; script: any[]; category: string }>
  >([]);
  const [audioURL, setAudioURL] = useState<string[]>([]);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [scriptTimers, setScriptTimers] = useState<string[]>([]);
  const [audioTimers, setAudioTimers] = useState<string[]>([]);
  const [scriptTotalTimer, setScriptTotalTimer] = useState(0);
  const [audioTotalTimer, setAudioTotalTimer] = useState(0);
  const [prompts, setPrompts] = useState<PromptType[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<{
    id: number;
    title: string;
    description: string;
  }>();
  const [userPrompts, setUserPrompts] = useState<PromptType[]>([]);
  const [selectedUserPrompt, setSelectedUserPrompt] = useState<PromptType>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUserAddModalOpen, setIsUserAddModalOpen] = useState(false);
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ title: "", description: "" });
  const [voiceList, setVoiceList] = useState([]);
  const [voiceElevenLabs, setVoiceElevenLabs] = useState<
    { voice_id: string; name: string }[]
  >([]);
  const [speaker1, setSpeaker1] = useState(true);
  const [speaker2, setSpeaker2] = useState(true);
  const [processingIndex, setProcessingIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingPrompt, setEditingPrompt] = useState<PromptType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [historyData, setHistoryData] = useState<any[][]>();
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isEditGeneratedText, setIsEditGeneratedText] = useState(false);
  const [isEditGeneratedTextSave, setIsEditGeneratedTextSave] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState({
    person1: "en-US-Casual-K",
    style1: true,
    person2: "en-US-Casual-K",
    style2: true,
  });

  const [startIndex, setStartIndex] = useState(1);

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
  const [parameters, setParameters] = useState<string[]>([]);
  const [genStatus, setGenStatus] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result as string)
          .split("\n")
          .filter((line) => line.trim() !== "");
        setParameters(text);
      };
      reader.readAsText(file);
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
          `${process.env.NEXT_PUBLIC_API_URL}/prompts/`
        );
        const data = await response.json();
        setPrompts(data);

        // Fetch user prompts
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/userprompts/`
        );
        const userData = await userResponse.json();
        setUserPrompts(userData);

        // Fetch voice list
        const voiceResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/get-voice-list/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const voiceData = await voiceResponse.json();
        setVoiceList(voiceData.voice_list);
        const voiceElevenLabsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/get-elevenlabs-voice-list/`,
          {
            method: "POST",
          }
        );
        const voiceElevenLabsData = await voiceElevenLabsResponse.json();
        setVoiceElevenLabs(voiceElevenLabsData.voice_list);

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
  const fetchHistoryData = async () => {
    const scriptsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/scripts/`
    );
    const scriptsData = await scriptsResponse.json();
    const groupedScripts = scriptsData.reduce(
      (grouped: { [key: string]: any[] }, script: any) => {
        const time = script.start_time; // Use the full start_time for grouping
        if (!grouped[time]) {
          grouped[time] = [];
        }
        grouped[time].push(script);
        return grouped;
      },
      {}
    );

    // Convert the groupedScripts object into an array of arrays
    const groupedScriptsArray = Object.values(groupedScripts) as any[][];
    setHistoryData(groupedScriptsArray);
    return Promise.resolve();
  };
  const handlePromptChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedID = parseInt(event.target.value);
    setSelectedPrompt(prompts[selectedID]);
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
    console.log(userPrompts);
    const selectedID = parseInt(event.target.value);
    console.log(selectedID);
    setSelectedUserPrompt(userPrompts[selectedID]);
  };
  const handleGenerateAudio = async () => {
    setAudioLoading(true);
    try {
      const audioUrls: string[] = [];
      let totalTimer = 0;
      for (let [index, conversation] of Array.from(generatedText.entries())) {
        setProcessingIndex(index);
        const formData = new FormData();
        formData.append("currentSpeaker", JSON.stringify(currentSpeaker));
        formData.append("id", conversation.id.toString());
        formData.append("conversation", JSON.stringify(conversation.script));
        const startTime = performance.now();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/generate-audio`,
          {
            method: "POST",
            body: formData, // Always send formData
            headers: undefined, // No need for Content-Type header with FormData
          }
        );
        const endTime = performance.now();
        const duration = endTime - startTime;
        const formattedDuration = formatDuration(duration);
        totalTimer += duration;
        setAudioTotalTimer(totalTimer);
        setAudioTimers((prevTimers) => [...prevTimers, formattedDuration]);
        if (!response.ok) {
          throw new Error("Failed to generate audio");
        }

        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        audioUrls.push(audioUrl);
        setAudioURL(audioUrls);
        const audioObjects = audioUrls.map((url) => new Audio(url));
        setAudio(audioObjects);
      }
      setAudioURL(audioUrls);
      const audioObjects = audioUrls.map((url) => new Audio(url));
      setAudio(audioObjects);
    } catch (error) {
      console.error("Error generating audio:", error);
    } finally {
      setAudioLoading(false);
    }
  };
  const handleAudioPlay = () => {
    if (audio) {
      // If audio is currently playing, stop it
      if (isPlaying) {
        audio[currentIndex - 1].pause();
        setIsPlaying(false);
      } else {
        // If audio is not playing, start it
        audio[currentIndex - 1].play();
        setIsPlaying(true);
      }
    } else {
      // If audio object has not been created yet, create it
      const audioObjects = audioURL.map((url) => new Audio(url));
      setAudio(audioObjects);
      audioObjects[currentIndex - 1].play();
      setIsPlaying(true);
    }
  };
  const handleFileUploadClick = () => {
    // Trigger the file input click event
    fileInputRef.current && fileInputRef.current.click();
  };
  const addScript = async (
    title: string,
    gscript: string,
    stime: number,
    etime: number,
    category: string
  ) => {
    // function body...
    const startDate = new Date(stime + performance.timeOrigin);
    const endDate = new Date(etime + performance.timeOrigin);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scripts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            gscript,
            start_time: startDate.toISOString(),
            end_time: endDate.toISOString(),
            category,
            noupdate: isNoUpdate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleGenerate = async () => {
    const slicedParameters = parameters.slice(startIndex - 1);
    setParameters(slicedParameters);

    setGenLoading(true);
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else if (textMode) {
      formData.append("text", text); // Append text as form dat
    }
    formData.append("userPrompt", selectedUserPrompt?.description || "");

    try {
      let allResults = [];
      let totalTimer = 0;
      const endpoint = textMode
        ? `${process.env.NEXT_PUBLIC_API_URL}/generate-conversation-by-text`
        : `${process.env.NEXT_PUBLIC_API_URL}/generate-conversation`;

      if (!selectedPrompt?.description.includes("$1")) {
        formData.set("prompt", selectedPrompt?.description || "");
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData, // Always send formData
          headers: undefined, // No need for Content-Type header with FormData
        });
        const data = await response.json();
        if (data.error) {
          console.error(data.error);
        } else {
          allResults.push(data.result);
        }
      } else {
        const gstartTime = performance.now();
        for (let [index, parameter] of Array.from(slicedParameters.entries())) {
          // Your code here...
          setProcessingIndex(index);
          const sprompt = selectedPrompt.description.replace("$1", parameter);
          formData.set("prompt", sprompt);
          const startTime = performance.now();
          const response = await fetch(endpoint, {
            method: "POST",
            body: formData, // Always send formData
            headers: undefined, // No need for Content-Type header with FormData
          });
          const endTime = performance.now();
          const duration = endTime - startTime;
          const formattedDuration = formatDuration(duration);
          totalTimer += duration;
          setScriptTotalTimer(totalTimer);
          setScriptTimers((prevTimers) => [...prevTimers, formattedDuration]);

          const para = encodeURIComponent(parameter);
          const responsetitle = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/scripts/title/${para}`
          );
          const responsetitleresult = await responsetitle.json();
          if (responsetitleresult.exists) {
            const existdb = responsetitleresult.script
            if (isNoUpdate) {
              allResults.push({
                id: existdb.id,
                script: JSON.parse(existdb.gscript),
                category: existdb.category,
              });
              if (index === 0) setCurrentIndex(1);
              setGeneratedText(allResults);
              setGenStatus((prevStatus) => {
                const newStatus = [...prevStatus]; // Create a copy of the previous status array
                newStatus[index] = "Skipped"; // Replace the status at the specific index
                return newStatus; // Return the new status array
              });
            } else {
              const data = await response.json();

              const starttime = new Date(gstartTime + performance.timeOrigin);
              const endtime = new Date(endTime + performance.timeOrigin);
              existdb.start_time = starttime.toISOString();
              existdb.end_time = endtime.toISOString();
              existdb.gscript = JSON.stringify(data.result);
              existdb.noupdate = isNoUpdate;
              const updateResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/scripts/${existdb.id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(existdb),
                }
              );

              if (!updateResponse.ok) {
                throw new Error("Failed to update script");
              }

              const updatedScript = await updateResponse.json();

              allResults.push({
                id: updatedScript.id,
                script: JSON.parse(updatedScript.gscript),
                category: updatedScript.category,
              });
              if (index === 0) setCurrentIndex(1);
              setGeneratedText(allResults);
              setGenStatus((prevStatus) => {
                const newStatus = [...prevStatus]; // Create a copy of the previous status array
                newStatus[index] = "Updated"; // Replace the status at the specific index
                return newStatus; // Return the new status array
              });
            }
            continue;
          }
         
          const data = await response.json();
          let category = null;

          if (isGenCategory) {
            category = await getCategory(parameter);
          }

          if (data.error) {
            console.error(data.error);
          } else {
            const result = await addScript(
              parameter,
              JSON.stringify(data.result),
              gstartTime,
              endTime,
              category
            );
            allResults.push({
              id: result.id,
              script: data.result,
              category: category,
            });
            if (index === 0) setCurrentIndex(1);
            setGeneratedText(allResults);
            setGenStatus((prevStatus) => {
              const newStatus = [...prevStatus]; // Create a copy of the previous status array
              newStatus[index] = "Added"; // Replace the status at the specific index
              return newStatus; // Return the new status array
            });
          }
        }
      }
      setGenerated(true);
      setGeneratedText(allResults);
    } catch (error) {
      console.error("Error generating conversation:", error);
    } finally {
      setGenLoading(false);
    }
  };
  const getCategory = async (title: string) => {
    const formData = new FormData();
    formData.append("text", title); // Use the title parameter
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/generate-category-by-title`,
      {
        method: "POST",
        body: formData,
        headers: undefined,
      }
    );
    const data = await response.json();
    return data.result;
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFile(file);
      setFileUploaded(true);
    }
  };
  const saveGeneratedChanges = async () => {
    const id = generatedText[currentIndex - 1].id;
    const title = parameters[currentIndex - 1];

    // Fetch the existing script data
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/scripts/${id}`
    );
    const scriptData = await response.json();
    // Update the necessary fields
    scriptData.title = title;
    scriptData.gscript = JSON.stringify(generatedText[currentIndex - 1].script);
    scriptData.category = generatedText[currentIndex - 1].category;
    // Send a PUT request to the server with the updated data
    const updateResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/scripts/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scriptData),
      }
    );

    if (!updateResponse.ok) {
      throw new Error("Failed to update script");
    }

    const updatedScript = await updateResponse.json();
    return updatedScript;
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
      ) : (
        <div className="w-[80%] pt-16 flex flex-col gap-8">
          <div className="flex w-full drop-shadow-lg  gap-8">
            <div className="w-1/4">
              <div className="w-full bg-slate-800 px-4 py-4 rounded-xl border-l-4 border-sky-500 flex flex-col gap-3">
                <div className="flex flex-row justify-between">
                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id="checkbox"
                      checked={textMode}
                      onChange={() => setTextMode(!textMode)}
                    />
                    <span className="text-white">Mode </span>
                  </div>
                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id="checkbox1"
                      checked={isGenCategory}
                      onChange={() => setIsGenCategory(!isGenCategory)}
                    />
                    <span className="text-white">Category</span>
                  </div>
                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id="checkbox2"
                      checked={isNoUpdate}
                      onChange={() => setIsNoUpdate(!isNoUpdate)}
                    />
                    <span className="text-white">No Update</span>
                  </div>
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
                        <option key={index} value={index}>
                          {prompt.title}
                        </option>
                      ))}
                    </select>
                    <button
                      className="px-2  text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg flex items-center"
                      title="Add New Prompt"
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      <AiFillPlusSquare
                        style={{ width: "20px", height: "20px" }}
                      />
                    </button>
                    <button
                      className="px-2 text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg flex items-center"
                      title="Edit Prompts"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      <AiFillEdit style={{ width: "20px", height: "20px" }} />
                    </button>
                    <button
                      className="px-2 text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg flex items-center"
                      title="Upload File"
                      onClick={handleFileUploadClick}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                      />
                      <AiOutlineUpload
                        style={{ width: "20px", height: "20px" }}
                      />
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
                        <option key={index} value={index}>
                          {prompt.title}
                        </option>
                      ))}
                    </select>
                    <button
                      className="px-2  text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg flex items-center"
                      title="Add New User Prompt"
                      onClick={() => setIsUserAddModalOpen(true)}
                    >
                      <AiFillPlusSquare
                        style={{ width: "20px", height: "20px" }}
                      />
                    </button>
                    <button
                      className="px-2  text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg flex items-center"
                      title="Edit User Prompts"
                      onClick={() => setIsUserEditModalOpen(true)}
                    >
                      <AiFillEdit style={{ width: "20px", height: "20px" }} />
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
                    <div className="flex items-center gap-2">
                      <label htmlFor="prompt-select" className="text-white">
                        Speaker 1
                      </label>
                      <Switch
                        onChange={() => setSpeaker1(!speaker1)}
                        checked={speaker1}
                        id="speaker1-switch"
                        handleDiameter={16} // Smaller handle diameter
                        height={20} // Smaller height
                      />
                    </div>
                    <select
                      id="speaker1-select"
                      className="block p-2.5 w-full text-sm rounded-lg border bg-gray-700 outline-none border-gray-600 placeholder-gray-400 text-white focus:ring-sky-500 focus:border-sky-500"
                      onChange={(e) =>
                        setCurrentSpeaker({
                          ...currentSpeaker,
                          person1: e.target.value,
                          style1: speaker1,
                        })
                      }
                      value={currentSpeaker.person1}
                    >
                      {speaker1
                        ? voiceList.map((voice) => (
                            <option key={voice} value={voice}>
                              {voice}
                            </option>
                          ))
                        : voiceElevenLabs.map((voice) => (
                            <option key={voice.voice_id} value={voice.voice_id}>
                              {voice.name}
                            </option>
                          ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Switch
                        onChange={() => setSpeaker2(!speaker2)}
                        checked={speaker2}
                        id="speaker2-switch"
                        handleDiameter={16} // Smaller handle diameter
                        height={20} // Smaller height
                      />
                      <label htmlFor="prompt-select" className="text-white">
                        Speaker 2
                      </label>
                    </div>
                    <select
                      id="speaker2-select"
                      className="block p-2.5 w-full text-sm rounded-lg border bg-gray-700 outline-none border-gray-600 placeholder-gray-400 text-white focus:ring-sky-500 focus:border-sky-500"
                      onChange={(e) =>
                        setCurrentSpeaker({
                          ...currentSpeaker,
                          person2: e.target.value,
                          style2: speaker2,
                        })
                      }
                      value={currentSpeaker.person2}
                    >
                      {speaker2
                        ? voiceList.map((voice) => (
                            <option key={voice} value={voice}>
                              {voice}
                            </option>
                          ))
                        : voiceElevenLabs.map((voice) => (
                            <option key={voice.voice_id} value={voice.voice_id}>
                              {voice.name}
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
                    className={`${"w-full"} text-white bg-cyan-500 py-2 rounded-lg disabled:bg-cyan-800  hover:bg-cyan-600 cursor-pointer`}
                    disabled={generatedText.length === 0}
                    onClick={handleGenerateAudio}
                  >
                    <div className="flex justify-center items-center gap-4">
                      {audioLoading && <Bars fill="cyan" className="h-4 w-4" />}
                      Generate Audio
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="w-3/4 flex flex-col gap-3 ">
              <h1 className="text-white/80 w-full font-extrabold text-4xl py-6 px-8 drop-shadow-lg bg-slate-800 rounded-xl border-l-4 border-sky-500">
                Podcast AI <span className="text-white">1.1.1</span>
              </h1>

              <div className="w-full flex flex-col h-[740px]">
                <div className="w-full h-12   bg-slate-600 rounded-t-xl flex justify-between items-center p-2  ">
                  {/* {audioURL && ( */}
                  <div className="flex flex-col">
                    {genLoading ? (
                      <p className="pl-10 text-white text-[16px]">
                        Processing Script generation item:{processingIndex + 1}/
                        {parameters.length}{" "}
                        <span className="text-red-500">
                          (
                          {parameters[processingIndex].length > 40
                            ? `${parameters[processingIndex].slice(0, 40)}...`
                            : parameters[processingIndex]}
                          )
                        </span>{" "}
                      </p>
                    ) : (
                      <></>
                    )}

                    {audioLoading ? (
                      <p className="pl-10 text-white text-[16px]">
                        Processing Audio generation item:{processingIndex + 1}/
                        {parameters.length}{" "}
                        <span className="text-red-500">
                          ({parameters[processingIndex]})
                        </span>{" "}
                      </p>
                    ) : (
                      <div></div>
                    )}
                    {generatedText.length > 0 && (
                      <Title
                        currentIndex={currentIndex}
                        parameters={parameters}
                        isEditGeneratedText={isEditGeneratedText}
                        setParameters={setParameters}
                        generatedText={generatedText}
                        setGeneratedText={setGeneratedText}
                        genStatus={genStatus}
                      />
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      className="  text-white bg-cyan-500 px-1 py-1 justify-center items-center  rounded-lg disabled:bg-cyan-800 hover:bg-cyan-600 cursor-pointer"
                      onClick={() => setCurrentIndex(currentIndex - 1)}
                      disabled={
                        currentIndex === 1 ||
                        !generatedText.length ||
                        isPlaying ||
                        isEditGeneratedText ||
                        isEditGeneratedTextSave
                      }
                    >
                      <AiOutlineArrowLeft
                        style={{ width: "24px", height: "24px" }}
                      />{" "}
                    </button>
                    {!generatedText.length ? (
                      <p className="font-bold text-gray-400">0/0</p>
                    ) : (
                      <p className="font-bold text-white">
                        {currentIndex}/{generatedText.length}
                      </p>
                    )}
                    <button
                      className="  text-white bg-cyan-500 px-1 py-1 justify-center items-center  rounded-lg disabled:bg-cyan-800 hover:bg-cyan-600 cursor-pointer"
                      onClick={() => setCurrentIndex(currentIndex + 1)}
                      disabled={
                        currentIndex === generatedText.length ||
                        !generatedText.length ||
                        isPlaying ||
                        isEditGeneratedText ||
                        isEditGeneratedTextSave
                      }
                    >
                      <AiOutlineArrowRight
                        style={{ width: "24px", height: "24px" }}
                      />
                    </button>

                    <button
                      onClick={handleAudioPlay}
                      className="  text-white bg-cyan-500 px-1  py-1 justify-center items-center  rounded-lg disabled:bg-cyan-800 hover:bg-cyan-600 cursor-pointer"
                      disabled={
                        !audioURL ||
                        audioURL.length === 0 ||
                        !(currentIndex < audioURL.length + 1)
                      }
                    >
                      {isPlaying ? (
                        <AiFillPauseCircle
                          style={{ width: "24px", height: "24px" }}
                        />
                      ) : (
                        <AiFillPlayCircle
                          style={{ width: "24px", height: "24px" }}
                        />
                      )}
                    </button>

                    {!(
                      !audioURL ||
                      audioURL.length === 0 ||
                      !(currentIndex < audioURL.length + 1)
                    ) && (
                      <a
                        href={audioURL[currentIndex - 1]}
                        download={formatDownloadFile(
                          parameters[currentIndex - 1]
                        )}
                        className={`text-white bg-cyan-500 flex px-1 py-1 justify-center items-center rounded-lg disabled:bg-cyan-800 hover:bg-cyan-600 cursor-pointer`}
                      >
                        <AiOutlineDownload
                          style={{ width: "24px", height: "24px" }}
                        />
                      </a>
                    )}
                    <button
                      className="  text-white bg-cyan-500 relative px-1 py-1 justify-center items-center  rounded-lg disabled:bg-cyan-800 hover:bg-cyan-600 cursor-pointer"
                      onClick={() => setModalStatus(ModalStatus.SetStartIndex)}
                      disabled={!parameters.length}
                    >
                      <AiOutlineRotateRight
                        style={{ width: "24px", height: "24px" }}
                      />
                      {parameters.length > 0 && (
                        <div className="absolute -top-1 -right-1 flex justify-center items-center w-[16px] h-[16px] rounded-full  bg-white">
                          <p className=" text-[12px] text-red-600   font-bold  ">
                            {startIndex}
                          </p>
                        </div>
                      )}
                    </button>
                    <button
                      className="  text-white bg-cyan-500 relative px-1 py-1 justify-center items-center  rounded-lg disabled:bg-cyan-800 hover:bg-cyan-600 cursor-pointer"
                      onClick={async () => {
                        if (isEditGeneratedText) {
                          setIsEditGeneratedTextSave(true); // Set saving status to true before starting the save operation
                          await saveGeneratedChanges(); // Replace this with your actual save function
                          setIsEditGeneratedTextSave(false); // Set saving status to false after the save operation is complete
                        }
                        setIsEditGeneratedText(!isEditGeneratedText);
                      }}
                      disabled={
                        !generatedText.length || isEditGeneratedTextSave
                      }
                    >
                      {isEditGeneratedTextSave ? (
                        <Circles style={{ width: "24px", height: "24px" }} /> // Replace this with your actual loading spinner component
                      ) : isEditGeneratedText ? (
                        <AiTwotoneSave
                          style={{ width: "24px", height: "24px" }}
                        />
                      ) : (
                        <AiFillEdit style={{ width: "24px", height: "24px" }} />
                      )}
                    </button>

                    <button
                      className="  text-white bg-cyan-500 px-1 py-1 justify-center items-center  rounded-lg disabled:bg-cyan-800 hover:bg-cyan-600 cursor-pointer"
                      onClick={async () => {
                        if (modalStatus === ModalStatus.HistoryModal) {
                          setModalStatus(ModalStatus.Closed);
                        } else {
                          setHistoryLoading(true);
                          await fetchHistoryData();
                          setHistoryLoading(false);
                          setModalStatus(ModalStatus.HistoryModal);
                        }
                      }}
                    >
                      {historyLoading ? (
                        <Circles style={{ width: "24px", height: "24px" }} />
                      ) : (
                        <AiOutlineHistory
                          style={{ width: "24px", height: "24px" }}
                        />
                      )}
                    </button>
                    <button
                      className="  text-white bg-cyan-500 px-1 py-1 justify-center items-center  rounded-lg disabled:bg-cyan-800 hover:bg-cyan-600 cursor-pointer"
                      onClick={() => setModalStatus(ModalStatus.Download)}
                      disabled={!audioURL.length || isPlaying}
                    >
                      <AiOutlineEllipsis
                        style={{ width: "24px", height: "24px" }}
                      />
                    </button>
                  </div>
                  {/* )} */}
                </div>
                <div className="w-full  min-h-[690px] relative  bg-slate-800 rounded-b-xl ">
                  <HistoryModal
                    isOpen={modalStatus}
                    onClose={() => setModalStatus(ModalStatus.Closed)}
                    historyData={historyData || []}
                    setCurrentIndex={setCurrentIndex}
                    setGeneratedText={setGeneratedText}
                    setParameters={setParameters}
                  />
                  <div className="w-full h-full p-5 relative  flex flex-col overflow-auto  ">
                    {generatedText.length > 0 && (
                      <Timer
                        scriptTimers={scriptTimers}
                        scriptTotalTimer={scriptTotalTimer}
                        audioTimers={audioTimers}
                        audioTotalTimer={audioTotalTimer}
                        currentIndex={currentIndex}
                        formatDuration={formatDuration}
                      />
                    )}
                    <GeneratedTextPanel
                      isEditGeneratedText={isEditGeneratedText}
                      currentIndex={currentIndex}
                      generatedText={generatedText}
                      setGeneratedText={setGeneratedText}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DownloadModal
            isOpen={modalStatus}
            onClose={() => setModalStatus(ModalStatus.Closed)}
            audioUrls={audioURL}
            parameters={parameters}
          />
          <SetStartIndexModal
            isOpen={modalStatus}
            onClose={() => setModalStatus(ModalStatus.Closed)}
            startIndex={startIndex}
            setStartIndex={setStartIndex}
            limit={parameters.length}
          />

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
        </div>
      )}
    </main>
  );
}
