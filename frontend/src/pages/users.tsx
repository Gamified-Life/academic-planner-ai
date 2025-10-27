"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function UsersPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users when page loads
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch("/api/getUsers");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch("/api/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) throw new Error("Failed to add user");
      const data = await response.json();

      setMessage(`✅ User ${data.name} added successfully!`);
      setName("");
      setEmail("");

      fetchUsers();
    } catch (err) {
      setMessage("❌ Error adding user");
    }
  }

  if (loading) return <Layout><p>Loading users...</p></Layout>;

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Users</h2>

      {/* Add User Form */}
      <form onSubmit={handleSubmit} className="mb-4 space-x-2">
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Add User
        </button>
      </form>

      {message && <p>{message}</p>}

      {/* User List */}
      <h3 className="text-xl mb-2">Current Users</h3>
      <ul>
        {users.length > 0 ? (
          users.map((user, i) => (
            <li key={i}>
              {user.name} ({user.email})
            </li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>
    </Layout>
  );
}

