import type { Request, Response } from 'express';
import Project from '../models/Projects';

export class ProjectController {

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({});
            res.json(projects);
        } catch (error) {
            res.status(500).send('Error al obtener los proyectos');
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        try {
            const project = await Project.findById(req.params.id).populate('tasks');

            if (!project) {
                const error = new Error('Proyecto no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            res.json(project);
        } catch (error) {
            res.status(500).send('Error al obtener los proyectos');
        }
    }

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);
        try {
            await project.save();
            res.send('Proyecto creado');
        } catch (error) {
            res.status(500).send('Error al crear el proyecto: ' + error);
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {
            const project = await Project.findById(req.params.id);
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            project.projectName = req.body.projectName;
            project.clientName = req.body.clientName;
            project.description = req.body.description;
            await project.save();
            res.send('Proyecto actualizado');
        } catch (error) {
            res.status(500).send('Error al obtener los proyectos');
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        try {
            const project = await Project.findById(req.params.id);
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            await project.deleteOne();
            res.send('Proyecto eliminado');
        } catch (error) {
            res.status(500).send('Error al eliminar el proyecto: ' + error);
        }
    }
}