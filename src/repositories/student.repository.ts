import { StudentModel } from "../models/student.model.js";
import type {
  IStudentRepository,
  StudentCreateData,
  StudentDocument,
  UpdateStudentData,
} from "../interfaces/student.repository.interface.js";

export class StudentRepository implements IStudentRepository {
  public async create(data: StudentCreateData): Promise<StudentDocument> {
    return StudentModel.create(data);
  }

  public async findAll(): Promise<StudentDocument[]> {
    return StudentModel.find();
  }

  public async findById(id: string): Promise<StudentDocument | null> {
    return StudentModel.findById(id);
  }

  public async update(
    id: string,
    data: UpdateStudentData,
  ): Promise<StudentDocument | null> {
    return StudentModel.findByIdAndUpdate(id, data, { new: true });
  }

  public async delete(id: string): Promise<StudentDocument | null> {
    return StudentModel.findByIdAndDelete(id);
  }
}
