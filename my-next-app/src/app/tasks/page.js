"use client";

import { useState, useEffect } from "react";
import { FaCalendarAlt, FaCheck, FaClock, FaEdit, FaFlag, FaTasks, FaTrash } from "react-icons/fa"; // Assuming you're using react-icons for edit/delete

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ content: "", description: "", priority: 0, labels: [''], due_date: "" });
  const [editingTask, setEditingTask] = useState();
  const [isListening, setIsListening] = useState(false);
  const [isVoiceTask, setIsVoiceTask] = useState(false); // New state to track voice task
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [completedTasks, setCompletedTasks] = useState([]); // Completed tasks
  const [completedTasksShow, setCompletedTasksShow] = useState([]); // Completed tasks
  const [tab, setTab] = useState("active");
  // Fetch tasks from FastAPI
  // Fetch tasks based on the current tab
  useEffect(() => {
    // Define a single fetch function to manage both active and completed tasks
    const fetchTasksData = async () => {
      const url =
        tab === "active"
          ? "http://127.0.0.1:5000/api/tasks/list" // Active tasks
          : "http://127.0.0.1:5000/api/tasks/completed-tasks"; // Completed tasks (updated URL)

      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          if (tab === "active") {
            setTasks(data); // Update active tasks
          } else {
            setCompletedTasksShow(data.items); // Update completed tasks
          }
        } else {
          console.error(`Failed to fetch ${tab} tasks`);
        }
      } catch (error) {
        console.error(`Error fetching ${tab} tasks:`, error);
      }
    };

    fetchTasksData(); // Call the fetch function
  }, [tab]); // Dependency array is only `tab`, ensuring size and order remain constant



  // Add a new task (typed)
  const handleAddTask = async () => {

    if (newTask.content) {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/tasks/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask),
        });

        if (response.ok) {
          console.log(response);
          const addedTask = await response.json();
          console.log(addedTask);
          setTasks((prev) => [...prev, addedTask.task]);
          setNewTask({ content: "", description: "", priority: 0, labels: [''], due_date: "" });
        } else {
          console.error("Failed to add task:", response.status);
          alert("Failed to add task.");
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    } else {
      alert("Please fill in all fields.");
    } setIsModalOpen(false);
  };

 


  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/tasks/${id}`, {  // Use backticks for template literal
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      } else {
        alert("Failed to delete task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
    setIsModalOpen(false);
  };

  const handleUpdateTask = async () => {
    if (editingTask && editingTask.content) {
      try {
        const payload = { content: editingTask.content };

        // Ensure the correct task_id is being used
        const taskId = editingTask.id;

        // Use backticks for string interpolation
        const response = await fetch(`http://127.0.0.1:5000/api/tasks/edit/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const updatedTask = await response.json();

          // Log the updated task for debugging
          console.log("Updated task:", updatedTask);

          // Update the tasks state with the correct task
          setTasks((prev) =>
            prev.map((task) =>
              task.id === updatedTask.task.id // Use strict equality (===) to compare IDs
                ? { ...task, content: updatedTask.task.content }
                : task
            )
          );

          setEditingTask(null); // Clear editing state after update
        } else {
          const errorText = await response.text();
          console.error("Failed to update task:", errorText);
          alert("Failed to update task.");
        }
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
    setIsModalOpen(false);
  };


  // Mark task as completed
  // const handleCompleteTask = async (taskId) => {
  //   console.log("Task ID:", taskId);
  //   try {
  //     // API call to mark the task as completed
  //     const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}/close`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     console.log(response);
  //     if (response.ok) {
  //       // Find and remove the task from tasks
  //       setTasks((prevTasks) => {
  //         const taskToComplete = prevTasks.find((task) => task.id === taskId);

  //         if (!taskToComplete) {
  //           console.error(`Task with ID ${taskId} not found.`);
  //           return prevTasks;
  //         }

  //         // Update the completedTasks list without duplicates
  //         setCompletedTasks((prevCompletedTasks) => {
  //           // Check if the task is already in the list
  //           console.log(completedTasks);
  //           const isAlreadyCompleted = prevCompletedTasks.some((task) => task.id === taskId);
  //           console.log(isAlreadyCompleted);
  //           if (isAlreadyCompleted) {
  //             console.warn(`Task with ID ${taskId} is already in the completedTasks list.`);
  //             return prevCompletedTasks;
  //           }
  //           return [...prevCompletedTasks, { ...taskToComplete, completed: true }];
  //         });

  //         // Remove the task from the current task list
  //         return prevTasks.filter((task) => task.id !== taskId);
  //       });
  //     } else {
  //       console.error("Failed to complete task:", response.status);
  //       alert("Failed to mark task as completed.");
  //     }
  //   } catch (error) {
  //     console.error("Error marking task as completed:", error);
  //   }
  // };

  const handleCompleteTask = async (taskId) => {
    console.log("Task ID:", taskId);
  
    try {
      if (tab === "active") {
        // API call to mark the task as completed
        const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}/close`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        });
  
        if (response.ok) {
          // Move task from active to completed
          setTasks((prevTasks) => {
            const taskToComplete = prevTasks.find((task) => task.id === taskId);
            if (!taskToComplete) {
              console.error(`Task with ID ${taskId} not found in active tasks.`);
              return prevTasks;
            }
  
            setCompletedTasks((prevCompletedTasks) => [
              ...prevCompletedTasks,
              { ...taskToComplete, completed: true },
            ]);
  
            return prevTasks.filter((task) => task.id !== taskId);
          });
        } else {
          console.error("Failed to mark task as completed:", response.status);
        }
      } else if (tab === "completed") {
        // API call to reopen task
        const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}/reopen`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        });
  
        if (response.ok) {
          // Move task from completed to active
          setCompletedTasks((prevCompletedTasks) => {
            const taskToReopen = prevCompletedTasks.find((task) => task.task_id === taskId);
            if (!taskToReopen) {
              console.error(`Task with ID ${taskId} not found in completed tasks.`);
              return prevCompletedTasks;
            }
  
            // Add reopened task to active tasks
            setTasks((prevTasks) => [
              ...prevTasks,
              { ...taskToReopen, completed: false },
            ]);
  
            // Remove the task from completed tasks
            return prevCompletedTasks.filter((task) => task.task_id !== taskId);
          });
        } else {
          console.error("Failed to reopen task:", response.status);
        }
      }
    } catch (error) {
      console.error("Error updating task state:", error);
    }
  };
  


  const handleEditClick = (task) => {
    setEditingTask(task); // Set the task to edit
    setIsModalOpen(true); // Open the modal
  };



   // Add a new task (voice)
   const handleAddVoiceTask = async (transcription) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/tasks/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription }),
      });
  
      const responseData = await response.json();
      console.log("API Response:", responseData); // Debugging: Log the API response
  
      if (response.ok) {
        if (responseData.task) {
          const { content, description, priority, labels, due_date } = responseData.task;
          setNewTask({
            content: content || "",
            description: description || "",
            priority: priority || 1,
            labels: labels || ["general"],
            due_date: due_date || "",
          });
          console.log(`Task '${content}' added successfully!`);
        } else {
          console.log("Failed to create a task. Please check your transcription.");
        }
      } else {
        console.error("API Error:", responseData.detail);
        alert(`Error: ${responseData.detail}`);
      }
    } catch (error) {
      console.error("Error processing transcription:", error); // Debugging: Log the error
      alert("An error occurred while processing the voice input. Please try again.");
    }
  };
  
  

  // Speech Recognition for Voice Input
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition. Try using Chrome.");
      return;
    }
  
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
  
    recognition.onstart = () => {
      setIsListening(true);
      console.log("Speech recognition started");
    };
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log("Voice input:", transcript);
  
      if (transcript) {
        // Pass the transcript to the `handleAddVoiceTask` function
        handleAddVoiceTask(transcript);
      } else {
        alert("No voice input detected. Please try again.");
      }
    };
  
    recognition.onend = () => {
      setIsListening(false);
      console.log("Speech recognition ended");
    };
  
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
  
    recognition.start();
  };
  

  return (
    <div className="flex flex-col bg-black min-h-screen text-light ml-[20%]">
      {/* Header */}
      <header className="text-center p-16 flex justify-between">
        <div>
          <h1 className="text-neonPink text-5xl font-extrabold glowing-text">
            Task Management
          </h1>
          <p className="text-gray-300 text-lg m-4 text-left">
            Manage your tasks effectively.
          </p>
        </div>
        <div>
          {/* Button stays at the bottom */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-neonBlue text-black font-bold rounded-lg shadow-neon hover:bg-neonPink hover:shadow-neonPink transition-transform hover:scale-110 ml-auto"
          >
             Add New Task
          </button>
        </div>
      </header>



      {/* Task List */}
      {/* Task List Section */}
      <section className="w-full p-6">
        {/* Tabs for Active/Completed Tasks */}
        <div className="flex space-x-8 mb-4 border-b-2 border-gray-600">
          <button
            onClick={() => setTab("active")}
            className={`text-lg font-semibold py-2 px-4 ${tab === "active" ? "text-neonPink border-b-2 border-neonPink" : "text-gray-300"
              }`}
          >
            Active Tasks
          </button>
          <button
            onClick={() => setTab("completed")}
            className={`text-lg font-semibold py-2 px-4 ${tab === "completed" ? "text-neonPink border-b-2 border-neonPink" : "text-gray-300"
              }`}
          >
            Completed Tasks
          </button>
        </div>

        {/* Task List */}
        <div className="max-w-screen-lg mx-auto">
          {/* Render Tasks based on selected tab */}
          <ul className="mt-6 space-y-4">
  {(tab === "active" ? tasks : completedTasksShow)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by created_at (newest first)
    .map((task, index) => (
      <li
        key={index}
        className={`bg-gray-800 p-4 rounded-xl flex items-center justify-between group shadow-md hover:shadow-lg transition-shadow ${
          tab === "completed" && task.completed ? "bg-green-700" : ""
        }`}
      >
        {/* Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={tab === "completed"} // Checkbox checked state depends on tab
              onChange={() =>
    handleCompleteTask(tab === "completed" ? task.task_id : task.id)
  }
            className={`w-6 h-6 rounded-full border-2 appearance-none 
              ${
                tab === "completed"
                  ? "bg-green-300 border-green-500" // Green circle for completed tab
                  : "bg-white border-gray-500" // Default for other tabs
              } focus:outline-none  
              checked:bg-green-500 checked:ring-2 checked:ring-green-300 
            `}
          />
        </div>

        {/* Task Content */}
        <div className="flex flex-col flex-1 ml-4">
          {/* Task Title */}
          <h3
            className={`text-neonPink text-lg font-semibold ${
              task.completed ? "line-through" : ""
            } capitalize`}
          >
            {task.content}
          </h3>

          {/* Show only "Completed at" in the completed tab */}
          {tab === "completed" && (
            <p className="text-gray-400 text-sm mt-1">
              Completed at:{" "}
              {task.completed_at
                ? new Date(task.completed_at).toLocaleDateString()
                : "Unknown"}
            </p>
          )}

          {/* Show extra details in the active tab */}
          {tab === "active" && (
            <>
              {/* Created At */}
              <p className="text-gray-400 text-sm mt-1">
                Created at:{" "}
                {task.created_at
                  ? new Date(task.created_at).toLocaleDateString()
                  : "Unknown"}
              </p>

              {/* Task Details */}
              <div className="flex items-center mt-2 space-x-4 text-gray-400 text-sm">
                {/* Priority */}
                <div className="flex items-center">
                  <FaFlag className="text-yellow-500 mr-2" />
                  <span
                    className={`px-2 py-1 rounded-full font-medium ${
                      task.priority === 4
                        ? "bg-red-700 text-white"
                        : task.priority === 3
                        ? "bg-red-500 text-white"
                        : task.priority === 2
                        ? "bg-yellow-500 text-black"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {task.priority === 4
                      ? "Highest"
                      : task.priority === 3
                      ? "High"
                      : task.priority === 2
                      ? "Medium"
                      : "Low"}
                  </span>
                </div>

                {/* Due Date */}
                <div className="flex items-center">
                  <FaCalendarAlt className="text-blue-500 mr-2" />
                  {task.due?.string ? (
                    <span>{new Date(task.due.date).toLocaleDateString()}</span>
                  ) : (
                    "No due date"
                  )}
                </div>

                {/* Progress */}
                <div className="flex items-center">
                  <FaTasks className="text-green-500 mr-2" />
                  <span>{task.progress || "In Progress"}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons - Only show in the active tab */}
        {tab === "active" && (
          <div className="flex gap-4 ml-4">
            <button
              onClick={() => handleEditClick(task)}
              className="p-2 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <FaEdit className="text-white" />
            </button>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaTrash className="text-white" />
            </button>
          </div>
        )}
      </li>
    ))}
</ul>


        </div>
      </section>


      {/* Add/Edit Task Form */}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg">
            {/* Modal Header */}
            <section className="w-full py-16 px-6">
              <div className="max-w-screen-lg mx-auto text-center">
                <div className="flex justify-between items-center">
                  <h2 className="text-neonPurple text-3xl font-extrabold glowing-text">
                    {editingTask ? "Edit Task" : "Add New Task"}
                  </h2>
                  {/* Close Button */}
                  <button
                    onClick={() => setIsModalOpen(false)} // This will close the modal
                    className="text-white text-2xl hover:text-red-500"
                    title="Close Modal"
                  >
                    &times;
                  </button>
                </div>
                <div className="flex flex-col mt-6 gap-4 relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Task Content"
                      value={editingTask ? editingTask.content : newTask.content}
                      onChange={(e) =>
                        editingTask
                          ? setEditingTask({ ...editingTask, content: e.target.value })
                          : setNewTask({ ...newTask, content: e.target.value })
                      }
                      className="p-3 rounded bg-gray-800 text-gray-200 w-full pr-12" // Add padding to the right for the button
                    />
                    <button
                      onClick={startListening}
                      disabled={isListening}
                      className={`absolute top-1/2 right-3 transform -translate-y-1/2 text-black bg-transparent ${isListening
                        ? "text-gray-500 cursor-not-allowed"
                        : "hover:text-neonPink transition-transform transform hover:scale-110"
                        }`}
                      title={isListening ? "Listening..." : "Start Voice Input"}
                    >
                      {isListening ? (
                        <span className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v8m0 0c1.657 0 3 1.343 3 3m-6 0a3 3 0 006 0m0 0v2a3 3 0 01-6 0v-2m0 0H6m6 0h6"
                            />
                          </svg>
                          <span className="text-sm font-bold">Listening...</span>
                        </span>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6V18M8 10V18M12 4V18M16 8V18M20 6V18"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Add Description"
                    value={editingTask ? editingTask.description : newTask.description}
                    onChange={(e) =>
                      editingTask
                        ? setEditingTask({ ...editingTask, description: e.target.value })
                        : setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="p-3 rounded bg-gray-800 text-gray-200 w-full pr-12" // Add padding to the right for the button
                  />

                  <select
                    value={editingTask ? editingTask.priority : newTask.priority || ""}
                    onChange={(e) =>
                      editingTask
                        ? setEditingTask({ ...editingTask, priority: Number(e.target.value) })
                        : setNewTask({ ...newTask, priority: Number(e.target.value) })
                    }
                    className="p-3 rounded bg-gray-800 text-gray-200 w-full"
                  >
                    <option value="" disabled>
                      Select Priority
                    </option>
                    <option value="1">Priority 1</option>
                    <option value="2">Priority 2</option>
                    <option value="3">Priority 3</option>
                    <option value="4">Priority 4</option>
                  </select>

                  <select
                    value={(editingTask && editingTask.labels && editingTask.labels[0]) || (newTask.labels && newTask.labels[0]) || ""}
                    onChange={(e) => {
                      const selectedLabel = e.target.value; // Get the selected value

                      if (editingTask) {
                        setEditingTask({ ...editingTask, labels: [selectedLabel] }); // Update the array with a single value
                      } else {
                        setNewTask({ ...newTask, labels: [selectedLabel] }); // Update the array with a single value
                      }
                    }}
                    className="p-3 rounded bg-gray-800 text-gray-200 w-full"
                  >
                    <option value="" disabled>
                      Label
                    </option>
                    <option value="email">Email</option>
                    <option value="calendar">Calendar</option>
                  </select>

                  {/* Due Date */}
                  <input
                    type="date"
                    value={editingTask ? editingTask.due_date : newTask.due_date}
                    onChange={(e) =>
                      editingTask
                        ? setEditingTask({ ...editingTask, due_date: e.target.value })
                        : setNewTask({ ...newTask, due_date: e.target.value })
                    }
                    className=" p-2 rounded-lg bg-gray-800 text-white border-2 border-neonPink focus:outline-none"
                  />

                  {/* Add/Update Task Button */}
                  <button
                    onClick={editingTask ? handleUpdateTask : isVoiceTask ? handleAddVoiceTask : handleAddTask}
                    className="px-8 py-3 bg-neonBlue text-black font-bold rounded-lg shadow-neon hover:bg-neonPink hover:shadow-neonPink transition-transform transform hover:scale-110"
                  >
                    {editingTask ? "Update Task" : isVoiceTask ? "Add Voice Task" : "Add Task"}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

    </div>
  );
} 