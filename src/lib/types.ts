export type GoalStatus = "active" | "paused" | "completed";
export type Mood = "great" | "good" | "neutral" | "bad" | "terrible";
export type SupporterStatus = "pending" | "active" | "removed";
export type FriendshipStatus = "pending" | "active" | "removed";
export type MessageType = "message" | "reaction";
export type AchievementRarity = "bronze" | "silver" | "gold" | "platinum" | "diamond";
export type AchievementCondition = "streak" | "checkin_count" | "supporter_count" | "custom";
export type Theme = "light" | "dark";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  theme: Theme;
  push_subscription: Record<string, unknown> | null;
  onboarding_completed: boolean;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: GoalStatus;
  current_streak: number;
  best_streak: number;
  last_checkin_date: string | null;
  order: number;
  created_at: string;
}

export interface Checkin {
  id: string;
  goal_id: string;
  date: string;
  score: 1 | 2 | 3 | 4 | 5;
  note: string | null;
  mood: Mood;
  is_offline_sync: boolean;
  created_at: string;
}

export interface Supporter {
  id: string;
  goal_id: string;
  user_id: string | null;
  invite_code: string;
  status: SupporterStatus;
  can_see_score: boolean;
  can_see_notes: boolean;
  invited_at: string;
  accepted_at: string | null;
}

export interface Message {
  id: string;
  goal_id: string;
  from_user_id: string;
  to_user_id: string;
  content: string;
  type: MessageType;
  reaction_emoji: string | null;
  read_at: string | null;
  created_at: string;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: FriendshipStatus;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  condition_type: AchievementCondition;
  condition_value: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  goal_id: string | null;
  unlocked_at: string;
}

export const SCORE_OPTIONS = [
  { value: 1 as const, emoji: "😔", label: "Difícil", mood: "terrible" as Mood },
  { value: 2 as const, emoji: "😕", label: "Complicado", mood: "bad" as Mood },
  { value: 3 as const, emoji: "😐", label: "Normal", mood: "neutral" as Mood },
  { value: 4 as const, emoji: "🙂", label: "Bom", mood: "good" as Mood },
  { value: 5 as const, emoji: "😊", label: "Ótimo", mood: "great" as Mood },
] as const;

export const REACTION_OPTIONS = [
  { emoji: "❤️", label: "Coração" },
  { emoji: "💪", label: "Força" },
  { emoji: "👏", label: "Palma" },
  { emoji: "🤗", label: "Abraço" },
] as const;

export const ACHIEVEMENT_SEEDS: Omit<Achievement, "created_at">[] = [
  { id: "first-checkin", name: "Primeiro Passo", description: "Fez o primeiro check-in", icon: "footprints", rarity: "bronze", condition_type: "checkin_count", condition_value: 1 },
  { id: "week-streak", name: "Semana Firme", description: "7 dias de streak", icon: "flame", rarity: "bronze", condition_type: "streak", condition_value: 7 },
  { id: "strong-network", name: "Rede Forte", description: "3+ apoiadores ativos", icon: "users", rarity: "bronze", condition_type: "supporter_count", condition_value: 3 },
  { id: "not-alone", name: "Não Sozinho", description: "Primeiro apoiador aceito", icon: "heart-handshake", rarity: "bronze", condition_type: "supporter_count", condition_value: 1 },
  { id: "fortnight-streak", name: "Quinzena", description: "14 dias de streak", icon: "calendar-check", rarity: "silver", condition_type: "streak", condition_value: 14 },
  { id: "multi-journey", name: "Multi-Jornada", description: "2+ metas ativas", icon: "layers", rarity: "silver", condition_type: "custom", condition_value: 2 },
  { id: "confidant", name: "Confidente", description: "Enviou 10 mensagens como apoiador", icon: "message-circle-heart", rarity: "silver", condition_type: "custom", condition_value: 10 },
  { id: "month-streak", name: "Mês de Ferro", description: "30 dias de streak", icon: "shield-check", rarity: "gold", condition_type: "streak", condition_value: 30 },
  { id: "comeback", name: "Volta por Cima", description: "Retomou streak após quebra", icon: "rotate-ccw", rarity: "gold", condition_type: "custom", condition_value: 1 },
  { id: "consistency", name: "Constância", description: "30 check-ins com score 4+", icon: "trending-up", rarity: "gold", condition_type: "custom", condition_value: 30 },
  { id: "quarter-streak", name: "Trimestre", description: "90 dias de streak", icon: "trophy", rarity: "platinum", condition_type: "streak", condition_value: 90 },
  { id: "semester-streak", name: "Semestre", description: "180 dias de streak", icon: "crown", rarity: "platinum", condition_type: "streak", condition_value: 180 },
  { id: "year-streak", name: "Um Ano", description: "365 dias de streak", icon: "diamond", rarity: "diamond", condition_type: "streak", condition_value: 365 },
];
