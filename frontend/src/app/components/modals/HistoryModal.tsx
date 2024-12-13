import React, { useState, useEffect } from "react";
import { ModalStatus } from "../types";
import { formatDownloadFile } from "./../utils";
import {
  AiOutlineDownload,
  AiFillPlayCircle,
  AiFillPauseCircle,
  AiOutlineArrowRight,
  AiOutlineArrowLeft,

} from "react-icons/ai";
interface HistoryModalProps {
  isOpen: ModalStatus;
  onClose: () => void;
  historyData: any[][];
  setCurrentIndex: (index: number) => void;
  setGeneratedText: (text: Array<{id: number, script: any[], category:string}>) => void;
  setParameters: (parameters: string[]) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  historyData,
  setCurrentIndex,
  setGeneratedText,
  setParameters
}) => {


  if (isOpen !== ModalStatus.HistoryModal) {
    return null;
  } 

  return (

    <>
    <div
      className={`w-[300px] h-full overflow-auto  absolute top-0 right-0 bg-slate-900 z-40 rounded-br-xl ${
        isOpen===ModalStatus.HistoryModal ? "translate-x-0" : "translate-x-full"
      }`}
    >
          {historyData.map((hdata, index) => {
            const formattedTime = hdata[0].start_time
              .replace("T", "_")
              .split(".")[0];
            return (
              <button
                key={index}
                className="w-full hover:bg-cyan-800 py-2 pl-5  text-gray-300"
                onClick={() => {
                  setCurrentIndex(1);
                  const generatedText = historyData[index].map(item => ({
                    id: item.id,
                    script: JSON.parse(item.gscript),
                    category:item.category
                  }));
                  const titles = historyData[index].map(item => item.title);
                  setGeneratedText(generatedText);
                  setParameters(titles);
                }}
              >
                <p className="text-left">Date: {formattedTime}</p>
                <p className="text-left">Count: {hdata.length}</p>
              </button>
            );
          })}
    </div>
  </>
  );
};
