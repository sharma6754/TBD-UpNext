import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaCheck, FaPencilAlt } from "react-icons/fa";
import classNames from "classnames";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  deadline: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        deadline: newDeadline,
      },
    ]);
    setNewTodo("");
    setNewDeadline("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditDeadline(todo.deadline);
  };

  const saveEdit = (id: number) => {
    if (!editText.trim()) return;

    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, text: editText.trim(), deadline: editDeadline }
          : todo
      )
    );
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 py-8">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-xl p-6 sm:max-w-md lg:max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcXRonf7qve3uF5imn_mc8n8DM99aODGogpA&s" // Use your logo image path here
            alt="Todo App Logo"
            className="w-8 h-8" // Adjust the size of the logo as needed
          />
          UpNext
        </h1>

        <form
          onSubmit={addTodo}
          className="mb-6 flex flex-col gap-3 lg:flex-row lg:gap-4 lg:items-center"
        >
          <div className="flex gap-3 lg:flex-grow flex-row">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[150px] max-w-[400px]"
            />
            <input
              type="datetime-local"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[150px] max-w-[200px]"
            />
          </div>

          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors duration-200 flex items-center gap-2 self-start lg:self-center mt-3 lg:mt-0"
          >
            <FaPlus /> Add
          </button>
        </form>

        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="mb-3"
            >
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={classNames(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200",
                    {
                      "border-purple-500 bg-purple-500": todo.completed,
                      "border-gray-300": !todo.completed,
                    }
                  )}
                >
                  {todo.completed && <FaCheck className="text-white text-sm" />}
                </button>

                {editingId === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => saveEdit(todo.id)}
                      onKeyPress={(e) => e.key === "Enter" && saveEdit(todo.id)}
                      className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[150px] max-w-[400px]"
                      autoFocus
                    />
                    <input
                      type="datetime-local"
                      value={editDeadline}
                      onChange={(e) => setEditDeadline(e.target.value)}
                      className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[150px] max-w-[200px]"
                    />
                  </>
                ) : (
                  <>
                    <span
                      className={classNames("flex-1", {
                        "line-through text-gray-400": todo.completed,
                      })}
                    >
                      {todo.text}
                    </span>
                    <span className="deadline">
                      <span className="deadline-date">
                        {new Date(todo.deadline).toLocaleDateString("en-GB")}
                      </span>
                      <span className="deadline-time">
                        {new Date(todo.deadline).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </span>
                  </>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(todo)}
                    className="text-gray-500 hover:text-purple-500 transition-colors duration-200"
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {todos.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No todos yet. Add one above!
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
