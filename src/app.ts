import express from "express";
import { connectDatabase } from "./config/database.js";
import { CourseController } from "./controllers/course.controller.js";
import { EnrollmentController } from "./controllers/enrollment.controller.js";
import { StudentController } from "./controllers/student.controller.js";
import { CounterRepository } from "./repositories/counter.repository.js";
import { CourseRepository } from "./repositories/course.repository.js";
import { EnrollmentRepository } from "./repositories/enrollment.repository.js";
import { StudentRepository } from "./repositories/student.repository.js";
import { createCourseRoutes } from "./routes/course.routes.js";
import { createEnrollmentRoutes } from "./routes/enrollment.routes.js";
import { createStudentRoutes } from "./routes/student.routes.js";
import { CourseService } from "./services/course.service.js";
import { EnrollmentService } from "./services/enrollment.service.js";
import { StudentService } from "./services/student.service.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

const studentRepository = new StudentRepository();
const counterRepository = new CounterRepository();
const courseRepository = new CourseRepository();
const enrollmentRepository = new EnrollmentRepository();

const studentService = new StudentService(studentRepository, counterRepository);
const courseService = new CourseService(courseRepository, enrollmentRepository);
const enrollmentService = new EnrollmentService(
  enrollmentRepository,
  studentRepository,
  courseRepository,
);

const studentController = new StudentController(studentService);
const courseController = new CourseController(courseService);
const enrollmentController = new EnrollmentController(enrollmentService);

app.get("/", (_request, response) => {
  response.send("Student Management System API is running");
});

app.use("/student-management", express.static("public"));
app.use(
  "/vendor/sweetalert2",
  express.static("node_modules/sweetalert2/dist"),
);
app.use("/students", createStudentRoutes(studentController));
app.use("/courses", createCourseRoutes(courseController));
app.use("/enrollments", createEnrollmentRoutes(enrollmentController));

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch {
    console.error("Could not start the application");
    process.exit(1);
  }
}

void startServer();
