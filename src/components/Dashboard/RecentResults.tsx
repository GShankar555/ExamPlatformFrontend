import React from 'react';
import { ExamAttempt } from '../../types';
import { useExam } from '../../context/ExamContext';
import { Trophy, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface RecentResultsProps {
  attempts: ExamAttempt[];
}

const RecentResults: React.FC<RecentResultsProps> = ({ attempts }) => {
  const { exams } = useExam();

  const recentAttempts = attempts
    .filter(attempt => attempt.isCompleted)
    .sort((a, b) => new Date(b.endTime!).getTime() - new Date(a.endTime!).getTime())
    .slice(0, 5);

  const getExamTitle = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    return exam?.title || 'Unknown Exam';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return TrendingUp;
    if (score >= 60) return TrendingUp;
    return TrendingDown;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>Recent Results</span>
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {recentAttempts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No exam results yet</p>
            <p className="text-sm">Take your first exam to see results here</p>
          </div>
        ) : (
          recentAttempts.map((attempt) => {
            const ScoreIcon = getScoreIcon(attempt.score || 0);
            return (
              <div key={attempt.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {getExamTitle(attempt.examId)}
                  </h3>
                  <div className={`flex items-center space-x-1 ${getScoreColor(attempt.score || 0)}`}>
                    <ScoreIcon className="h-4 w-4" />
                    <span className="font-semibold">{Math.round(attempt.score || 0)}%</span>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    {new Date(attempt.endTime!).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentResults;