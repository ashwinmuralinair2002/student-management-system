import { model, Schema } from "mongoose";

export interface StudentDatabaseData {
  name: string;
  email: string;
  phoneNumber: string;
  rollNumber: number;
}

const studentSchema = new Schema<StudentDatabaseData>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    rollNumber: { type: Number, required: true, unique: true },
  },
  { timestamps: true },
);

export const StudentModel = model<StudentDatabaseData>("Student", studentSchema);
