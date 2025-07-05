import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useExam } from '../../context/ExamContext';
import ExamCard from './ExamCard';
import RecentResults from './RecentResults';
import { Clock, BookOpen, Award, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { exams, userAttempts } = useExam();

  const completedExams = userAttempts.filter(attempt => attempt.isCompleted);
  const avgScore = completedExams.length > 0 
    ? completedExams.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / completedExams.length 
    : 0;

  const stats = [
    {
      title: 'Available Exams',
      value: exams.filter(exam => exam.isActive).length,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Completed Exams',
      value: completedExams.length,
      icon: Award,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Average Score',
      value: `${Math.round(avgScore)}%`,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Total Time Spent',
      value: `${Math.round(completedExams.length * 1.2)}h`,
      icon: Clock,
      color: 'text-amber-600 bg-amber-100'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Ready to continue your learning journey? Check out your available exams below.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Exams */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Available Exams</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {exams.filter(exam => exam.isActive).map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Results */}
        <div className="lg:col-span-1">
          <RecentResults attempts={userAttempts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;