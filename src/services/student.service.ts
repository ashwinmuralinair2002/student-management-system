import validator from "validator";
import type {
  CreateStudentData,
  IStudentRepository,
  StudentDocument,
  UpdateStudentData,
} from "../interfaces/student.repository.interface.js";
import type { ICounterRepository } from "../interfaces/counter.repository.interface.js";

export class StudentService {
  constructor(
    private readonly studentRepository: IStudentRepository,
    private readonly counterRepository: ICounterRepository,
  ) {}

  public async createStudent(data: CreateStudentData): Promise<StudentDocument> {
    this.validateStudent(data);

    const students = await this.studentRepository.findAll();
    const emailAlreadyExists = students.some(
      (student) => student.email.toLowerCase() === data.email.trim().toLowerCase(),
    );

    if (emailAlreadyExists) {
      throw new Error("A student with this email already exists");
    }

    const phoneNumberAlreadyExists = students.some(
      (student) => student.phoneNumber === data.phoneNumber.trim(),
    );

    if (phoneNumberAlreadyExists) {
      throw new Error("A student with this phone number already exists");
    }

    const rollNumber = await this.counterRepository.getNextRollNumber();

    return this.studentRepository.create({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phoneNumber: data.phoneNumber.trim(),
      rollNumber,
    });
  }

  public async getAllStudents(): Promise<StudentDocument[]> {
    return this.studentRepository.findAll();
  }

  public async getStudentById(id: string): Promise<StudentDocument | null> {
    return this.studentRepository.findById(id);
  }

  public async updateStudent(
    id: string,
    data: UpdateStudentData,
  ): Promise<StudentDocument | null> {
    if (data.name !== undefined && data.name.trim() === "") {
      throw new Error("Student name is required");
    }

    if (data.email !== undefined) {
      this.validateEmail(data.email);

      const students = await this.studentRepository.findAll();
      const emailAlreadyExists = students.some(
        (student) =>
          student.email.toLowerCase() === data.email?.trim().toLowerCase() &&
          student._id.toString() !== id,
      );

      if (emailAlreadyExists) {
        throw new Error("A student with this email already exists");
      }
    }

    if (data.phoneNumber !== undefined) {
      this.validatePhoneNumber(data.phoneNumber);

      const students = await this.studentRepository.findAll();
      const phoneNumberAlreadyExists = students.some(
        (student) =>
          student.phoneNumber === data.phoneNumber?.trim() &&
          student._id.toString() !== id,
      );

      if (phoneNumberAlreadyExists) {
        throw new Error("A student with this phone number already exists");
      }
    }

    const updatedData: UpdateStudentData = {};

    if (data.name !== undefined) {
      updatedData.name = data.name.trim();
    }

    if (data.email !== undefined) {
      updatedData.email = data.email.trim().toLowerCase();
    }

    if (data.phoneNumber !== undefined) {
      updatedData.phoneNumber = data.phoneNumber.trim();
    }

    return this.studentRepository.update(id, updatedData);
  }

  public async deleteStudent(id: string): Promise<StudentDocument | null> {
    return this.studentRepository.delete(id);
  }

  private validateStudent(data: CreateStudentData): void {
    if (data.name.trim() === "") {
      throw new Error("Student name is required");
    }

    this.validateEmail(data.email);

    this.validatePhoneNumber(data.phoneNumber);
  }

  private validateEmail(email: string): void {
    const trimmedEmail = email.trim();

    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      throw new Error("Student email is not valid");
    }
  }

  private validatePhoneNumber(phoneNumber: string): void {
    const trimmedPhoneNumber = phoneNumber.trim();

    if (!validator.isMobilePhone(trimmedPhoneNumber, "en-IN")) {
      throw new Error("Phone number is not valid");
    }
  }
}
