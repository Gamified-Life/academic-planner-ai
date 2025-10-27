// frontend/src/pages/api/test.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Call the FastAPI backend (health endpoint)
    const response = await fetch("http://127.0.0.1:8000/health");

    if (!response.ok) {
      throw new Error(`FastAPI returned status ${response.status}`);
    }

    const data = await response.json();

    // Forward FastAPI response to frontend
    res.status(200).json({
      success: true,
      backend: data,
    });

  } catch (error) {
    // Handle errors if backend is not reachable
    res.status(500).json({
      success: false,
      message: "Backend not reachable",
      error: String(error),
    });
  }
}
