import type {
  CourseData,
  CourseResponse,
  UpdateCourseRequest,
} from "../interfaces/course.interface.js";

export class Course {
  private readonly id: string;
  private readonly code: string;
  private title: string;
  private maximumStudents: number;

  constructor(data: CourseData) {
    this.id = data.id;
    this.code = data.code;
    this.title = data.title;
    this.maximumStudents = data.maximumStudents;
  }

  public updateDetails(data: UpdateCourseRequest): void {
    if (data.title !== undefined) {
      this.title = data.title;
    }

    if (data.maximumStudents !== undefined) {
      this.maximumStudents = data.maximumStudents;
    }
  }

  public toResponse(): CourseResponse {
    return {
      id: this.id,
      code: this.code,
      title: this.title,
      maximumStudents: this.maximumStudents,
    };
  }
}
