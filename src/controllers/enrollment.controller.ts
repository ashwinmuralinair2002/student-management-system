import type { Request, Response } from "express";
import type {
  CreateEnrollmentData,
  CreateEnrollmentsData,
} from "../interfaces/enrollment.repository.interface.js";
import { EnrollmentService } from "../services/enrollment.service.js";

export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  public async create(
    request: Request<
      Record<string, string>,
      never,
      CreateEnrollmentData | CreateEnrollmentsData
    >,
    response: Response,
  ): Promise<void> {
    try {
      if ("courseIds" in request.body) {
        const enrollments = await this.enrollmentService.enrollStudents(
          request.body,
        );
        response.status(201).json(enrollments);
        return;
      }

      const enrollment = await this.enrollmentService.enrollStudent(request.body);
      response.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(response, error);
      } else {
        response.status(500).json({ message: "Internal server error" });
      }
    }
  }

  public async getByStudent(
    request: Request<{ studentId: string }>,
    response: Response,
  ): Promise<void> {
    try {
      const enrollments = await this.enrollmentService.getEnrollmentsByStudent(
        request.params.studentId,
      );
      response.status(200).json(enrollments);
    } catch (error) {
      if (error instanceof Error) {
        this.sendError(response, error);
      } else {
        response.status(500).json({ message: "Internal server error" });
      }
    }
  }

  public async getByCourse(
    request: Request<{ courseId: string }>,
    response: Response,
  ): Promise<void> {
    try {
      const enrollments = await this.enrollmentService.getEnrollmentsByCourse(
        request.params.courseId,
      );
      response.status(200).json(enrollments);
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
      const enrollment = await this.enrollmentService.removeEnrollment(
        request.params.id,
      );

      if (enrollment === null) {
        response.status(404).json({ message: "Enrollment was not found" });
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
      error.message === "Student was not found" ||
      error.message === "Course was not found"
    ) {
      response.status(404).json({ message: error.message });
      return;
    }

    if (
      error.message === "Student is already enrolled in this course" ||
      error.message === "Course has reached its maximum student capacity" ||
      error.message
        .split("\n")
        .every((message) =>
          message.endsWith(" has reached its maximum student capacity."),
        )
    ) {
      response.status(409).json({ message: error.message });
      return;
    }

    response.status(500).json({ message: "Internal server error" });
  }
}
