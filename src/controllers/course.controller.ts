import type { Request, Response } from "express";
import type {
  CreateCourseData,
  UpdateCourseData,
} from "../interfaces/course.repository.interface.js";
import { CourseService } from "../services/course.service.js";

export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  public async create(
    request: Request<Record<string, string>, never, CreateCourseData>,
    response: Response,
  ): Promise<void> {
    try {
      const course = await this.courseService.createCourse(request.body);
      response.status(201).json(course);
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(response, error);
      } else {
        response.status(500).json({ message: "Internal server error" });
      }
    }
  }

  public async getAll(_request: Request, response: Response): Promise<void> {
    try {
      const courses = await this.courseService.getAllCourses();
      response.status(200).json(courses);
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(response, error);
      } else {
        response.status(500).json({ message: "Internal server error" });
      }
    }
  }

  public async getById(
    request: Request<{ id: string }>,
    response: Response,
  ): Promise<void> {
    try {
      const course = await this.courseService.getCourseById(request.params.id);

      if (course === null) {
        response.status(404).json({ message: "Course was not found" });
        return;
      }

      response.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(response, error);
      } else {
        response.status(500).json({ message: "Internal server error" });
      }
    }
  }

  public async update(
    request: Request<{ id: string }, never, UpdateCourseData>,
    response: Response,
  ): Promise<void> {
    try {
      const course = await this.courseService.updateCourse(
        request.params.id,
        request.body,
      );

      if (course === null) {
        response.status(404).json({ message: "Course was not found" });
        return;
      }

      response.status(200).json(course);
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(response, error);
      } else {
        response.status(500).json({ message: "Internal server error" });
      }
    }
  }

  public async delete(
    request: Request<{ id: string }>,
    response: Response,
  ): Promise<void> {
    try {
      const course = await this.courseService.deleteCourse(request.params.id);

      if (course === null) {
        response.status(404).json({ message: "Course was not found" });
        return;
      }

      response.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(response, error);
      } else {
        response.status(500).json({ message: "Internal server error" });
      }
    }
  }

  private sendError(response: Response, error: Error): void {
    if (
      error.message === "Course code is required" ||
      error.message === "Course code must be exactly 6 alphanumeric characters." ||
      error.message === "Course title is required" ||
      error.message === "Maximum students must be greater than zero" ||
      error.message.includes(
        " cannot have a maximum capacity below its current enrollment of ",
      )
    ) {
      response.status(400).json({ message: error.message });
      return;
    }

    if (
      error.message === "A course with this code already exists." ||
      error.message === "A course with this name already exists."
    ) {
      response.status(409).json({ message: error.message });
      return;
    }

    const databaseError = error as Error & {
      code?: number;
      keyPattern?: Record<string, number>;
    };

    if (databaseError.code === 11000) {
      const message = databaseError.keyPattern?.code
        ? "A course with this code already exists."
        : "A course with this name already exists.";
      response.status(409).json({ message });
      return;
    }

    response.status(500).json({ message: "Internal server error" });
  }
}
