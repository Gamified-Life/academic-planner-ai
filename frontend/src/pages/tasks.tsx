"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function TasksPage() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  async function fetchTasks() {
    const response = await fetch("/api/getTasks");
    const data = await response.json();
    setTasks(data);
  }

  async function fetchUsers() {
    const response = await fetch("/api/getUsers");
    const data = await response.json();
    setUsers(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch("/api/addTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, due_date: dueDate, owner_id: parseInt(ownerId) }),
      });

      if (!response.ok) throw new Error("Failed to add task");
      const data = await response.json();

      setMessage(`✅ Task "${data.title}" added!`);
      setTitle("");
      setDueDate("");
      setOwnerId("");
      fetchTasks();
    } catch (err) {
      setMessage("❌ Error adding task");
    }
  }

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Tasks</h2>

      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="mb-4 space-x-2">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border p-2"
        />
        <select
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
          className="border p-2"
        >
          <option value="">-- Select User --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
        <button type="submit" className="bg-green-500 text-white px-4 py-2">
          Add Task
        </button>
      </form>

      {message && <p>{message}</p>}

      {/* Task List */}
      <h3 className="text-xl mb-2">All Tasks</h3>
      <ul>
        {tasks.map((task, i) => (
          <li key={i}>
            {task.title} (Due: {task.due_date || "No date"}) - User ID: {task.owner_id}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
