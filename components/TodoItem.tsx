import React from 'react';
import { Trash2, Check, Circle } from 'lucide-react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <div 
        className={`group flex items-center justify-between p-4 mb-3 bg-white border rounded-xl shadow-sm transition-all duration-200 hover:shadow-md animate-slide-up ${
            todo.completed ? 'border-slate-100 bg-slate-50/50' : 'border-slate-200 hover:border-indigo-200'
        }`}
    >
      <div className="flex items-center flex-1 min-w-0 gap-3">
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${
            todo.completed
              ? 'bg-indigo-500 border-indigo-500 text-white'
              : 'border-slate-300 text-transparent hover:border-indigo-400'
          }`}
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </button>
        
        <span 
            className={`text-base truncate transition-all duration-200 select-none cursor-pointer ${
                todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'
            }`}
            onClick={() => onToggle(todo.id)}
        >
          {todo.text}
        </span>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="ml-3 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};