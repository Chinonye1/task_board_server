import express from "express";
import cors from "cors";
import "dotenv/config";
import tasksRouter from "./routes/tasks";
import projectsRouter from "./routes/projects"; 

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/check", (_req, res) => res.json({ ok: true }));
app.use("/api/tasks", tasksRouter);
app.use("/api/projects", projectsRouter); 

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));
