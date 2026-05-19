export type EmotionalCategory =
  | "NEED / SUPPORT"
  | "LOW / SAD"
  | "STRESS / ANXIETY"
  | "MISSING YOU"
  | "NIGHT / LONELY HOURS"
  | "LOVE / AFFECTION"
  | "CONFLICT / REPAIR"
  | "CHECK-IN"
  | "HAPPY / GOOD MOMENTS"
  | "QUICK CONNECTION"
  | "SOFT / INTIMATE"
  | "SONG / MOOD"
  | "SPECIAL / RARE";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  partnerId: string | null;
  inviteCode: string | null;
  telegramConnected: boolean;
};

export type Ping = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  category: EmotionalCategory;
  isUrgent: boolean;
  createdAt: string;
  seenAt: string | null;
  respondedAt: string | null;
};

export type Response = {
  id: string;
  pingId: string;
  senderId: string;
  type: "quick" | "text";
  message: string;
  createdAt: string;
};

export type SongDedication = {
  id: string;
  senderId: string;
  receiverId: string;
  title: string;
  youtubeLink: string;
  message: string;
  createdAt: string;
};

export type AudioNote = {
  id: string;
  senderId: string;
  receiverId: string;
  url: string;
  durationMs: number;
  createdAt: string;
};
