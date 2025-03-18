import { Router } from "../deps.ts";
import { corsMiddleware } from "../middleware/cors.ts";
import { authMiddleware } from "../middleware/auth.middlware.ts";
import { getTasks, addTask, updateTask, deleteTask } from "../controllers/tasks.controller.ts";

const tasksRoutes = new Router({ prefix: "/api/tasks" });

tasksRoutes.use(corsMiddleware);
tasksRoutes.use(authMiddleware);

tasksRoutes.get("/", getTasks); 
tasksRoutes.post("/", addTask);
tasksRoutes.put("/:id", updateTask);
tasksRoutes.delete("/:id", deleteTask);

export default tasksRoutes;
