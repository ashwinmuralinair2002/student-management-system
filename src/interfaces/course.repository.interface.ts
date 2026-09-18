import type { HydratedDocument } from "mongoose";
import type { CourseDatabaseData } from "../models/course.model.js";

export type CourseDocument = HydratedDocument<CourseDatabaseData>;

export interface CreateCourseData {
  code: string;
  title: string;
  maximumStudents: number;
}

export interface UpdateCourseData
  extends Partial<CreateCourseData> {}

export interface ICourseRepository {
  create(data: CreateCourseData): Promise<CourseDocument>;
  findAll(): Promise<CourseDocument[]>;
  findById(id: string): Promise<CourseDocument | null>;
  findByCode(code: string): Promise<CourseDocument | null>;
  findByTitle(title: string): Promise<CourseDocument | null>;
  update(id: string, data: UpdateCourseData): Promise<CourseDocument | null>;
  delete(id: string): Promise<CourseDocument | null>;
}
