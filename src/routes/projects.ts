import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

////Get lists of projects
router.get("/", async (request, response) => {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
  response.json(projects);
});

// Get one project with its tasks

router.get("/:id", async (request, response) => {
  const { id } = request.params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { tasks: true },
  });
    if (!project) {
    return response.status(404).json({ errorMessage: "Project not found" });
  }
  response.json(project);
});

//Create a Project

router.post("/", async (request, response) => {
  const { name, description } = request.body ?? {};

  if (!name) {
    return response.status(400).json({ errorMessage: "Name is required" });
  }

  const project = await prisma.project.create({
    data: { name, description },
  });
  response.status(201).json(project);
});


//Delete Project by their id
router.delete("/:id", async (request, response) => {
  const { id } = request.params;

  try {
    await prisma.project.delete({ where: { id } });
    return response.status(204).send();
  } catch (error: any) {
    if (error?.code === "P2025") {
      return response.status(404).json({ errorMessage: "Project not found" });
    }
    response.status(500).json({ errorMessage: "Something went wrong" });
  }
});

//Update a project using their Id

router.put("/:id", async (request, response) => {
  const { id } = request.params;
  const { name, description } = request.body ?? {};

  try {
    const project = await prisma.project.update({
      where: { id },
      data: { name, description },
    });
    response.json(project);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return response.status(404).json({ errorMessage: "Project not found" });
    }
    response.status(500).json({ errorMessage: "Something went wrong" });
  }
});

export default router;