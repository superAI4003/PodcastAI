import React, { useState } from 'react';
import { ModalStatus } from '../types';
interface SetStartIndexModalProps {
    isOpen: ModalStatus;
    onClose: () => void; 
    startIndex :number;
    setStartIndex: (index: number) => void;
    limit:number;
  }
  
  const SetStartIndexModal: React.FC<SetStartIndexModalProps> = ({ isOpen, onClose, startIndex, setStartIndex ,limit }) => {
 
  
    if (isOpen !== ModalStatus.SetStartIndex) {
        return null;
      }
    
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-slate-800 p-6 rounded-lg w-96">
          <h2 className="text-white text-xl mb-4">Set Start Index</h2>
          <input
            type="number"
            placeholder="Start Index"
            className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            value={startIndex}
            min={1} // minimum value set to 1
            max={limit} 
            onChange={(e) => {
                const value = Number(e.target.value);
                setStartIndex(value > limit ? limit : value);
              }}
          />
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-cyan-600 text-white rounded"
              onClick={() => {
        
                onClose();
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default SetStartIndexModal;