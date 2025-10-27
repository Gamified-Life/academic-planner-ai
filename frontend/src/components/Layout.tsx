"use client";

import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-6 py-3 flex justify-between">
        <h1 className="text-lg font-bold">Academic Planner AI</h1>
        <div className="flex gap-4">
          <Link href="/users" className="hover:underline">Users</Link>
          <Link href="/tasks" className="hover:underline">Tasks</Link>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
