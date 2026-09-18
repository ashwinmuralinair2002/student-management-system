import { Router } from "express";
import { EnrollmentController } from "../controllers/enrollment.controller.js";

export function createEnrollmentRoutes(
  controller: EnrollmentController,
): Router {
  const router = Router();

  router.post("/", controller.create.bind(controller));
  router.get("/student/:studentId", controller.getByStudent.bind(controller));
  router.get("/course/:courseId", controller.getByCourse.bind(controller));
  router.delete("/:id", controller.delete.bind(controller));

  return router;
}
