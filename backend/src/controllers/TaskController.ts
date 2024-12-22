import type { Request, Response } from 'express';
import Task from '../models/Task';

export class TaskController {

    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body);
            task.project = req.project.id;
            req.project.tasks.push(task.id);
            await Promise.allSettled([task.save(), req.project.save()]);
            res.send('Tarea creada');
        } catch (error) {
            res.status(500).send('Error al crear la tarea: ' + error);
        }
    }

    static getTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({project: req.project.id}).populate('project');
            res.json(tasks);
        } catch (error) {
            res.status(500).send('Error al obtener las tareas del proyecto');
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            res.json(req.task);
        } catch (error) {
            res.status(500).send('Error al obtener la tarea');
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name;
            req.task.description = req.body.description;
            await req.task.save();
            res.send('Tarea actualizada');
        } catch (error) {
            res.status(500).send('Error al obtener la tarea');
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString());
            await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
            res.send('Tarea eliminada');
        } catch (error) {
            res.status(500).send('Error al eliminar la tarea: ' + error);
        }
    }

    static updateTaskStatus = async (req: Request, res: Response) => {
        try {
            req.task.status = req.body.status;
            await req.task.save();
            res.send('Estado de la tarea actualizado');
        } catch (error) {
            res.status(500).send('Error al actualizar el estado de la tarea: ' + error);
        }
    }
}