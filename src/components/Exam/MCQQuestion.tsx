import React from 'react';
import { Question } from '../../types';
import { CheckCircle, Circle } from 'lucide-react';

interface MCQQuestionProps {
  question: Question;
  selectedAnswer: number | undefined;
  onAnswerChange: (answer: number) => void;
}

const MCQQuestion: React.FC<MCQQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{question.title}</h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {question.points} points
          </span>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">{question.description}</p>
        </div>
      </div>

      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerChange(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedAnswer === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {selectedAnswer === index ? (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-900">{option}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          <strong>Instructions:</strong> Select the best answer from the options above. You can change your selection at any time.
        </p>
      </div>
    </div>
  );
};

export default MCQQuestion;