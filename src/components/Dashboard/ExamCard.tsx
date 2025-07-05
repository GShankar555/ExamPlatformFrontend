import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Exam } from '../../types';
import { useExam } from '../../context/ExamContext';
import { Clock, FileText, Play, AlertCircle } from 'lucide-react';

interface ExamCardProps {
  exam: Exam;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  const navigate = useNavigate();
  const { userAttempts } = useExam();

  const attemptCount = userAttempts.filter(attempt => attempt.examId === exam.id).length;
  const canTakeExam = attemptCount < exam.allowedAttempts;
  const lastAttempt = userAttempts
    .filter(attempt => attempt.examId === exam.id)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];

  const handleStartExam = () => {
    if (canTakeExam) {
      navigate(`/exam/${exam.id}`);
    }
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{exam.description}</p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{exam.duration} minutes</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>{exam.questions.length} questions</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-500">Attempts: </span>
              <span className={attemptCount >= exam.allowedAttempts ? 'text-red-600 font-medium' : 'text-gray-700'}>
                {attemptCount}/{exam.allowedAttempts}
              </span>
              {lastAttempt && (
                <>
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-gray-500">Last score: </span>
                  <span className="font-medium text-gray-700">{Math.round(lastAttempt.score || 0)}%</span>
                </>
              )}
            </div>

            <button
              onClick={handleStartExam}
              disabled={!canTakeExam}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                canTakeExam
                  ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {canTakeExam ? (
                <>
                  <Play className="h-4 w-4" />
                  <span>Start Exam</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  <span>No Attempts Left</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;