import express from "express"
import cors from "cors"
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/check", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));