"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import UpgradeModal from "./UpgradeModal";

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "kotlin", label: "Kotlin" },
  { value: "swift", label: "Swift" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
];

interface Props {
  roomCount: number;
  plan: string;
}

export default function CreateRoom({ roomCount, plan }: Props) {
  const [open, setOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const maxRooms = plan === "pro" ? Infinity : 3;
  const isLimitReached = roomCount >= maxRooms;

  const handleNewRoom = () => {
    if (isLimitReached) {
      setShowUpgrade(true);
    } else {
      setOpen(true);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, language }),
      });

      const data = await res.json();

      if (data.room) {
        setOpen(false);
        setName("");
        router.push(`/room/${data.room.id}`);
      } else if (data.error === "LIMIT_REACHED") {
        setOpen(false);
        setShowUpgrade(true);
      }
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Upgrade Modal */}
      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
      />

      {/* Create Room Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={handleNewRoom}
            className={`gap-2 ${
              isLimitReached
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                : "bg-violet-600 hover:bg-violet-700 text-white"
            }`}
          >
            {isLimitReached ? (
              <>
                <Lock className="w-4 h-4" />
                Limit Reached
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                New Room
              </>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-gray-900 border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              Create New Room
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Room Name</Label>
              <Input
                placeholder="e.g. Graph Problems Practice"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Programming Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {languages.map((lang) => (
                    <SelectItem
                      key={lang.value}
                      value={lang.value}
                      className="text-white hover:bg-gray-700"
                    >
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleCreate}
              disabled={!name.trim() || loading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Room"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}