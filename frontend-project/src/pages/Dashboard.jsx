import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTasks = async () => {
    try {

      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      setTasks(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();

    try {

      await axios.post("http://localhost:5000/api/tasks", 
      { title, description },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      setTitle("");
      setDescription("");

      fetchTasks();

    } catch (error) {
      console.log(error);
    }
  };
  const updateTask = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`,
        { status: "completed" },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`,
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        });
        fetchTasks();
    } catch (error) {
        console.log(error);
    }
  };
  useEffect(()=>{
    fetchTasks();
  },[]);
 

  return (
    <div>
      <h2>Dashboard</h2>

      <form onSubmit={createTask}>

        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

        <button type="submit">Create Task</button>

      </form>

      <h3>Your Tasks</h3>

      {tasks.map((task)=>(
        <div key={task._id}>
          <p>{task.title} - {task.status}</p>
            <button onClick={()=>updateTask(task._id)}>Update</button>
          <button onClick={()=>deleteTask(task._id)}>Delete</button>
        </div>
      ))}

    </div>
  );
}

export default Dashboard;
