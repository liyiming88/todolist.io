import React, { useState, KeyboardEvent } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface TodoInputProps {
  onAdd: (text: string) => void;
  onGenerate: (goal: string) => Promise<void>;
  isGenerating: boolean;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAdd, onGenerate, isGenerating }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  const handleAddClick = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  const handleMagicClick = async () => {
    if (inputValue.trim()) {
      await onGenerate(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isGenerating ? (
             <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
          ) : (
             <Plus className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          )}
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm text-lg"
          placeholder={isGenerating ? "Consulting AI..." : "Add a new task, or ask AI to break down a goal..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating}
        />
        <div className="absolute inset-y-0 right-2 flex items-center space-x-2">
            {inputValue.trim() && !isGenerating && (
                <>
                    <Button 
                        variant="ghost" 
                        onClick={handleMagicClick}
                        className="!px-2 !py-1 text-xs"
                        title="Generate subtasks with AI"
                    >
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span className="ml-1 text-purple-600 font-medium">Auto-Plan</span>
                    </Button>
                     <div className="h-6 w-px bg-slate-200 mx-1"></div>
                </>
            )}
            <Button
                variant="primary"
                onClick={handleAddClick}
                disabled={!inputValue.trim() || isGenerating}
                className="!py-1.5 !px-3 !text-sm !rounded-lg"
            >
                Add
            </Button>
        </div>
      </div>
      <p className="text-xs text-slate-400 px-1">
        <span className="font-semibold text-purple-500">Pro tip:</span> Type a big goal like "Plan a vacation" and click <span className="inline-flex items-center text-purple-600"><Sparkles className="w-3 h-3 mx-0.5"/> Auto-Plan</span> to generate a list.
      </p>
    </div>
  );
};