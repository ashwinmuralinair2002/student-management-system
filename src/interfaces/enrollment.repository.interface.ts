import type { HydratedDocument } from "mongoose";
import type { EnrollmentDatabaseData } from "../models/enrollment.model.js";

export type EnrollmentDocument = HydratedDocument<EnrollmentDatabaseData>;

export interface CreateEnrollmentData {
  studentId: string;
  courseId: string;
}

export interface CreateEnrollmentsData {
  studentId: string;
  courseIds: string[];
}

export interface IEnrollmentRepository {
  create(data: CreateEnrollmentData): Promise<EnrollmentDocument>;
  findByStudentId(studentId: string): Promise<EnrollmentDocument[]>;
  findByCourseId(courseId: string): Promise<EnrollmentDocument[]>;
  delete(id: string): Promise<EnrollmentDocument | null>;
}
