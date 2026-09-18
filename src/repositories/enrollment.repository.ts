import { Types } from "mongoose";
import type {
  CreateEnrollmentData,
  EnrollmentDocument,
  IEnrollmentRepository,
} from "../interfaces/enrollment.repository.interface.js";
import { EnrollmentModel } from "../models/enrollment.model.js";

export class EnrollmentRepository implements IEnrollmentRepository {
  public async create(data: CreateEnrollmentData): Promise<EnrollmentDocument> {
    return EnrollmentModel.create({
      studentId: new Types.ObjectId(data.studentId),
      courseId: new Types.ObjectId(data.courseId),
      enrolledAt: new Date(),
    });
  }

  public async findByStudentId(
    studentId: string,
  ): Promise<EnrollmentDocument[]> {
    return EnrollmentModel.find({ studentId });
  }

  public async findByCourseId(courseId: string): Promise<EnrollmentDocument[]> {
    return EnrollmentModel.find({ courseId });
  }

  public async delete(id: string): Promise<EnrollmentDocument | null> {
    return EnrollmentModel.findByIdAndDelete(id);
  }
}
