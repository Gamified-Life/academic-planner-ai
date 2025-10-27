"use client";
import { useEffect, useState } from "react";

export default function PlannerPage() {
  // --- User states ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [userMsg, setUserMsg] = useState("");

  // --- Task states ---
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskMsg, setTaskMsg] = useState("");

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // ✅ Load users & tasks on page load
  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  // --- Fetch Users ---
  async function fetchUsers() {
    try {
      const res = await fetch("/api/getUsers");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  }

  // --- Fetch Tasks ---
  async function fetchTasks() {
    try {
      const res = await fetch("/api/getTasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoadingTasks(false);
    }
  }

  // --- Add User ---
  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) throw new Error("Failed to add user");
      const data = await res.json();

      setUserMsg(`✅ User ${data.name} added!`);
      setName("");
      setEmail("");
      fetchUsers();
    } catch (err) {
      setUserMsg("❌ Error adding user");
    }
  }

  // --- Add Task ---
  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/addTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          due_date: dueDate, 
          owner_id: parseInt(ownerId) 
        }),
      });

      if (!res.ok) throw new Error("Failed to add task");
      const data = await res.json();

      setTaskMsg(`✅ Task "${data.title}" added!`);
      setTitle("");
      setDueDate("");
      setOwnerId("");
      fetchTasks();
    } catch (err) {
      setTaskMsg("❌ Error adding task");
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
      
      {/* --- User Section --- */}
      <div>
        <h1>👤 User Management</h1>
        <form onSubmit={handleAddUser}>
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Add User</button>
        </form>
        {userMsg && <p>{userMsg}</p>}

        <h2>Current Users</h2>
        {loadingUsers ? <p>Loading users...</p> : (
          <ul>
            {users.length > 0 ? (
              users.map((u) => (
                <li key={u.id}>
                  {u.name} ({u.email})
                </li>
              ))
            ) : (
              <p>No users found.</p>
            )}
          </ul>
        )}
      </div>

      {/* --- Task Section --- */}
      <div>
        <h1>📋 Task Management</h1>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
            <option value="">-- Select User --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          <button type="submit">Add Task</button>
        </form>
        {taskMsg && <p>{taskMsg}</p>}

        <h2>All Tasks</h2>
        {loadingTasks ? <p>Loading tasks...</p> : (
          <ul>
            {tasks.length > 0 ? (
              tasks.map((t) => (
                <li key={t.id}>
                  {t.title} (Due: {t.due_date || "No date"}) — Owner: {t.owner_id}
                </li>
              ))
            ) : (
              <p>No tasks found.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
