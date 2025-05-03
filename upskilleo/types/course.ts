
export interface CourseSection {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  completed: boolean;
  locked: boolean;
  progress: number;
  badge?: string;
  track?: string;
  topics?: string[];
  sections?: CourseSection[];
}

export interface PurchasedCourseProps {
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  courseImage: string;
  modules: CourseModule[];
}
