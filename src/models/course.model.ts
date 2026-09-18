import { model, Schema } from "mongoose";

export interface CourseDatabaseData {
  code: string;
  title: string;
  maximumStudents: number;
}

const courseSchema = new Schema<CourseDatabaseData>(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    maximumStudents: { type: Number, required: true },
  },
  { timestamps: true },
);

courseSchema.index(
  { title: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } },
);

export const CourseModel = model<CourseDatabaseData>("Course", courseSchema);
