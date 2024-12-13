import React, { useState } from 'react';

interface AddPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string) => void;
}

export const AddPromptModal: React.FC<AddPromptModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [newPrompt, setNewPrompt] = useState({ title: '', description: '' });

  const handleAdd = () => {
    onAdd(newPrompt.title, newPrompt.description);
    setNewPrompt({ title: '', description: '' });
  };

  if (!isOpen) {
    return null;
  }

  return (
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
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-cyan-600 text-white rounded"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
 