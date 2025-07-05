import React from 'react';
import { Question } from '../../types';
import { CheckCircle, Circle, Code, HelpCircle } from 'lucide-react';

interface QuestionNavigatorProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, any>;
  onQuestionSelect: (index: number) => void;
}

const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentIndex,
  answers,
  onQuestionSelect
}) => {
  const getQuestionStatus = (question: Question, index: number) => {
    const hasAnswer = answers[question.id] !== undefined && answers[question.id] !== null && answers[question.id] !== '';
    const isCurrent = index === currentIndex;

    if (isCurrent) {
      return 'bg-blue-600 text-white border-blue-600';
    }
    if (hasAnswer) {
      return 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200';
    }
    return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
  };

  const getQuestionIcon = (question: Question, index: number) => {
    const hasAnswer = answers[question.id] !== undefined && answers[question.id] !== null && answers[question.id] !== '';
    const isCurrent = index === currentIndex;

    if (hasAnswer && !isCurrent) {
      return <CheckCircle className="h-4 w-4" />;
    }
    return <Circle className="h-4 w-4" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigator</h3>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2 mb-6">
        {questions.map((question, index) => (
          <button
            key={question.id}
            onClick={() => onQuestionSelect(index)}
            className={`relative p-2 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${getQuestionStatus(question, index)}`}
          >
            <span className="text-sm font-medium">{index + 1}</span>
            {question.type === 'coding' && (
              <Code className="absolute -top-1 -right-1 h-3 w-3 text-purple-600" />
            )}
            {question.type === 'mcq' && (
              <HelpCircle className="absolute -top-1 -right-1 h-3 w-3 text-blue-600" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded border-2 border-blue-600"></div>
          <span className="text-gray-600">Current Question</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 rounded border-2 border-green-300 flex items-center justify-center">
            <CheckCircle className="h-3 w-3 text-green-700" />
          </div>
          <span className="text-gray-600">Answered</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-white rounded border-2 border-gray-300"></div>
          <span className="text-gray-600">Not Answered</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p className="font-medium">Progress</p>
          <p className="mt-1">
            {Object.keys(answers).length} of {questions.length} answered
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigator;