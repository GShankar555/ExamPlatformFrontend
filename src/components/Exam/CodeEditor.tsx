import React, { useEffect } from "react";
import { Copy, Download, RotateCcw } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Question } from "../../types";

interface CodeEditorProps {
  code: string;
  selectedProblem: Question;
  onChange: (code: string) => void;
  language: string;
  fontSize: number;
  theme: "light" | "dark" | "system";
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  selectedProblem,
  language,
  fontSize,
  theme,
}) => {
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const resolveEditorTheme = () => {
    if (theme === "dark") return "vs-dark";
    if (theme === "light") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "vs-dark"
      : "light";
  };

  useEffect(() => {
    handleReset();
  }, [language, selectedProblem]);

  const handleDownloadCode = () => {
    const extensions: Record<string, string> = {
      python: "py",
      java: "java",
      c: "c",
      cpp: "cpp",
    };
    const extension = extensions[language] || "txt";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solution.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    const template = selectedProblem.functionTemplate?.[language] ?? "";
    onChange(template);
  };

  return (
    <div className=" bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex flex-col h-[500px]">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Code Editor ({language.toUpperCase()})
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            title="Reset to template"
          >
            <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={handleCopyCode}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            title="Copy code"
          >
            <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={handleDownloadCode}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            title="Download code"
          >
            <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={(value) => onChange(value || "")}
        options={{
          fontSize,
          minimap: { enabled: false },
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        theme={resolveEditorTheme()}
      />
    </div>
  );
};
