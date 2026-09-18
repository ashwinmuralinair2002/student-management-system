import type { HydratedDocument } from "mongoose";
import type { StudentDatabaseData } from "../models/student.model.js";

export type StudentDocument = HydratedDocument<StudentDatabaseData>;

export interface CreateStudentData {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface StudentCreateData extends CreateStudentData {
  rollNumber: number;
}

export interface UpdateStudentData
  extends Partial<Pick<CreateStudentData, "name" | "email" | "phoneNumber">> {}

export interface IStudentRepository {
  create(data: StudentCreateData): Promise<StudentDocument>;
  findAll(): Promise<StudentDocument[]>;
  findById(id: string): Promise<StudentDocument | null>;
  update(id: string, data: UpdateStudentData): Promise<StudentDocument | null>;
  delete(id: string): Promise<StudentDocument | null>;
}
