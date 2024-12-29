import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";

const TaskList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]); // To keep track of selected tasks
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    sortBy: "priority",
    sortOrder: "asc",
  });

  // Fetch tasks from backend
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/tasks/all`,
        {
          params: {
            status: "",
            priority: "",
            sortBy: pagination.sortBy,
            sortOrder: pagination.sortOrder,
            page: pagination.page,
            limit: pagination.limit,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTasks(response.data.tasks);
      setTotalTasks(response.data.totalTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [pagination]);

  // Handle select/unselect task
  const handleTaskSelect = (taskId) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  // Handle task deletion
  const handleDelete = async (id) => {
    console.log("Deleting task with ID:", id);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/tasks/delete-task/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Response from server:", response);
      // Refresh tasks list after deletion
      fetchTasks();
      setSelectedTaskIds([]); // Reset selected tasks
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleSortChange = (sortBy) => {
    setPagination((prev) => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const calculateTotalTime = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInMilliseconds = end - start;
    const totalHours = diffInMilliseconds / (1000 * 60 * 60);
    return totalHours.toFixed(2);
  };

  return (
    <div className="container mx-auto p-4">
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={selectedTask}
        onSave={(updatedTask) => {
          setTasks((prev) =>
            prev.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          );
          setSelectedTask(null);
        }}
      />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task List</h1>
        <div className="flex space-x-2">
          <button
            className="flex items-center bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus className="mr-2" />
            Add Task
          </button>
          <button
            onClick={ handleDelete}
            className="flex items-center bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
            disabled={selectedTaskIds.length === 0}
          >
            <FaTrash className="mr-2" />
            Delete Selected
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Select</th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => handleSortChange("id")}
              >
                Task ID
              </th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => handleSortChange("title")}
              >
                Title
              </th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => handleSortChange("priority")}
              >
                Priority
              </th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => handleSortChange("status")}
              >
                Status
              </th>
              <th className="px-4 py-2 border">Start Time</th>
              <th className="px-4 py-2 border">End Time</th>
              <th className="px-4 py-2 border">Total Time (hrs)</th>
              <th className="px-4 py-2 border">Edit</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">
                    <input
                      type="checkbox"
                      checked={selectedTaskIds.includes(task.task_id)}
                      onChange={() => handleTaskSelect(task.task_id)}
                    />
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {task.task_id}
                  </td>
                  <td className="px-4 py-2 border">{task.title}</td>
                  <td className="px-4 py-2 border text-center">
                    {task.priority}
                  </td>
                  <td
                    className={`px-4 py-2 border text-center ${
                      task.status === "Pending"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {task.status}
                  </td>
                  <td className="px-4 py-2 border">{task.startTime}</td>
                  <td className="px-4 py-2 border">{task.endTime}</td>
                  <td className="px-4 py-2 border text-center">
                    {calculateTotalTime(task.startTime, task.endTime)}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleEditClick(task)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
        >
          Previous
        </button>
        <span>
          Page {pagination.page} of {Math.ceil(totalTasks / pagination.limit)}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page * pagination.limit >= totalTasks}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskList;
