import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExam } from '../../context/ExamContext';
import Timer from './Timer';
import QuestionNavigator from './QuestionNavigator';
import MCQQuestion from './MCQQuestion';
import CodingQuestion from './CodingQuestion';
import FullscreenHandler from './FullscreenHandler';
import { AlertTriangle, Monitor, X } from 'lucide-react';

const ExamInterface: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { 
    exams, 
    startExam, 
    currentExam, 
    currentAttempt, 
    submitAnswer, 
    submitExam,
    isFullscreen,
    setIsFullscreen 
  } = useExam();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {
    if (examId && !currentExam) {
      const exam = exams.find(e => e.id === examId);
      if (!exam) {
        navigate('/');
        return;
      }
      startExam(examId);
    }
  }, [examId, currentExam, startExam, exams, navigate]);

  useEffect(() => {
    if (timeUp && currentExam) {
      handleSubmitExam();
    }
  }, [timeUp]);

  const handleAnswerChange = (answer: any) => {
    if (currentExam && currentAttempt) {
      const questionId = currentExam.questions[currentQuestionIndex].id;
      submitAnswer(questionId, answer);
    }
  };

  const handleSubmitExam = () => {
    setShowExitWarning(false);
    submitExam();
    navigate('/results');
  };

  const handleExitAttempt = () => {
    setShowExitWarning(true);
  };

  const getCurrentAnswer = () => {
    if (!currentExam || !currentAttempt) return undefined;
    const questionId = currentExam.questions[currentQuestionIndex].id;
    return currentAttempt.answers[questionId];
  };

  if (!currentExam || !currentAttempt) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = currentExam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentExam.questions.length) * 100;

  return (
    <>
      <FullscreenHandler />

      {showExitWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Submit Exam?
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your exam? This action cannot be
              undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowExitWarning(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Continue Exam
              </button>
              <button
                onClick={handleSubmitExam}
                className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Exam Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Monitor className="h-6 w-6 text-blue-600" />
                <h1 className="text-lg font-semibold text-gray-900">
                  {currentExam.title}
                </h1>
                {!isFullscreen && (
                  <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Not in fullscreen mode</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Timer
                  duration={currentExam.duration}
                  onTimeUp={() => setTimeUp(true)}
                />
                <button
                  onClick={handleExitAttempt}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Submit</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question Navigator */}
            <div className="lg:col-span-1">
              <QuestionNavigator
                questions={currentExam.questions}
                currentIndex={currentQuestionIndex}
                answers={currentAttempt.answers}
                onQuestionSelect={setCurrentQuestionIndex}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Progress Bar */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Question {currentQuestionIndex + 1} of{" "}
                      {currentExam.questions.length}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(progress)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question Content */}
                <div className="p-6">
                  {currentQuestion.type === "mcq" ? (
                    <MCQQuestion
                      question={currentQuestion}
                      selectedAnswer={getCurrentAnswer()}
                      onAnswerChange={handleAnswerChange}
                    />
                  ) : (
                    <CodingQuestion
                      question={currentQuestion}
                      examId={examId || ""}
                      theme="light"
                    />
                  )}
                </div>

                {/* Navigation */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex(
                        Math.max(0, currentQuestionIndex - 1)
                      )
                    }
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() =>
                      setCurrentQuestionIndex(
                        Math.min(
                          currentExam.questions.length - 1,
                          currentQuestionIndex + 1
                        )
                      )
                    }
                    disabled={
                      currentQuestionIndex === currentExam.questions.length - 1
                    }
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExamInterface;