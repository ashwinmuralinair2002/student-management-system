import { Router } from "express";
import { StudentController } from "../controllers/student.controller.js";

export function createStudentRoutes(controller: StudentController): Router {
  const router = Router();

  router.post("/", controller.create.bind(controller));
  router.get("/", controller.getAll.bind(controller));
  router.get("/:id", controller.getById.bind(controller));
  router.patch("/:id", controller.update.bind(controller));
  router.delete("/:id", controller.delete.bind(controller));

  return router;
}
