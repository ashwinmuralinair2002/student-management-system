import type { EnrollmentData } from "../interfaces/enrollment.interface.js";

export class Enrollment {
  private readonly id: string;
  private readonly studentId: string;
  private readonly courseId: string;
  private readonly enrolledAt: Date;

  constructor(data: EnrollmentData) {
    this.id = data.id;
    this.studentId = data.studentId;
    this.courseId = data.courseId;
    this.enrolledAt = new Date(data.enrolledAt);
  }

  public getDetails(): Readonly<EnrollmentData> {
    return {
      id: this.id,
      studentId: this.studentId,
      courseId: this.courseId,
      enrolledAt: new Date(this.enrolledAt),
    };
  }
}
