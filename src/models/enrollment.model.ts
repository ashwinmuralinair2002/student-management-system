import { model, Schema, Types } from "mongoose";

export interface EnrollmentDatabaseData {
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  enrolledAt: Date;
}

const enrollmentSchema = new Schema<EnrollmentDatabaseData>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const EnrollmentModel = model<EnrollmentDatabaseData>(
  "Enrollment",
  enrollmentSchema,
);
