import type { Request, Response } from "express";
import type {
  CreateStudentData,
  UpdateStudentData,
} from "../interfaces/student.repository.interface.js";
import { StudentService } from "../services/student.service.js";

export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  public async create(
    request: Request<Record<string, string>, never, CreateStudentData>,
    response: Response,
  ): Promise<void> {
    try {
      const student = await this.studentService.createStudent(request.body);
      response.status(201).json(student);
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
      const students = await this.studentService.getAllStudents();
      response.status(200).json(students);
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
      const student = await this.studentService.getStudentById(request.params.id);

      if (student === null) {
        response.status(404).json({ message: "Student was not found" });
        return;
      }

      response.status(200).json(student);
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(response, error);
      } else {
        response.status(500).json({ message: "Internal server error" });
      }
    }
  }

  public async update(
    request: Request<{ id: string }, never, UpdateStudentData>,
    response: Response,
  ): Promise<void> {
    try {
      const student = await this.studentService.updateStudent(
        request.params.id,
        request.body,
      );

      if (student === null) {
        response.status(404).json({ message: "Student was not found" });
        return;
      }

      response.status(200).json(student);
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
      const student = await this.studentService.deleteStudent(request.params.id);

      if (student === null) {
        response.status(404).json({ message: "Student was not found" });
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
      error.message === "A student with this email already exists" ||
      error.message === "A student with this phone number already exists"
    ) {
      response.status(409).json({ message: error.message });
      return;
    }

    if (error.message.includes("email_1")) {
      response.status(409).json({
        message: "A student with this email already exists",
      });
      return;
    }

    if (error.message.includes("phoneNumber_1")) {
      response.status(409).json({
        message: "A student with this phone number already exists",
      });
      return;
    }

    if (
      error.message === "Student name is required" ||
      error.message === "Student email is not valid" ||
      error.message === "Phone number is required" ||
      error.message === "Phone number is not valid"
    ) {
      response.status(400).json({ message: error.message });
      return;
    }

    response.status(500).json({ message: "Internal server error" });
  }
}
