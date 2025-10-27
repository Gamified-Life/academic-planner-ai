import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const response = await fetch("http://127.0.0.1:8000/tasks/");
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (err) {
      res.status(500).json({ message: "Backend not reachable" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
