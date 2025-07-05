import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '../../context/ExamContext';
import { Trophy, Clock, CheckCircle, XCircle, Home, BarChart3 } from 'lucide-react';

const ExamResults: React.FC = () => {
  const navigate = useNavigate();
  const { userAttempts, exams } = useExam();

  const lastAttempt = userAttempts
    .filter(attempt => attempt.isCompleted)
    .sort((a, b) => new Date(b.endTime!).getTime() - new Date(a.endTime!).getTime())[0];

  if (!lastAttempt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
          <p className="text-gray-600 mb-6">You haven't completed any exams yet.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const exam = exams.find(e => e.id === lastAttempt.examId);
  const score = lastAttempt.score || 0;
  const percentage = Math.round(score);
  const totalQuestions = exam?.questions.length || 0;
  const answeredQuestions = Object.keys(lastAttempt.answers).length;
  
  const duration = lastAttempt.endTime && lastAttempt.startTime
    ? Math.round((new Date(lastAttempt.endTime).getTime() - new Date(lastAttempt.startTime).getTime()) / (1000 * 60))
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return { title: 'Excellent!', message: 'Outstanding performance! You have mastered this topic.' };
    if (score >= 80) return { title: 'Great Job!', message: 'Very good performance! You have a strong understanding.' };
    if (score >= 70) return { title: 'Good Work!', message: 'Good performance! Consider reviewing some topics.' };
    if (score >= 60) return { title: 'Keep Practicing!', message: 'You passed, but there\'s room for improvement.' };
    return { title: 'More Study Needed', message: 'Consider reviewing the material and trying again.' };
  };

  const performance = getPerformanceMessage(percentage);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${getScoreBgColor(percentage)}`}>
            <Trophy className={`h-10 w-10 ${getScoreColor(percentage)}`} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Completed!</h1>
          <p className="text-gray-600">Here are your results for {exam?.title}</p>
        </div>

        {/* Score Card */}
        <div className={`bg-white rounded-xl shadow-sm border-2 p-8 mb-8 ${getScoreBgColor(percentage)}`}>
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(percentage)}`}>
              {percentage}%
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{performance.title}</h2>
            <p className="text-gray-600">{performance.message}</p>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Questions Answered</p>
                <p className="text-2xl font-semibold text-gray-900">{answeredQuestions}/{totalQuestions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 rounded-lg p-3">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Time Taken</p>
                <p className="text-2xl font-semibold text-gray-900">{duration} min</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-lg p-3">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Score</p>
                <p className="text-2xl font-semibold text-gray-900">{Math.round(score)}/{exam?.questions.reduce((sum, q) => sum + q.points, 0) || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Question Breakdown</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {exam?.questions.map((question, index) => {
              const userAnswer = lastAttempt.answers[question.id];
              const isAnswered = userAnswer !== undefined && userAnswer !== null && userAnswer !== '';
              const isCorrect = question.type === 'mcq' 
                ? userAnswer === question.correctAnswer
                : isAnswered; // For coding questions, we assume partial credit

              return (
                <div key={question.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : isAnswered ? (
                        <XCircle className="h-6 w-6 text-red-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          Question {index + 1}: {question.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${question.type === 'mcq' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {question.type.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">{question.points} pts</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{question.description}</p>
                      {!isAnswered && (
                        <p className="text-sm text-red-600 mt-1">Not answered</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          
          {exam && exam.allowedAttempts > userAttempts.filter(a => a.examId === exam.id).length && (
            <button
              onClick={() => navigate(`/exam/${exam.id}`)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <Trophy className="h-5 w-5" />
              <span>Retake Exam</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamResults;