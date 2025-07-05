import React, { useEffect, useState } from "react";
import { Play, Clock } from "lucide-react";
import { Question, ExecutionResult } from "../../types";
import { CodeEditor } from "./CodeEditor";
import { TestCasesPanel } from "./TestCasesPanel";
import apiService from "../../services/api";

interface CodingQuestionProps {
  question: Question;
  examId: string;
  theme: "light" | "dark" | "system";
}

const CodingQuestion: React.FC<CodingQuestionProps> = ({ examId, question, theme }) => {
  const languages = Object.keys(question.functionTemplate || {});
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    languages[0]
  );
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (languages.length) {
      const defaultCode = question.functionTemplate?.[languages[0]] || "";
      setCodeMap((prev) => ({ ...prev, [languages[0]]: defaultCode }));
    }
  }, [question]);

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    const starter = codeMap[lang] || question.functionTemplate?.[lang] || "";
    setCodeMap((prev) => ({ ...prev, [lang]: starter }));
    setOutput(null);
  };

  const handleCodeChange = (newCode: string) => {
    setCodeMap((prev) => ({ ...prev, [selectedLanguage]: newCode }));
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    try {
      const res = await apiService.runCode(
        examId,
        question.id,
        codeMap[selectedLanguage],
        selectedLanguage
      );

      const { testCases, overallStatus, totalExecutionTime, totalMemoryUsed } =
        res.data;
      setOutput({
        testCases,
        overallStatus,
        totalExecutionTime,
        totalMemoryUsed,
      });
    } catch (error) {
      console.error("Error while running code:", error);
      setOutput({
        testCases: [],
        overallStatus: "failed",
        totalExecutionTime: 0,
        totalMemoryUsed: 0,
      });
    }

    setIsRunning(false);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">{question.title}</div>
        <div className="flex gap-3 items-center">
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center gap-1 disabled:opacity-50"
          >
            {isRunning ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isRunning ? "Running..." : "Run Tests"}
          </button>
        </div>
      </div>
      <div className="flex flex-col h-full min-h-[400px]">
        <CodeEditor
          code={codeMap[selectedLanguage]}
          onChange={handleCodeChange}
          selectedProblem={question}
          language={selectedLanguage}
          fontSize={14}
          theme={theme}
        />
      </div>
      <div className="min-h-[200px]">
        <TestCasesPanel
          testCases={question.testCases || []}
          executionResult={output}
          isRunning={isRunning}
        />
      </div>
    </div>
  );
};

export default CodingQuestion;