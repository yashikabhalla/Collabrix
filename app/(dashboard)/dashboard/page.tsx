import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Code2, Users, Trophy, Zap, Lock } from "lucide-react";
import CreateRoom from "@/components/dashboard/CreateRoom";
import RoomCard from "@/components/dashboard/RoomCard";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) redirect("/sign-in");

  let user = await db.user.findUnique({ where: { clerkId: userId } });

  if (!user) {
    user = await db.user.create({
      data: {
        clerkId: userId,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        email: clerkUser.emailAddresses[0].emailAddress,
        avatar: clerkUser.imageUrl,
      },
    });
  }

  const isPro = user.plan === "pro";

  if (user.plan === "free") {
    const allRooms = await db.room.findMany({
      where: { createdBy: userId },
      orderBy: { createdAt: "desc" },
    });
    if (allRooms.length > 3) {
      const excessRooms = allRooms.slice(3);
      await db.room.deleteMany({ where: { id: { in: excessRooms.map((r) => r.id) } } });
    }
  }

  const rooms = await db.room.findMany({
    where: { createdBy: userId },
    orderBy: { createdAt: "desc" },
  });

  const roomsLeft = isPro ? null : Math.max(0, 3 - rooms.length);
  const usagePercent = Math.min((rooms.length / 3) * 100, 100);

  return (
    <div className="min-h-screen bg-[#0e0e10]">

      {/* Navbar */}
      <nav className="border-b border-[#27272a] bg-[#0e0e10]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center transition-all duration-150 group-hover:bg-indigo-500">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#fafafa] font-medium text-[15px] tracking-tight">Collabrix</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {["Home", "Features", "Pricing"].map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/#${item.toLowerCase()}`}
                  className="text-[#71717a] hover:text-[#fafafa] text-sm transition-colors duration-150"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isPro && (
              <span className="text-xs bg-[#1e1b4b] border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full">
                Pro
              </span>
            )}
            <span className="text-[#52525b] text-sm hidden md:block">
              Hey, {clerkUser.firstName}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-medium text-[#fafafa] mb-1 tracking-tight">Your rooms</h1>
            <p className="text-[#52525b] text-sm">Create or join a room to start coding together</p>
          </div>
          <CreateRoom roomCount={rooms.length} plan={user.plan} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              icon: Code2,
              label: "Total rooms",
              value: rooms.length.toString(),
              accent: "#6366f1",
              bg: "#1e1b4b",
            },
            {
              icon: Users,
              label: "Current plan",
              value: isPro ? "Pro" : "Free",
              accent: isPro ? "#f59e0b" : "#06b6d4",
              bg: isPro ? "#451a03" : "#0c4a6e",
            },
            {
              icon: Trophy,
              label: "Rooms left",
              value: isPro ? "∞" : `${roomsLeft}/3`,
              accent: "#22c55e",
              bg: "#052e16",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: stat.bg }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.accent }} />
              </div>
              <div>
                <p className="text-[#52525b] text-xs mb-0.5">{stat.label}</p>
                <p className="text-[#fafafa] text-xl font-medium">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Free plan usage bar */}
        {!isPro && (
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[#fafafa] text-sm font-medium">Free plan usage</p>
                <p className="text-[#52525b] text-xs mt-0.5">{rooms.length} of 3 rooms used</p>
              </div>
              <Link href="/#pricing">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-8 px-3 rounded-lg gap-1.5 transition-all duration-150">
                  <Zap className="w-3 h-3" />
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
            <div className="w-full bg-[#27272a] rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${usagePercent}%`,
                  background: rooms.length >= 3 ? "#ef4444" : rooms.length >= 2 ? "#f59e0b" : "#6366f1",
                }}
              />
            </div>
            {rooms.length >= 3 && (
              <p className="text-red-400 text-xs mt-2">Room limit reached. Upgrade to Pro to create more rooms.</p>
            )}
          </div>
        )}

        {/* Locked Pro features */}
        {!isPro && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {[
              { icon: "🎥", label: "Video calling", desc: "Face-to-face mock interviews" },
              { icon: "📼", label: "Session recordings", desc: "Record and replay your sessions" },
            ].map((feature) => (
              <div key={feature.label} className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 flex items-center gap-3 opacity-50">
                <div className="w-8 h-8 bg-[#27272a] rounded-lg flex items-center justify-center text-base flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#a1a1aa] text-sm font-medium">{feature.label}</p>
                  <p className="text-[#52525b] text-xs">{feature.desc}</p>
                </div>
                <Lock className="w-3.5 h-3.5 text-[#3f3f46] flex-shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* Rooms grid */}
        {rooms.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#27272a] rounded-xl">
            <div className="w-12 h-12 bg-[#1e1b4b] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Code2 className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-[#fafafa] text-base font-medium mb-1">No rooms yet</h3>
            <p className="text-[#52525b] text-sm mb-6">Create your first room and start coding with friends</p>
            <CreateRoom roomCount={rooms.length} plan={user.plan} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={{ ...room, createdAt: room.createdAt.toISOString() }}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
