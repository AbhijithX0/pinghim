import type { EmotionalCategory } from "@/lib/types";

export type PingButton = {
  text: string;
  tone?: "rose" | "indigo" | "sage";
};

export type CategoryGroup = {
  name: EmotionalCategory;
  hint: string;
  buttons: PingButton[];
};

export const urgentPing = "I really need you";

export const categories: CategoryGroup[] = [
  {
    name: "NEED / SUPPORT",
    hint: "For the moments when you need steadiness, softness, or someone's emotional hand.",
    buttons: [
      { text: "I need you", tone: "rose" },
      { text: "Stay with me" },
      { text: "I need comfort" },
      { text: "Hold me emotionally", tone: "indigo" },
      { text: "Please check on me" },
      { text: "I need reassurance" },
      { text: "I want to feel safe", tone: "sage" },
      { text: "I need your presence" },
      { text: "Do not leave me right now" },
      { text: "Please be gentle with me" }
    ]
  },
  {
    name: "LOW / SAD",
    hint: "For quiet heaviness, tears, emptiness, and the ache of not feeling like yourself.",
    buttons: [
      { text: "I am low today" },
      { text: "I feel empty" },
      { text: "I am not okay" },
      { text: "I already cried", tone: "rose" },
      { text: "I feel emotionally tired" },
      { text: "Today feels heavy" },
      { text: "Nothing feels right" },
      { text: "I feel numb and sad" },
      { text: "I need a hug", tone: "sage" },
      { text: "Please sit in this with me" }
    ]
  },
  {
    name: "STRESS / ANXIETY",
    hint: "For spirals, pressure, panic, and the need to come back into your body.",
    buttons: [
      { text: "I am overwhelmed" },
      { text: "I am anxious" },
      { text: "My mind will not stop" },
      { text: "I am panicking", tone: "rose" },
      { text: "I need grounding", tone: "sage" },
      { text: "Too much right now" },
      { text: "I feel pressure" },
      { text: "Please help me slow down" },
      { text: "I need a steady voice" },
      { text: "Can you help me breathe?" }
    ]
  },
  {
    name: "MISSING YOU",
    hint: "For distance, longing, and the soft ache of wanting them closer.",
    buttons: [
      { text: "I miss you" },
      { text: "I miss your voice" },
      { text: "I wish you were here" },
      { text: "Thinking about you" },
      { text: "I need your presence" },
      { text: "I am craving closeness", tone: "rose" },
      { text: "Come talk to me" },
      { text: "I keep reaching for you in my mind" },
      { text: "I want one long hug" },
      { text: "I miss us in small ways all day" }
    ]
  },
  {
    name: "NIGHT / LONELY HOURS",
    hint: "For the late, tender, restless hours when everything feels louder.",
    buttons: [
      { text: "Can not sleep" },
      { text: "I woke up" },
      { text: "Stay with me tonight", tone: "rose" },
      { text: "Night feels heavy" },
      { text: "Talk me to sleep" },
      { text: "I feel alone right now" },
      { text: "I do not want to fall asleep far from you" },
      { text: "Can you send me a soft goodnight?" },
      { text: "Please keep me company for a minute" }
    ]
  },
  {
    name: "LOVE / AFFECTION",
    hint: "For warmth, gratitude, devotion, and the simple sweetness of loving them.",
    buttons: [
      { text: "I love you" },
      { text: "You matter to me" },
      { text: "I appreciate you" },
      { text: "You make me feel safe", tone: "rose" },
      { text: "I adore you" },
      { text: "You are my comfort" },
      { text: "I am grateful for you" },
      { text: "I feel lucky to love you" },
      { text: "My heart feels soft for you", tone: "sage" },
      { text: "I want you to feel loved today" }
    ]
  },
  {
    name: "CONFLICT / REPAIR",
    hint: "For hurt, tension, and trying to move back toward each other without armor.",
    buttons: [
      { text: "I feel hurt" },
      { text: "I am upset" },
      { text: "I miss us" },
      { text: "Can we talk calmly?" },
      { text: "I want to fix this", tone: "sage" },
      { text: "I do not want distance between us" },
      { text: "I need repair, not winning" },
      { text: "Please come back to me softly" },
      { text: "I am ready to listen" },
      { text: "Can we try again with tenderness?", tone: "rose" }
    ]
  },
  {
    name: "CHECK-IN",
    hint: "For practical, loving check-ins that still feel caring instead of routine.",
    buttons: [
      { text: "How are you?" },
      { text: "Have you eaten?" },
      { text: "Are you resting?" },
      { text: "How was your day?" },
      { text: "I am thinking of you" },
      { text: "How is your heart?" },
      { text: "Do you need anything from me?" },
      { text: "Are you carrying too much today?" },
      { text: "Tell me how you really are" },
      { text: "I am here when you want to surface" }
    ]
  },
  {
    name: "HAPPY / GOOD MOMENTS",
    hint: "For joy, relief, delight, and those little bright things you want them in on.",
    buttons: [
      { text: "I am smiling thinking of you" },
      { text: "Something good happened" },
      { text: "I want to share this" },
      { text: "I feel good today", tone: "sage" },
      { text: "Guess what?" },
      { text: "I laughed and wanted you here" },
      { text: "This made me think of us" },
      { text: "I feel light for the first time today" },
      { text: "Come celebrate this with me" }
    ]
  },
  {
    name: "QUICK CONNECTION",
    hint: "For immediate contact when you just need a fast thread back to each other.",
    buttons: [
      { text: "Call me", tone: "rose" },
      { text: "Text me" },
      { text: "Come online" },
      { text: "Need quick reply" },
      { text: "Ping me back" },
      { text: "Can you send one line?" },
      { text: "Need a tiny moment with you" },
      { text: "Just let me feel you there" },
      { text: "Reply when you see me" }
    ]
  },
  {
    name: "SOFT / INTIMATE",
    hint: "For tenderness, warmth, attention, and quiet emotional closeness.",
    buttons: [
      { text: "Be soft with me" },
      { text: "I need closeness" },
      { text: "Stay connected" },
      { text: "Come closer", tone: "rose" },
      { text: "I need warmth" },
      { text: "I want your attention" },
      { text: "Please hold me gently" },
      { text: "I want a soft moment with you" },
      { text: "Love me slowly for a minute" },
      { text: "I feel emotionally open with you", tone: "sage" }
    ]
  },
  {
    name: "SONG / MOOD",
    hint: "For feelings that make more sense through music than explanation.",
    buttons: [
      { text: "This song is you", tone: "rose" },
      { text: "Listen to this" },
      { text: "This reminded me of you" },
      { text: "Play this when you miss me" },
      { text: "I found our mood in a song" },
      { text: "This lyric feels like my heart" },
      { text: "Send me a song for how you feel" },
      { text: "I want to hear what your day sounds like" },
      { text: "This song made me need you" }
    ]
  },
  {
    name: "SPECIAL / RARE",
    hint: "For the hard-to-name states that need presence more than fixing.",
    buttons: [
      { text: "I feel disconnected" },
      { text: "I need silence with you" },
      { text: "No words needed" },
      { text: "Just be there" },
      { text: "Sit with me", tone: "sage" },
      { text: "Stay present" },
      { text: "I can not explain this, but I need you" },
      { text: "Please meet me gently" },
      { text: urgentPing, tone: "rose" }
    ]
  }
];
