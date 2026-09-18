import { CourseModel } from "../models/course.model.js";
import type {
  CourseDocument,
  CreateCourseData,
  ICourseRepository,
  UpdateCourseData,
} from "../interfaces/course.repository.interface.js";

export class CourseRepository implements ICourseRepository {
  public async create(data: CreateCourseData): Promise<CourseDocument> {
    return CourseModel.create(data);
  }

  public async findAll(): Promise<CourseDocument[]> {
    return CourseModel.find();
  }

  public async findById(id: string): Promise<CourseDocument | null> {
    return CourseModel.findById(id);
  }

  public async findByCode(code: string): Promise<CourseDocument | null> {
    return CourseModel.findOne({ code });
  }

  public async findByTitle(title: string): Promise<CourseDocument | null> {
    return CourseModel.findOne({ title }).collation({
      locale: "en",
      strength: 2,
    });
  }

  public async update(
    id: string,
    data: UpdateCourseData,
  ): Promise<CourseDocument | null> {
    return CourseModel.findByIdAndUpdate(id, data, { new: true });
  }

  public async delete(id: string): Promise<CourseDocument | null> {
    return CourseModel.findByIdAndDelete(id);
  }
}
