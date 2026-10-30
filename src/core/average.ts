import { roundOfficial } from './grading';
import { gradeOf, simValue, type CourseGrades } from './grades';
import { leaves, type Course } from './tree';

/** Every grade of the course has a real value (star on the home card). */
export function isComplete(course: Course, grades: CourseGrades): boolean {
  return leaves(course.root).every((l) => gradeOf(grades, l.id).real !== null);
}

/** Course grade as the university records it: the shown value, rounded half up. */
export function officialCourseGrade(course: Course, grades: CourseGrades): number {
  return roundOfficial(simValue(course.root, grades));
}

export interface AverageResult {
  value: number;
  completeCourses: number;
  credits: number;
}

/** Credit-weighted average of every course, from the grades on screen (ADR 0009). */
export function generalAverage(
  courses: readonly Course[],
  gradesOf: (courseId: string) => CourseGrades,
): AverageResult {
  let points = 0;
  let credits = 0;
  let completeCourses = 0;
  for (const course of courses) {
    const grades = gradesOf(course.id);
    points += officialCourseGrade(course, grades) * course.credits;
    credits += course.credits;
    if (isComplete(course, grades)) completeCourses += 1;
  }
  return { value: credits === 0 ? 0 : points / credits, completeCourses, credits };
}
