import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// GET /api/tasks?projectId=<uuid>&status=<status>  → list tasks, optionally filtered
router.get("/", async (request, response) => {
  const { projectId, status } = request.query;

  const tasks = await prisma.task.findMany({
    where: {
      projectId: projectId ? String(projectId) : undefined,
      status: status ? String(status) : undefined,
     
    },
    orderBy: { createdAt: "desc" },
  });

  response.json(tasks);
});

export default router;
