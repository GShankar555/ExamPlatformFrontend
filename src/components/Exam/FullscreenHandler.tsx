import React, { useEffect, useState } from 'react';
import { useExam } from '../../context/ExamContext';
import { Maximize, AlertTriangle } from 'lucide-react';

const FullscreenHandler: React.FC = () => {
  const { isFullscreen, setIsFullscreen } = useExam();
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(isCurrentlyFullscreen);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F11, Alt+Tab, Ctrl+Shift+I, etc.
      if (
        e.key === 'F11' ||
        (e.altKey && e.key === 'Tab') ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.key === 'F12')
      ) {
        e.preventDefault();
        return false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Log potential cheating attempt
        console.warn('User switched tabs or minimized window during exam');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setIsFullscreen]);

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setShowPrompt(false);
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  };

  if (!showPrompt && isFullscreen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Maximize className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Proctored Exam Mode</h2>
          <p className="text-gray-600">
            This exam must be taken in fullscreen mode for security purposes.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <h3 className="text-sm font-medium text-amber-800">Important Notice</h3>
              <ul className="mt-2 text-sm text-amber-700 space-y-1">
                <li>• Switching tabs or windows is not allowed</li>
                <li>• Keyboard shortcuts are disabled</li>
                <li>• Your activity may be monitored</li>
                <li>• Violations may result in exam termination</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={enterFullscreen}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Enter Fullscreen & Start Exam
        </button>
      </div>
    </div>
  );
};

export default FullscreenHandler;