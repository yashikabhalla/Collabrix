"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import Toolbar from "./Toolbar";
import CollaborativeEditor from "./CollaborativeEditor";
import Output from "./Output";
import LiveCursors from "./LiveCursors";
import PresenceIndicators from "./PresenceIndicators";
import LiveblocksRoomProvider from "./LiveblocksProvider";
import VideoCall from "./VideoCall";
import { Button } from "@/components/ui/button";
import { useStorage, useMutation } from "@/liveblocks.config";
import AIChat from "./AIChat";

interface Room {
  id: string;
  name: string;
  language: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Props {
  room: Room;
  user: User;
  isPro?: boolean;
}

function RoomContent({ room, user, isPro = false }: Props) {
  const [language, setLanguage] = useState(room.language);
  const [code, setCode] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  // Output vertical resize
  const [outputHeight, setOutputHeight] = useState(250);
  const isOutputDragging = useRef(false);
  const outputDragStartY = useRef(0);
  const outputDragStartHeight = useRef(250);

  // Right panel horizontal resize
  const [rightWidth, setRightWidth] = useState(384);
  const isRightDragging = useRef(false);
  const rightDragStartX = useRef(0);
  const rightDragStartWidth = useRef(384);

  // Video panel vertical resize inside right panel
  const [videoHeight, setVideoHeight] = useState(224); // h-56 = 224px
  const isVideoDragging = useRef(false);
  const videoDragStartY = useRef(0);
  const videoDragStartHeight = useRef(224);

  const isVideoCallActive = useStorage((root) => root.isVideoCallActive) ?? false;
  const output = useStorage((root) => root.output) ?? "";
  const outputError = useStorage((root) => root.hasError) ?? false;
  const isRunning = useStorage((root) => root.isRunning) ?? false;

  const updateOutput = useMutation(
    ({ storage }, newOutput: string, hasError: boolean) => {
      storage.set("output", newOutput);
      storage.set("hasError", hasError);
    }, []
  );
  const updateRunning = useMutation(
    ({ storage }, running: boolean) => { storage.set("isRunning", running); }, []
  );
  const updateVideoCall = useMutation(
    ({ storage }, active: boolean) => { storage.set("isVideoCallActive", active); }, []
  );
  const updateCode = useMutation(
    ({ storage }, newCode: string) => { storage.set("code", newCode); }, []
  );

  // Output drag
  const onOutputDragMouseDown = useCallback((e: React.MouseEvent) => {
    isOutputDragging.current = true;
    outputDragStartY.current = e.clientY;
    outputDragStartHeight.current = outputHeight;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, [outputHeight]);

  // Right panel drag
  const onRightDragMouseDown = useCallback((e: React.MouseEvent) => {
    isRightDragging.current = true;
    rightDragStartX.current = e.clientX;
    rightDragStartWidth.current = rightWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [rightWidth]);

  // Video panel drag
  const onVideoDragMouseDown = useCallback((e: React.MouseEvent) => {
    isVideoDragging.current = true;
    videoDragStartY.current = e.clientY;
    videoDragStartHeight.current = videoHeight;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, [videoHeight]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isOutputDragging.current) {
        const delta = outputDragStartY.current - e.clientY;
        // min 0 — fully collapsible
        const newHeight = Math.min(500, Math.max(0, outputDragStartHeight.current + delta));
        setOutputHeight(newHeight);
      }
      if (isRightDragging.current) {
        const delta = rightDragStartX.current - e.clientX;
        const newWidth = Math.min(600, Math.max(260, rightDragStartWidth.current + delta));
        setRightWidth(newWidth);
      }
      if (isVideoDragging.current) {
        const delta = e.clientY - videoDragStartY.current; // drag down = taller video
        const newHeight = Math.min(500, Math.max(80, videoDragStartHeight.current + delta));
        setVideoHeight(newHeight);
      }
    };

    const onMouseUp = () => {
      isOutputDragging.current = false;
      isRightDragging.current = false;
      isVideoDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Reset video height when video is toggled off
  useEffect(() => {
    if (!showVideo) setVideoHeight(224);
  }, [showVideo]);

  const handleVideoToggle = () => {
    const newState = !showVideo;
    setShowVideo(newState);
    updateVideoCall(newState);
  };

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const handleRunCode = async () => {
    updateRunning(true);
    updateOutput("", false);
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await response.json();
      if (data.output) {
        const isError =
          data.output.toLowerCase().includes("error") ||
          data.output.toLowerCase().includes("exception") ||
          data.statusCode !== 200;
        updateOutput(data.output, isError);
      } else if (data.error) {
        updateOutput(data.error, true);
      } else {
        updateOutput("Code ran successfully with no output.", false);
      }
    } catch {
      updateOutput("Network error. Please try again.", true);
    } finally {
      updateRunning(false);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const newSnippet = getDefaultCode(newLanguage);
    setCode(newSnippet);
    updateCode(newSnippet);
    updateOutput("", false);
  };

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      <LiveCursors />

      {/* Video Call Notification */}
      {isVideoCallActive && !showVideo && (
        <div className="bg-violet-600/20 border-b border-violet-500/30 px-4 py-2 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
            <span className="text-violet-300 text-sm">Someone started a video call!</span>
          </div>
          <Button size="sm" onClick={handleVideoToggle} className="bg-violet-600 hover:bg-violet-700 text-white h-7 text-xs">
            Join Video Call
          </Button>
        </div>
      )}

      {/* Toolbar */}
      <Toolbar
        room={room}
        user={user}
        language={language}
        onLanguageChange={handleLanguageChange}
        onRunCode={handleRunCode}
        isRunning={isRunning}
        presenceIndicators={<PresenceIndicators />}
        onVideoToggle={handleVideoToggle}
        isVideoOn={showVideo}
      />

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left — Editor + Output */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            <CollaborativeEditor
              language={language}
              onCodeChange={handleCodeChange}
              user={{ name: user.name, avatar: user.avatar, color: getRandomColor() }}
            />
          </div>

          {/* Output drag handle */}
          <div
            onMouseDown={onOutputDragMouseDown}
            className="h-[5px] flex-shrink-0 border-t border-white/10 flex items-center justify-center cursor-row-resize group relative select-none z-10"
          >
            <div className="flex gap-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <div className="w-6 h-[2px] rounded-full bg-violet-400/80" />
              <div className="w-6 h-[2px] rounded-full bg-violet-400/80" />
              <div className="w-6 h-[2px] rounded-full bg-violet-400/80" />
            </div>
            <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/10 active:bg-violet-500/20 transition-colors duration-150" />
          </div>

          {/* Output Panel — min 0, fully collapsible */}
          <div className="flex-shrink-0 overflow-hidden" style={{ height: outputHeight }}>
            <Output output={output} isRunning={isRunning} hasError={outputError} />
          </div>
        </div>

        {/* Horizontal drag handle */}
        <div
          onMouseDown={onRightDragMouseDown}
          className="w-[5px] flex-shrink-0 border-l border-white/10 flex items-center justify-center cursor-col-resize group relative select-none z-10"
        >
          <div className="flex flex-col gap-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <div className="h-6 w-[2px] rounded-full bg-violet-400/80" />
            <div className="h-6 w-[2px] rounded-full bg-violet-400/80" />
            <div className="h-6 w-[2px] rounded-full bg-violet-400/80" />
          </div>
          <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/10 active:bg-violet-500/20 transition-colors duration-150" />
        </div>

        {/* Right — Video + AI Chat */}
        <div className="flex flex-col flex-shrink-0 overflow-hidden" style={{ width: rightWidth }}>

          {/* Video Call — resizable height */}
          {showVideo && (
            <>
              <div className="flex-shrink-0 overflow-hidden" style={{ height: videoHeight }}>
                <VideoCall roomId={room.id} onClose={() => setShowVideo(false)} />
              </div>

              {/* Video / Chat drag handle */}
              <div
                onMouseDown={onVideoDragMouseDown}
                className="h-[5px] flex-shrink-0 border-t border-white/10 flex items-center justify-center cursor-row-resize group relative select-none z-10"
              >
                <div className="flex gap-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <div className="w-6 h-[2px] rounded-full bg-violet-400/80" />
                  <div className="w-6 h-[2px] rounded-full bg-violet-400/80" />
                  <div className="w-6 h-[2px] rounded-full bg-violet-400/80" />
                </div>
                <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/10 active:bg-violet-500/20 transition-colors duration-150" />
              </div>
            </>
          )}

          {/* AI Chat — takes remaining space */}
          <div className="flex-1 overflow-hidden">
            <AIChat isPro={isPro} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default function RoomClient({ room, user, isPro = false }: Props) {
  const initialCode = getDefaultCode(room.language);
  return (
    <LiveblocksRoomProvider roomId={room.id} initialCode={initialCode}>
      <RoomContent room={room} user={user} isPro={isPro} />
    </LiveblocksRoomProvider>
  );
}

function getDefaultCode(language: string): string {
  const defaults: Record<string, string> = {
    javascript: `// Welcome to Collabrix! 🚀\nconsole.log("Hello, World!");`,
    typescript: `// Welcome to Collabrix! 🚀\nconst message: string = "Hello, World!";\nconsole.log(message);`,
    python: `# Welcome to Collabrix! 🚀\nprint("Hello, World!")`,
    java: `// Welcome to Collabrix! 🚀\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    cpp: `// Welcome to Collabrix! 🚀\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
    c: `// Welcome to Collabrix! 🚀\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
    go: `// Welcome to Collabrix! 🚀\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
    rust: `// Welcome to Collabrix! 🚀\nfn main() {\n    println!("Hello, World!");\n}`,
    kotlin: `// Welcome to Collabrix! 🚀\nfun main() {\n    println("Hello, World!")\n}`,
    swift: `// Welcome to Collabrix! 🚀\nprint("Hello, World!")`,
    php: `<?php\n// Welcome to Collabrix! 🚀\necho "Hello, World!\\n";`,
    ruby: `# Welcome to Collabrix! 🚀\nputs "Hello, World!"`,
  };
  return defaults[language] || `// Welcome to Collabrix! 🚀\nconsole.log("Hello, World!");`;
}

const COLORS = [
  "#E57373", "#F06292", "#BA68C8", "#9575CD",
  "#7986CB", "#64B5F6", "#4FC3F7", "#4DD0E1",
  "#4DB6AC", "#81C784", "#AED581", "#FFD54F",
];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}
