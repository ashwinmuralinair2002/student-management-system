import { Router } from "express";
import { CourseController } from "../controllers/course.controller.js";

export function createCourseRoutes(controller: CourseController): Router {
  const router = Router();

  router.post("/", controller.create.bind(controller));
  router.get("/", controller.getAll.bind(controller));
  router.get("/:id", controller.getById.bind(controller));
  router.patch("/:id", controller.update.bind(controller));
  router.delete("/:id", controller.delete.bind(controller));

  return router;
}
