import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        try {
            const res= await axios.get("http://localhost:5000/api/tasks", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setTasks(res.data);
        } catch (error) {
            console.log("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);
    return (
        <div>
            <h2>Dashboard</h2>
            {tasks.map((task) => (
                <div key={task._id}>
                    <h3>{task.title}-{task.status}</h3>
                    
                </div>
            ))}
        </div>
    );
}

export default Dashboard;

