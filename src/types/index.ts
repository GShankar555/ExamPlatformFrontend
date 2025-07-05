export interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "admin";
}

export interface Problem {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  examples: Example[];
  constraints: string[];
  tags: string[];
  functionTemplate: { [key: string]: string };
  testCases: TestCase[];
}


export interface ExecutionResult {
  overallStatus: "pending" | "running" | "passed" | "failed" | "partial";
  totalExecutionTime: number;
  totalMemoryUsed: number;
  testCases: {
    id: number;
    name: string;
    input: string[];
    expectedOutput: string;
    actualOutput: string;
    executionTime: number;
    memoryUsed: number;
    status: "running" | "passed" | "failed";
  }[];
}

export interface Question {
  id: string;
  type: "mcq" | "coding";
  title: string;
  description: string;
  points: number;
  options?: string[];
  correctAnswer?: number;
  functionName?: string;
  languageTemplates?: Record<string, LanguageTemplate>;
  functionTemplate: Record<string, string>;
  starterCode?: Record<string, string>;
  testCases?: TestCase[];
  examples?: Example[];
  constraints?: string[];
  tags?: string[];
  difficulty?: "Easy" | "Medium" | "Hard";
}

export interface TestCase {
  id?: number;
  name?: string;
  input: string[];
  expectedOutput: string;
  isHidden?: boolean;
}

export interface Example {
  input: string;
  output: string;
}

export interface LanguageTemplate {
  template: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  isActive: boolean;
  allowedAttempts: number;
  startTime?: Date;
  endTime?: Date;
  questions: Question[];
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  answers: Record<string, any>;
  score?: number;
  isCompleted: boolean;
}

export interface CodeExecution {
  code: string;
  language: string;
  input?: string;
  output?: string;
  error?: string;
  passed?: boolean;
}