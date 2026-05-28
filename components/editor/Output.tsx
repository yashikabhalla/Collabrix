"use client";

import { Terminal, Loader2, CheckCircle, XCircle } from "lucide-react";

interface Props {
  output: string;
  isRunning: boolean;
  hasError: boolean;
}

export default function Output({ output, isRunning, hasError }: Props) {
  return (
    <div className="h-full flex flex-col bg-[#0e0e10]">

      {/* Header */}
      <div className="h-9 border-b border-[#27272a] flex items-center px-4 gap-2 flex-shrink-0">
        <Terminal className="w-3.5 h-3.5 text-[#52525b]" />
        <span className="text-[#52525b] text-xs font-medium">Output</span>
        {output && !isRunning && (
          <div className="ml-auto">
            {hasError ? (
              <XCircle className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-3 overflow-auto">
        {isRunning ? (
          <div className="flex items-center gap-2 text-[#52525b]">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            <span className="text-xs">Running...</span>
          </div>
        ) : output ? (
          <pre className={`text-xs font-mono whitespace-pre-wrap leading-relaxed ${
            hasError ? "text-red-400" : "text-green-400"
          }`}>
            {output}
          </pre>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 opacity-40">
            <Terminal className="w-6 h-6 text-[#52525b]" />
            <p className="text-[#52525b] text-xs">Run your code to see output</p>
          </div>
        )}
      </div>

    </div>
  );
}
