import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

//Get lists of tasks

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

//Create task

router.post("/", async (request, response) => {
  const { title, description, status, dueDate, projectId } = request.body;

  if (!title || !projectId) {
    return response
      .status(400)
      .json({ errorMessage: "Title and ProjectId are required" });
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      projectId,
    },
  });
  response.status(201).json(task);
});

//Get tasks by their id

router.get("/:id", async (request, response) => {
  const { id } = request.params;

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    return response.status(404).json({ errorMessage: "Task not found" });
  }
  response.json(task);
});

//Update tasks by their id

router.put("/:id", async (request, response) => {
  const { id } = request.params;
  const { title, description, status, dueDate, projectId } = request.body;

  const task = await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      status,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      projectId,
    },
  });
  response.json(task);
});

//Delete tasks by their id
router.delete("/:id", async (request, response) => {
  const { id } = request.params;

  await prisma.task.delete({ where: { id } });

  return response.status(204).send();
});

export default router;
