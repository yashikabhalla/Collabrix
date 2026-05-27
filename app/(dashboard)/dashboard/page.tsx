import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Code2, Users, Trophy, Zap } from "lucide-react";
import CreateRoom from "@/components/dashboard/CreateRoom";
import RoomCard from "@/components/dashboard/RoomCard";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) {
    redirect("/sign-in");
  }

  // Sync user to database
  let user = await db.user.findUnique({
    where: { clerkId: userId },
  });

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

  // Fetch rooms
  const rooms = await db.room.findMany({
    where: { createdBy: userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-black">

      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">Collabrix</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                Home
              </Link>
              <Link href="/#features" className="text-gray-400 hover:text-white text-sm transition-colors">
                Features
              </Link>
              <Link href="/#pricing" className="text-gray-400 hover:text-white text-sm transition-colors">
                Pricing
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden md:block">
              Hey, {clerkUser.firstName}! 👋
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Your Rooms
            </h1>
            <p className="text-gray-400">
              Create or join a room to start coding together
            </p>
          </div>
          <CreateRoom roomCount={rooms.length} plan={user.plan} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: Code2,
              label: "Total Rooms",
              value: rooms.length.toString(),
              color: "text-violet-400",
              bg: "bg-violet-400/10",
            },
            {
              icon: Users,
              label: "Current Plan",
              value: user.plan === "pro" ? "Pro ⚡" : "Free",
              color: user.plan === "pro" ? "text-yellow-400" : "text-blue-400",
              bg: user.plan === "pro" ? "bg-yellow-400/10" : "bg-blue-400/10",
            },
            {
              icon: Trophy,
              label: "Rooms Left",
              value: user.plan === "pro" ? "∞" : `${Math.max(0, 3 - rooms.length)}/3`,
              color: "text-yellow-400",
              bg: "bg-yellow-400/10",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4"
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-white text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Usage Bar — only for free users */}
        {user.plan === "free" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-medium">Free Plan Usage</p>
                <p className="text-gray-400 text-sm">
                  {rooms.length} of 3 rooms used
                </p>
              </div>
              <Button
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-white gap-1"
              >
                <Zap className="w-3 h-3" />
                Upgrade to Pro
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  rooms.length >= 3
                    ? "bg-red-500"
                    : rooms.length >= 2
                    ? "bg-yellow-500"
                    : "bg-violet-600"
                }`}
                style={{ width: `${Math.min((rooms.length / 3) * 100, 100)}%` }}
              />
            </div>

            {rooms.length >= 3 && (
              <p className="text-red-400 text-xs mt-2">
                ⚠️ Room limit reached. Upgrade to create more rooms.
              </p>
            )}
          </div>
        )}

        {/* Rooms Grid */}
        {rooms.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-violet-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Code2 className="w-8 h-8 text-violet-400" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">
              No rooms yet
            </h3>
            <p className="text-gray-400 mb-6">
              Create your first room and start coding with friends!
            </p>
            <CreateRoom roomCount={rooms.length} plan={user.plan} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={{
                  ...room,
                  createdAt: room.createdAt.toISOString(),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}