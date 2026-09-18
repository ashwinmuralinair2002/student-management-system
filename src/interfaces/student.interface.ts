import type { UserData } from "./user.interface.js";

export interface StudentData extends UserData {
  phoneNumber: string;
  rollNumber: number;
}

export interface UpdateStudentRequest
  extends Partial<Pick<StudentData, "name" | "email" | "phoneNumber">> {}

export type StudentResponse = Readonly<
  Pick<StudentData, "id" | "name" | "email" | "phoneNumber" | "rollNumber">
>;
