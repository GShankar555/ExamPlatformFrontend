import React, { createContext, useContext, useState, useEffect } from 'react';
import { Exam, ExamAttempt } from '../types';
import apiService from '../services/api';

interface ExamContextType {
  exams: Exam[];
  currentExam: Exam | null;
  currentAttempt: ExamAttempt | null;
  userAttempts: ExamAttempt[];
  startExam: (examId: string) => void;
  submitAnswer: (questionId: string, answer: any) => void;
  submitExam: () => void;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<ExamAttempt | null>(null);
  const [userAttempts, setUserAttempts] = useState<ExamAttempt[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('userAttempts');
    if (stored) {
      setUserAttempts(JSON.parse(stored));
    }
    const response = apiService.getProblems();
    response
      .then((data) => {
        setExams(data.data);
        console.log("Fetched exams:", data.data);
      })
      .catch((error) => {
        console.error("Failed to fetch exams:", error);
      });
  }, []);

  const startExam = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return;

    const attempt: ExamAttempt = {
      id: Math.random().toString(36).substr(2, 9),
      examId,
      userId: '1',
      startTime: new Date(),
      answers: {},
      isCompleted: false
    };

    setCurrentExam(exam);
    setCurrentAttempt(attempt);
  };

  const submitAnswer = (questionId: string, answer: any) => {
    if (!currentAttempt) return;

    const updatedAttempt = {
      ...currentAttempt,
      answers: {
        ...currentAttempt.answers,
        [questionId]: answer
      }
    };
    setCurrentAttempt(updatedAttempt);
  };

  const submitExam = () => {
    if (!currentAttempt || !currentExam) return;

    let score = 0;currentExam
    .questions.forEach(question => {
      const userAnswer = currentAttempt.answers[question.id];
      if (question.type === 'mcq' && userAnswer === question.correctAnswer) {
        score += question.points;
      }
      if (question.type === 'coding' && userAnswer) {
        score += question.points * 0.8;
      }
    });

    const completedAttempt = {
      ...currentAttempt,
      endTime: new Date(),
      score,
      isCompleted: true
    };

    const updatedAttempts = [...userAttempts, completedAttempt];
    setUserAttempts(updatedAttempts);
    localStorage.setItem('userAttempts', JSON.stringify(updatedAttempts));

    setCurrentExam(null);
    setCurrentAttempt(null);
    setIsFullscreen(false);
  };

  return (
    <ExamContext.Provider value={{
      exams,
      currentExam,
      currentAttempt,
      userAttempts,
      startExam,
      submitAnswer,
      submitExam,
      isFullscreen,
      setIsFullscreen
    }}>
      {children}
    </ExamContext.Provider>
  );
};