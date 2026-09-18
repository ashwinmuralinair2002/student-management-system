import type {
  StudentData,
  StudentResponse,
  UpdateStudentRequest,
} from "../interfaces/student.interface.js";
import { User } from "./user.js";

export class Student extends User {
  private phoneNumber: string;
  private readonly rollNumber: number;

  constructor(data: StudentData) {
    super(data);
    this.phoneNumber = data.phoneNumber;
    this.rollNumber = data.rollNumber;
  }

  public getRoleDescription(): string {
    return "Student: enrolled in courses";
  }

  public updateDetails(data: UpdateStudentRequest): void {
    if (data.name !== undefined) {
      this.name = data.name;
    }

    if (data.email !== undefined) {
      this.email = data.email;
    }

    if (data.phoneNumber !== undefined) {
      this.phoneNumber = data.phoneNumber;
    }
  }

  public toResponse(): StudentResponse {
    return {
      id: this.getId(),
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      rollNumber: this.rollNumber,
    };
  }
}
