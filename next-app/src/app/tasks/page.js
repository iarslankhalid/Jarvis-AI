"use client";

import { useState, useEffect } from "react";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", priority: "", deadline: "" });
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks (mock for now)
  useEffect(() => {
    const mockTasks = [
      { id: 1, title: "Prepare project report", priority: "High", deadline: "2024-12-15" },
      { id: 2, title: "Team meeting notes review", priority: "Medium", deadline: "2024-12-20" },
    ];
    setTasks(mockTasks);
  }, []);

  // Add a new task
  const handleAddTask = () => {
    if (newTask.title && newTask.priority && newTask.deadline) {
      const newId = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
      setTasks([...tasks, { ...newTask, id: newId }]);
      setNewTask({ title: "", priority: "", deadline: "" });
    } else {
      alert("Please fill in all fields.");
    }
  };

  // Update a task
  const handleUpdateTask = () => {
    if (editingTask.title && editingTask.priority && editingTask.deadline) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? { ...task, title: editingTask.title, priority: editingTask.priority, deadline: editingTask.deadline }
            : task
        )
      );
      setEditingTask(null);
    } else {
      alert("Please fill in all fields.");
    }
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="flex flex-col bg-black min-h-screen text-light ml-[20%]">
      {/* Header */}
      <header className="text-center py-16 w-full max-w-screen-lg mx-auto">
        <h1 className="text-neonPink text-6xl font-extrabold glowing-text">Task Management</h1>
        <p className="text-gray-300 text-lg mt-4 max-w-xl mx-auto">
          Manage your tasks effectively.
        </p>
      </header>

      {/* Task List */}
      <section className="w-full py-16 px-6">
        <div className="max-w-screen-lg mx-auto">
          <h2 className="text-neonBlue text-4xl font-bold glowing-text text-center">Your Tasks</h2>
          <ul className="mt-6 space-y-4">
            {tasks.map((task) => (
              <li key={task.id} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-neonPink font-bold">{task.title}</h3>
                <p className="text-gray-300">Priority: {task.priority}</p>
                <p className="text-gray-300">Deadline: {task.deadline}</p>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Add/Update Task Form */}
      <section className="w-full py-16 px-6">
        <div className="max-w-screen-lg mx-auto text-center">
          <h2 className="text-neonPurple text-3xl font-extrabold glowing-text">
            {editingTask ? "Edit Task" : "Add New Task"}
          </h2>
          <div className="flex flex-col mt-6 gap-4">
            <input
              type="text"
              placeholder="Task Title"
              value={editingTask ? editingTask.title : newTask.title}
              onChange={(e) =>
                editingTask
                  ? setEditingTask({ ...editingTask, title: e.target.value })
                  : setNewTask({ ...newTask, title: e.target.value })
              }
              className="p-3 rounded bg-gray-800 text-gray-200"
            />
            <select
              value={editingTask ? editingTask.priority : newTask.priority}
              onChange={(e) =>
                editingTask
                  ? setEditingTask({ ...editingTask, priority: e.target.value })
                  : setNewTask({ ...newTask, priority: e.target.value })
              }
              className="p-3 rounded bg-gray-800 text-gray-200"
            >
              <option value="" disabled>
                Select Priority
              </option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <input
              type="date"
              value={editingTask ? editingTask.deadline : newTask.deadline}
              onChange={(e) =>
                editingTask
                  ? setEditingTask({ ...editingTask, deadline: e.target.value })
                  : setNewTask({ ...newTask, deadline: e.target.value })
              }
              className="p-3 rounded bg-gray-800 text-gray-200"
            />
            <button
              onClick={editingTask ? handleUpdateTask : handleAddTask}
              className="px-8 py-3 bg-neonBlue text-black font-bold rounded-lg shadow-neon hover:bg-neonPink hover:shadow-neonPink transition-transform transform hover:scale-110"
            >
              {editingTask ? "Update Task" : "Add Task"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
