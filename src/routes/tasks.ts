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
  const { title, description, status, priority, dueDate, projectId } =
    request.body ?? {};

  if (!title || !projectId) {
    return response
      .status(400)
      .json({ errorMessage: "Title and ProjectId are required" });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        projectId,
      },
    });
    response.status(201).json(task);
  } catch (error: any) {
    if (error?.code === "P2003") {
      return response.status(400).json({ errorMessage: "Project does not exist" });
    }
    response.status(500).json({ errorMessage: "Something went wrong" });
  }
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
  const { title, description, status, priority, dueDate, projectId } =
    request.body ?? {};

    try {
  const task = await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      projectId,
    },
  });
  response.json(task);
  } catch (error: any) {
    if (error?.code === "P2003") {
      return response.status(400).json({ errorMessage: "Project does not exist" });
    }
    if (error?.code === "P2025") {
      return response.status(404).json({ errorMessage: "Task not found" });
    }
    response.status(500).json({ errorMessage: "Something went wrong" });
  }
});

//Delete tasks by their id
router.delete("/:id", async (request, response) => {
  const { id } = request.params;

  try {
    await prisma.task.delete({ where: { id } });
    return response.status(204).send();
  } catch (error: any) {
    if (error?.code === "P2025") {
      return response.status(404).json({ errorMessage: "Task not found" });
    }
    response.status(500).json({ errorMessage: "Something went wrong" });
  }
});

export default router;
