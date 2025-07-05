import React, { useState } from 'react';
import { TestCase, ExecutionResult } from '../../types';
import {
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2,
  Timer,
  MemoryStick
} from 'lucide-react';

interface TestCasesPanelProps {
  testCases: TestCase[];
  executionResult: ExecutionResult | null;
  isRunning: boolean;
}

export const TestCasesPanel: React.FC<TestCasesPanelProps> = ({
  testCases,
  executionResult,
  isRunning,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'running':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'passed':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'failed':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800';
    }
  };

  const getOverallStatusColor = () => {
    if (!executionResult) return 'text-gray-500';
    switch (executionResult.overallStatus) {
      case 'running':
        return 'text-blue-600 dark:text-blue-400';
      case 'passed':
        return 'text-green-600 dark:text-green-400';
      case 'failed':
      case 'partial':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-500';
    }
  };

  const passedCount = executionResult?.testCases.filter(tc => tc.status === 'passed').length || 0;
  const totalCount = testCases.length;

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Test Cases
          </h3>
          {executionResult && (
            <div className={`flex items-center gap-2 text-sm font-medium ${getOverallStatusColor()}`}>
              {executionResult.overallStatus === 'running' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>{passedCount}/{totalCount} Passed</span>
              )}
            </div>
          )}
        </div>
      
      </div>

      {/* Test Cases Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
        {testCases.map((testCase, index) => {
          const result = executionResult?.testCases.find(tc => tc.id === testCase.id);
          return (
            <button
              key={testCase.id}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === index
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {getStatusIcon(result?.status)}
              <span>Test {index + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Active Test Case Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {testCases[activeTab] && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border-2 transition-all ${getStatusColor(
              executionResult?.testCases.find(tc => tc.id === testCases[activeTab].id)?.status
            )}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {testCases[activeTab].name}
                </h4>
                {executionResult?.testCases.find(tc => tc.id === testCases[activeTab].id) && (
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {executionResult.testCases.find(tc => tc.id === testCases[activeTab].id)?.executionTime && (
                      <div className="flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        <span>{executionResult.testCases.find(tc => tc.id === testCases[activeTab].id)?.executionTime}ms</span>
                      </div>
                    )}
                    {executionResult.testCases.find(tc => tc.id === testCases[activeTab].id)?.memoryUsed && (
                      <div className="flex items-center gap-1">
                        <MemoryStick className="w-3 h-3" />
                        <span>{executionResult.testCases.find(tc => tc.id === testCases[activeTab].id)?.memoryUsed}MB</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Input:
                  </label>
                  <code className="block p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm font-mono">
                    {testCases[activeTab].input.map(inp=> inp+ " ")}
                  </code>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expected Output:
                  </label>
                  <code className="block p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm font-mono">
                    {testCases[activeTab].expectedOutput}
                  </code>
                </div>
                
                {executionResult?.testCases.find(tc => tc.id === testCases[activeTab].id)?.actualOutput && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Actual Output:
                    </label>
                    <code className={`block p-2 rounded text-sm font-mono ${
                      executionResult.testCases.find(tc => tc.id === testCases[activeTab].id)?.status === 'passed'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                    }`}>
                      {executionResult.testCases.find(tc => tc.id === testCases[activeTab].id)?.actualOutput}
                    </code>
                  </div>
                )}
              </div>
            </div>

            {/* Execution Progress */}
            {isRunning && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Executing test cases...</span>
                </div>
                
                <div className="space-y-2">
                  {testCases.map((testCase, index) => {
                    const result = executionResult?.testCases.find(tc => tc.id === testCase.id);
                    return (
                      <div key={testCase.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="flex items-center gap-2 flex-1">
                          {getStatusIcon(result?.status)}
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Test {index + 1}: {testCase.name}
                          </span>
                        </div>
                        {result?.status === 'running' && (
                          <div className="w-16 h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Summary */}
            {executionResult && !isRunning && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Execution Summary</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`ml-2 font-medium ${getOverallStatusColor()}`}>
                      {executionResult.overallStatus === 'passed' ? 'All Passed' : 
                       executionResult.overallStatus === 'partial' ? 'Partially Passed' : 
                       executionResult.overallStatus === 'failed' ? 'Failed' : 'Pending'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Tests:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {passedCount}/{totalCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Total Time:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {executionResult.totalExecutionTime}ms
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Memory:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {executionResult.totalMemoryUsed}MB
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};