import { roundOfficial, value } from './grading';
import { gradeOf, type CourseGrades } from './grades';
import { leaves, type Course } from './tree';

/** Every grade of the course has a real value (star on the home card). */
export function isComplete(course: Course, grades: CourseGrades): boolean {
  return leaves(course.root).every((l) => gradeOf(grades, l.id).real !== null);
}

/** Official course grade from real values only, rounded; null until complete. */
export function realCourseGrade(course: Course, grades: CourseGrades): number | null {
  if (!isComplete(course, grades)) return null;
  return roundOfficial(value(course.root, (id) => gradeOf(grades, id).real ?? 0));
}

export interface AverageResult {
  value: number | null;
  completeCourses: number;
  credits: number;
}

/** Credit-weighted average of complete courses (ADR 0008). */
export function generalAverage(
  courses: readonly Course[],
  gradesOf: (courseId: string) => CourseGrades,
): AverageResult {
  let points = 0;
  let credits = 0;
  let completeCourses = 0;
  for (const course of courses) {
    const grade = realCourseGrade(course, gradesOf(course.id));
    if (grade === null) continue;
    points += grade * course.credits;
    credits += course.credits;
    completeCourses += 1;
  }
  return { value: credits === 0 ? null : points / credits, completeCourses, credits };
}
