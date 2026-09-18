export interface CourseData {
  id: string;
  code: string;
  title: string;
  maximumStudents: number;
}

export interface UpdateCourseRequest
  extends Partial<Pick<CourseData, "title" | "maximumStudents">> {}

export type CourseResponse = Readonly<CourseData>;
