import React from 'react';
import { X, FileDiff, ArrowRight } from 'lucide-react';

interface DiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  filePath: string;
  originalContent: string;
  currentContent: string;
}

export const DiffModal: React.FC<DiffModalProps> = ({
  isOpen,
  onClose,
  filePath,
  originalContent,
  currentContent,
}) => {
  if (!isOpen) return null;

  const originalLines = originalContent.split('\n');
  const currentLines = currentContent.split('\n');
  const maxLines = Math.max(originalLines.length, currentLines.length);

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-[#121526] border border-[#242b4b] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#242b4b] bg-[#161a2e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileDiff className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-xs text-white">Diff Inspector:</span>
            <span className="font-mono text-xs text-purple-300">{filePath}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#20253f] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Diff view comparison */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs space-y-0.5 bg-[#0a0c16]">
          {Array.from({ length: maxLines }).map((_, idx) => {
            const orig = originalLines[idx];
            const curr = currentLines[idx];
            const isDiff = orig !== curr;

            return (
              <div
                key={idx}
                className={`grid grid-cols-2 gap-2 px-2 py-0.5 rounded text-[11px] leading-relaxed ${
                  isDiff ? 'bg-amber-500/10' : ''
                }`}
              >
                {/* Original line */}
                <div
                  className={`flex gap-3 truncate ${
                    isDiff ? 'text-rose-400/80 bg-rose-950/20 px-1 rounded' : 'text-slate-500'
                  }`}
                >
                  <span className="w-8 text-right select-none opacity-40">{idx + 1}</span>
                  <span className="truncate">{orig !== undefined ? orig : ''}</span>
                </div>

                {/* Current line */}
                <div
                  className={`flex gap-3 truncate ${
                    isDiff ? 'text-emerald-400 bg-emerald-950/30 px-1 rounded font-medium' : 'text-slate-300'
                  }`}
                >
                  <span className="w-8 text-right select-none opacity-40">{idx + 1}</span>
                  <span className="truncate">{curr !== undefined ? curr : ''}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#242b4b] bg-[#161a2e] flex justify-between items-center text-xs">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-rose-400 flex items-center gap-1">● Original checkpoint</span>
            <span className="text-emerald-400 flex items-center gap-1">● Current working file</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
