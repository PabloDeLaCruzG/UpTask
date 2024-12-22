import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { validateProjectExists } from '../middleware/project';
import { taskBelongsToProject, validateTaskExists } from '../middleware/task';

const router = Router();

router.get('/', ProjectController.getAllProjects);

router.get('/:id', 
    param('id').isMongoId().withMessage('El id del proyecto es invalido'),
    handleInputErrors,
    ProjectController.getProjectById
);

router.post('/', 
    body('projectName')
    .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
    .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
    .notEmpty().withMessage('La descripcion del proyecto es obligatorio'),
    handleInputErrors,
    ProjectController.createProject
);

router.put('/:id', 
    param('id').isMongoId().withMessage('El id del proyecto es invalido'),
    body('projectName')
    .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
    .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
    .notEmpty().withMessage('La descripcion del proyecto es obligatorio'),
    handleInputErrors,
    ProjectController.updateProject
);

router.delete('/:id', 
    param('id').isMongoId().withMessage('El id del proyecto es invalido'),
    handleInputErrors,
    ProjectController.deleteProject
);

/* Routes for Tasks */
router.param('projectId', validateProjectExists);

router.post('/:projectId/tasks',
    body('name')
    .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
    .notEmpty().withMessage('La descripcion de la tarea es obligatorio'),
    handleInputErrors,
    TaskController.createTask
);

router.get('/:projectId/tasks',
    param('projectId').isMongoId().withMessage('El id del proyecto es invalido'),
    handleInputErrors,
    TaskController.getTasks
);

router.param('taskId', validateTaskExists);
router.param('taskId', taskBelongsToProject);

router.get('/:projectId/tasks/:taskId',
    param('projectId').isMongoId().withMessage('El id del proyecto es invalido'),
    param('taskId').isMongoId().withMessage('El id de la tarea es invalido'),
    handleInputErrors,
    TaskController.getTaskById
);

router.put('/:projectId/tasks/:taskId',
    param('projectId').isMongoId().withMessage('El id del proyecto es invalido'),
    param('taskId').isMongoId().withMessage('El id de la tarea es invalido'),
    body('name')
    .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
    .notEmpty().withMessage('La descripcion de la tarea es obligatorio'),
    handleInputErrors,
    TaskController.updateTask
);

router.delete('/:projectId/tasks/:taskId',
    param('projectId').isMongoId().withMessage('El id del proyecto es invalido'),
    param('taskId').isMongoId().withMessage('El id de la tarea es invalido'),
    handleInputErrors,
    TaskController.deleteTask
);

router.post('/:projectId/tasks/:taskId/status',
    param('projectId').isMongoId().withMessage('El id del proyecto es invalido'),
    param('taskId').isMongoId().withMessage('El id de la tarea es invalido'),
    body('status')
    .notEmpty().withMessage('El estado de la tarea es obligatorio'),
    body('status')
    .isIn(['pending', 'onHold', 'inProgress', 'underReview', 'completed'])
    .withMessage('El estado de la tarea es invalido'),
    handleInputErrors,
    TaskController.updateTaskStatus
);

export default router;