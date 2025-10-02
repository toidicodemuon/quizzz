export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: number;
  username: string;
  email?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  role: Role;
  isActive?: boolean;
}

export type QuizStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Quiz {
  id: number;
  title: string;
  description?: string | null;
  timeLimitMinutes: number;
  status: QuizStatus;
  teacherId: number;
}

export interface Answer {
  id: number;
  answerText: string;
  isCorrect: boolean;
  questionId: number;
}

export interface Question {
  id: number;
  questionText: string;
  explanation?: string | null;
  quizId: number;
  answers: Answer[];
}

export interface Submission {
  id: number;
  quizId: number;
  studentId: number;
  score: number;
  startTime: string;
  endTime?: string | null;
}

export interface Pagination<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface LoginPayload {
  username: string;
  password: string;
}

