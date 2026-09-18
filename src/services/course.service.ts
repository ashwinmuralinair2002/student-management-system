import type {
  CourseDocument,
  CreateCourseData,
  ICourseRepository,
  UpdateCourseData,
} from "../interfaces/course.repository.interface.js";
import type { IEnrollmentRepository } from "../interfaces/enrollment.repository.interface.js";

export class CourseService {
  constructor(
    private readonly courseRepository: ICourseRepository,
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  public async createCourse(data: CreateCourseData): Promise<CourseDocument> {
    this.validateCourse(data);

    const code = this.normalizeCode(data.code);
    const title = data.title.trim();

    await this.ensureCodeIsAvailable(code);
    await this.ensureTitleIsAvailable(title);

    return this.courseRepository.create({
      code,
      title,
      maximumStudents: data.maximumStudents,
    });
  }

  public async getAllCourses(): Promise<CourseDocument[]> {
    return this.courseRepository.findAll();
  }

  public async getCourseById(id: string): Promise<CourseDocument | null> {
    return this.courseRepository.findById(id);
  }

  public async updateCourse(
    id: string,
    data: UpdateCourseData,
  ): Promise<CourseDocument | null> {
    if (data.code !== undefined) {
      this.validateCode(data.code);
    }

    if (data.title !== undefined && data.title.trim() === "") {
      throw new Error("Course title is required");
    }

    if (data.maximumStudents !== undefined && data.maximumStudents <= 0) {
      throw new Error("Maximum students must be greater than zero");
    }

    if (data.maximumStudents !== undefined) {
      const course = await this.courseRepository.findById(id);

      if (course === null) {
        return null;
      }

      const enrollments = await this.enrollmentRepository.findByCourseId(id);

      if (data.maximumStudents < enrollments.length) {
        throw new Error(
          `${course.title} cannot have a maximum capacity below its current enrollment of ${enrollments.length} students.`,
        );
      }
    }

    const updatedData: UpdateCourseData = {};

    if (data.code !== undefined) {
      const code = this.normalizeCode(data.code);
      await this.ensureCodeIsAvailable(code, id);
      updatedData.code = code;
    }

    if (data.title !== undefined) {
      const title = data.title.trim();
      await this.ensureTitleIsAvailable(title, id);
      updatedData.title = title;
    }

    if (data.maximumStudents !== undefined) {
      updatedData.maximumStudents = data.maximumStudents;
    }

    return this.courseRepository.update(id, updatedData);
  }

  public async deleteCourse(id: string): Promise<CourseDocument | null> {
    return this.courseRepository.delete(id);
  }

  private validateCourse(data: CreateCourseData): void {
    if (data.code.trim() === "") {
      throw new Error("Course code is required");
    }

    this.validateCode(data.code);

    if (data.title.trim() === "") {
      throw new Error("Course title is required");
    }

    if (data.maximumStudents <= 0) {
      throw new Error("Maximum students must be greater than zero");
    }
  }

  private validateCode(code: string): void {
    if (!/^[a-zA-Z0-9]{6}$/.test(code.trim())) {
      throw new Error("Course code must be exactly 6 alphanumeric characters.");
    }
  }

  private normalizeCode(code: string): string {
    return code.trim().toUpperCase();
  }

  private async ensureCodeIsAvailable(code: string, courseId?: string): Promise<void> {
    const course = await this.courseRepository.findByCode(code);

    if (course !== null && course.id !== courseId) {
      throw new Error("A course with this code already exists.");
    }
  }

  private async ensureTitleIsAvailable(
    title: string,
    courseId?: string,
  ): Promise<void> {
    const course = await this.courseRepository.findByTitle(title);

    if (course !== null && course.id !== courseId) {
      throw new Error("A course with this name already exists.");
    }
  }
}
