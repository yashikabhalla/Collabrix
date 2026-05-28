import RoomClient from "@/components/editor/RoomClient";

export default function DemoPage() {
  return (
    <RoomClient
      room={{
        id: "demo-room-collabrix",
        name: "Demo Room ✦ Pro",
        language: "javascript",
      }}
      user={{
        id: "guest",
        name: "Guest User",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guest",
      }}
      isPro={true}
    />
  );
}