export const PLAN_LIMITS = {
  free: {
    maxRooms: 3,
    maxParticipants: 2,
    aiHints: 5,
    videoCall: true,
    label: "Free",
  },
  pro: {
    maxRooms: Infinity,
    maxParticipants: 5,
    aiHints: Infinity,
    videoCall: true,
    label: "Pro",
  },
};

export function getPlanLimits(plan: string) {
  return PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;
}

export function canCreateRoom(plan: string, currentRoomCount: number): boolean {
  const limits = getPlanLimits(plan);
  if (limits.maxRooms === Infinity) return true;
  return currentRoomCount < limits.maxRooms;
}