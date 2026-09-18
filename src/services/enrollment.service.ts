import type {
  CreateEnrollmentData,
  CreateEnrollmentsData,
  EnrollmentDocument,
  IEnrollmentRepository,
} from "../interfaces/enrollment.repository.interface.js";
import type { ICourseRepository } from "../interfaces/course.repository.interface.js";
import type { IStudentRepository } from "../interfaces/student.repository.interface.js";

export class EnrollmentService {
  constructor(
    private readonly enrollmentRepository: IEnrollmentRepository,
    private readonly studentRepository: IStudentRepository,
    private readonly courseRepository: ICourseRepository,
  ) {}

  public async enrollStudent(
    data: CreateEnrollmentData,
  ): Promise<EnrollmentDocument> {
    const student = await this.studentRepository.findById(data.studentId);

    if (student === null) {
      throw new Error("Student was not found");
    }

    const course = await this.courseRepository.findById(data.courseId);

    if (course === null) {
      throw new Error("Course was not found");
    }

    const studentEnrollments = await this.enrollmentRepository.findByStudentId(
      data.studentId,
    );
    const isAlreadyEnrolled = studentEnrollments.some(
      (enrollment) => enrollment.courseId.toString() === data.courseId,
    );

    if (isAlreadyEnrolled) {
      throw new Error("Student is already enrolled in this course");
    }

    const courseEnrollments = await this.enrollmentRepository.findByCourseId(
      data.courseId,
    );

    if (courseEnrollments.length >= course.maximumStudents) {
      throw new Error(
        `${course.title} has reached its maximum student capacity.`,
      );
    }

    return this.enrollmentRepository.create(data);
  }

  public async enrollStudents(
    data: CreateEnrollmentsData,
  ): Promise<EnrollmentDocument[]> {
    const student = await this.studentRepository.findById(data.studentId);

    if (student === null) {
      throw new Error("Student was not found");
    }

    const studentEnrollments = await this.enrollmentRepository.findByStudentId(
      data.studentId,
    );
    const courseIds = [...new Set(data.courseIds)];
    const capacityErrors: string[] = [];

    for (const courseId of courseIds) {
      const course = await this.courseRepository.findById(courseId);

      if (course === null) {
        throw new Error("Course was not found");
      }

      const isAlreadyEnrolled = studentEnrollments.some(
        (enrollment) => enrollment.courseId.toString() === courseId,
      );

      if (isAlreadyEnrolled) {
        throw new Error("Student is already enrolled in this course");
      }

      const courseEnrollments = await this.enrollmentRepository.findByCourseId(
        courseId,
      );

      if (courseEnrollments.length >= course.maximumStudents) {
        capacityErrors.push(
          `${course.title} has reached its maximum student capacity.`,
        );
      }
    }

    if (capacityErrors.length > 0) {
      throw new Error(capacityErrors.join("\n"));
    }

    return Promise.all(
      courseIds.map((courseId) =>
        this.enrollmentRepository.create({
          studentId: data.studentId,
          courseId,
        }),
      ),
    );
  }

  public async getEnrollmentsByStudent(
    studentId: string,
  ): Promise<EnrollmentDocument[]> {
    return this.enrollmentRepository.findByStudentId(studentId);
  }

  public async getEnrollmentsByCourse(
    courseId: string,
  ): Promise<EnrollmentDocument[]> {
    return this.enrollmentRepository.findByCourseId(courseId);
  }

  public async removeEnrollment(id: string): Promise<EnrollmentDocument | null> {
    return this.enrollmentRepository.delete(id);
  }
}
