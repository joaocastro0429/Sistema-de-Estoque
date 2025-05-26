import { Request, Response } from "express";
import * as taskService from '../services/TaskService';

export const getTasksAll = async (req: Request, res: Response) => {
  try {
    const products = await taskService.getTask(); // Obtem os produtos
    res.status(200).json(products); // Envia a resposta ao cliente
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const { title, description, completed, userId } = req.body;

  try {
    const task = await taskService.createTask({ title, description, completed ,userId});
     res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};


// Update Task
export const updateTasks = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, completed, userId } = req.body;

    const updatedTask = await taskService.updateTask(id, { title, description, completed,userId});

    res.status(200).json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: "Error updating task", error: error.message || error });
  }
};

// Delete Task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await taskService.deleteTask(id);

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting task", error: error.message || error });
  }
};
