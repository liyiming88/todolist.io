import React, { useState, useEffect, useCallback } from 'react';
import { FilterType, Todo } from './types';
import { TodoInput } from './components/TodoInput';
import { TodoItem } from './components/TodoItem';
import { generateTasksFromGoal } from './services/aiService';
import { CheckCircle2, ListFilter, AlertCircle } from 'lucide-react';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from local storage
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem('smart-tasker-todos');
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
    } catch (e) {
      console.error("Failed to load todos from local storage", e);
    }
  }, []);

  // Save to local storage whenever todos change
  useEffect(() => {
    localStorage.setItem('smart-tasker-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleGenerateTasks = async (goal: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      const tasks = await generateTasksFromGoal(goal);
      if (tasks.length === 0) {
        setError("AI couldn't generate tasks. Try a more specific goal.");
        return;
      }
      
      const newTodos: Todo[] = tasks.map((text) => ({
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: Date.now(),
      }));

      // Add the goal itself as a parent-like header (optional, but let's just add the tasks)
      // Or maybe add the goal as a task too? Let's just add the generated tasks.
      setTodos((prev) => [...newTodos, ...prev]);
    } catch (err) {
      setError("Something went wrong with the AI service. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === FilterType.ACTIVE) return !todo.completed;
    if (filter === FilterType.COMPLETED) return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Smart Tasker
          </h1>
          <p className="text-lg text-slate-600 max-w-lg mx-auto">
            Stay organized and focused. Use <span className="font-semibold text-indigo-600">Auto-Plan</span> to break down complex goals instantly.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Input Section */}
            <TodoInput 
              onAdd={addTodo} 
              onGenerate={handleGenerateTasks}
              isGenerating={isGenerating}
            />

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 animate-fade-in border border-red-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
                <button 
                  onClick={() => setError(null)} 
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Controls & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
                {Object.values(FilterType).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                      filter === type
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                  >
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
              <div className="text-sm text-slate-500 font-medium">
                {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
              </div>
            </div>

            {/* Todo List */}
            <div className="space-y-1 min-h-[200px]">
              {filteredTodos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center space-y-3 opacity-60">
                   <div className="p-4 bg-slate-50 rounded-full">
                      <ListFilter className="w-8 h-8 text-slate-300" />
                   </div>
                   <p className="text-slate-400">
                     {filter === FilterType.COMPLETED 
                        ? "No completed tasks yet." 
                        : filter === FilterType.ACTIVE 
                            ? "No active tasks. Good job!" 
                            : "Your list is empty. Add a task to get started."}
                   </p>
                </div>
              ) : (
                filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                ))
              )}
            </div>
            
            {/* Footer Actions */}
            {todos.some(t => t.completed) && (
              <div className="flex justify-end pt-2">
                 <button 
                    onClick={clearCompleted}
                    className="text-sm text-slate-400 hover:text-red-600 hover:underline transition-colors"
                 >
                    Clear completed tasks
                 </button>
              </div>
            )}

          </div>
        </div>
        
        <footer className="text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Smart Tasker. Built with React & Gemini.</p>
        </footer>

      </div>
    </div>
  );
}