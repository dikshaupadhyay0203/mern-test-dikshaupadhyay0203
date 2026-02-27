import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("pending");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        { title, description },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const saveUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        {
          title: editTitle,
          description: editDescription,
          status: editStatus,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      setEditingTask(null);
      setEditTitle("");
      setEditDescription("");
      setEditStatus("pending");
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const startEdit = (task) => {
    setEditingTask(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status || "pending");
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks();
  }, [navigate]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <button className="btn-secondary" type="button" onClick={logout}>Logout</button>
      </div>

      <form className="task-form" onSubmit={createTask}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button className="btn-primary" type="submit">Create Task</button>
      </form>

      <h3>Your Tasks</h3>

      <div className="task-list">
      {tasks.map((task) => (
        <div className="task-card" key={task._id}>
          {editingTask === task._id ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />

              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="pending">pending</option>
                <option value="in progress">in progress</option>
                <option value="completed">completed</option>
              </select>

              <button className="btn-primary" type="button" onClick={() => saveUpdate(task._id)}>Save</button>
            </>
          ) : (
            <>
              <p className="task-title">
                {task.title} - {task.status}
              </p>
              <p className="task-description">{task.description}</p>
              <div className="task-actions">
                <button className="btn-secondary" type="button" onClick={() => startEdit(task)}>Edit</button>
                <button className="btn-danger" type="button" onClick={() => deleteTask(task._id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
      </div>
      </div>
    </div>
  );
}

export default Dashboard;
