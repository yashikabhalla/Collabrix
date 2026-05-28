"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Code2, Play, Loader2, ArrowLeft, Copy, Check, Video, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";

const freeLanguages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

const proLanguages = [
  ...freeLanguages,
  { value: "kotlin", label: "Kotlin" },
  { value: "swift", label: "Swift" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
];

interface Props {
  room: { id: string; name: string; language: string };
  user: { id: string; name: string; avatar: string };
  language: string;
  onLanguageChange: (lang: string) => void;
  onRunCode: () => void;
  isRunning: boolean;
  presenceIndicators?: React.ReactNode;
  onVideoToggle: () => void;
  isVideoOn: boolean;
  userPlan: "free" | "pro";
}

export default function Toolbar({
  room,
  user,
  language,
  onLanguageChange,
  onRunCode,
  isRunning,
  presenceIndicators,
  onVideoToggle,
  isVideoOn,
  userPlan,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copyRoomLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/room/${room.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVideoClick = () => {
    if (userPlan === "free") {
      alert("Video calling is a Pro feature. Upgrade to Pro to use video calls.");
      return;
    }
    onVideoToggle();
  };

  return (
    <div className="h-13 border-b border-[#27272a] bg-[#0e0e10] flex items-center justify-between px-4 gap-4">

      {/* Left — back + room name */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b] gap-1.5 h-8 px-2.5 text-xs rounded-lg transition-all duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Button>
        </Link>

        <div className="w-px h-5 bg-[#27272a]" />

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
            <Code2 className="w-3 h-3 text-white" />
          </div>
          <span className="text-[#fafafa] font-medium text-sm hidden md:block tracking-tight">
            {room.name}
          </span>
        </div>
      </div>

      {/* Center — language + run */}
      <div className="flex items-center gap-2">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-34 bg-[#18181b] border-[#27272a] text-[#a1a1aa] h-8 text-xs rounded-lg hover:border-[#3f3f46] transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#18181b] border-[#27272a]" position="popper" sideOffset={5}>
            {(userPlan === "pro" ? proLanguages : freeLanguages).map((lang) => (
              <SelectItem
                key={lang.value}
                value={lang.value}
                className="text-[#a1a1aa] hover:text-[#fafafa] focus:bg-[#27272a] text-xs cursor-pointer"
              >
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={onRunCode}
          disabled={isRunning}
          size="sm"
          className="bg-[#052e16] hover:bg-green-600 text-green-400 hover:text-white border border-green-500/30 hover:border-green-500 h-8 px-3 text-xs rounded-lg gap-1.5 transition-all duration-150"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-3 h-3" />
              Run
            </>
          )}
        </Button>
      </div>

      {/* Right — presence + video + share + user */}
      <div className="flex items-center gap-2">
        {presenceIndicators}

        {/* Video button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleVideoClick}
          className={`hidden md:flex h-8 px-2.5 text-xs rounded-lg gap-1.5 transition-all duration-150 ${
            userPlan === "free"
              ? "text-[#3f3f46] cursor-not-allowed"
              : isVideoOn
              ? "text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20"
              : "text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b]"
          }`}
        >
          {userPlan === "free" ? (
            <Lock className="w-3 h-3" />
          ) : (
            <Video className="w-3 h-3" />
          )}
          <span>{userPlan === "free" ? "Pro" : isVideoOn ? "End" : "Video"}</span>
        </Button>

        {/* Share button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={copyRoomLink}
          className="hidden md:flex h-8 px-2.5 text-xs rounded-lg gap-1.5 text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b] transition-all duration-150"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Share</span>
            </>
          )}
        </Button>

        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
