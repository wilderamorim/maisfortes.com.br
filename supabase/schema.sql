-- +Fortes Database Schema (Completo)
-- Run this in the Supabase SQL Editor
-- Atualizado: 2026-04-09

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Users (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text not null default '',
  avatar_url text,
  theme text not null default 'light' check (theme in ('light', 'dark')),
  push_subscription jsonb,
  notification_time smallint not null default 21 check (notification_time between 0 and 23),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Goals
create table public.goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  current_streak int not null default 0,
  best_streak int not null default 0,
  last_checkin_date date,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

-- Check-ins
create table public.checkins (
  id uuid primary key default uuid_generate_v4(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  date date not null,
  score smallint not null check (score between 1 and 5),
  note text check (char_length(note) <= 500),
  mood text not null check (mood in ('great', 'good', 'neutral', 'bad', 'terrible')),
  is_offline_sync boolean not null default false,
  created_at timestamptz not null default now(),
  unique(goal_id, date)
);

-- Supporters
create table public.supporters (
  id uuid primary key default uuid_generate_v4(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  invite_code text not null unique default encode(gen_random_bytes(6), 'hex'),
  status text not null default 'pending' check (status in ('pending', 'active', 'removed')),
  can_see_score boolean not null default true,
  can_see_notes boolean not null default false,
  invited_at timestamptz not null default now(),
  accepted_at timestamptz
);

-- Messages
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  from_user_id uuid not null references public.users(id) on delete cascade,
  to_user_id uuid not null references public.users(id) on delete cascade,
  content text not null check (char_length(content) <= 500),
  type text not null default 'message' check (type in ('message', 'reaction')),
  reaction_emoji text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Friendships
create table public.friendships (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  friend_id uuid not null references public.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'active', 'removed')),
  created_at timestamptz not null default now(),
  unique(user_id, friend_id)
);

-- Achievements (static catalog)
create table public.achievements (
  id text primary key,
  name text not null,
  description text not null,
  icon text not null,
  rarity text not null check (rarity in ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  condition_type text not null check (condition_type in ('streak', 'checkin_count', 'supporter_count', 'custom')),
  condition_value int not null,
  created_at timestamptz not null default now()
);

-- User Achievements (unlocked)
create table public.user_achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  achievement_id text not null references public.achievements(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  unlocked_at timestamptz not null default now(),
  unique(user_id, achievement_id, goal_id)
);

-- Notifications (in-app)
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  icon text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================
-- INDEXES
-- ============================================

create index idx_goals_user_id on public.goals(user_id);
create index idx_goals_status on public.goals(status);
create index idx_checkins_goal_id on public.checkins(goal_id);
create index idx_checkins_date on public.checkins(date);
create index idx_supporters_goal_id on public.supporters(goal_id);
create index idx_supporters_user_id on public.supporters(user_id);
create index idx_supporters_invite_code on public.supporters(invite_code);
create index idx_messages_goal_id on public.messages(goal_id);
create index idx_messages_to_user on public.messages(to_user_id);
create index idx_friendships_user_id on public.friendships(user_id);
create index idx_friendships_friend_id on public.friendships(friend_id);
create index idx_user_achievements_user_id on public.user_achievements(user_id);
create index idx_notifications_user on public.notifications(user_id);
create index idx_notifications_unread on public.notifications(user_id) where read_at is null;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.users enable row level security;
alter table public.goals enable row level security;
alter table public.checkins enable row level security;
alter table public.supporters enable row level security;
alter table public.messages enable row level security;
alter table public.friendships enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.notifications enable row level security;

-- Users: own profile
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.users for insert with check (auth.uid() = id);

-- Goals: own goals
create policy "Users can CRUD own goals" on public.goals for all using (auth.uid() = user_id);

-- Checkins: owner can CRUD
create policy "Users can CRUD own checkins" on public.checkins for all using (
  goal_id in (select id from public.goals where user_id = auth.uid())
);

-- Supporters: goal owner manages
create policy "Goal owner manages supporters" on public.supporters for all using (
  goal_id in (select id from public.goals where user_id = auth.uid())
);
create policy "Supporters can view own records" on public.supporters for select using (auth.uid() = user_id);
create policy "Supporters can accept invite" on public.supporters for update using (auth.uid() = user_id);

-- NOTE: Supporter access to goals/checkins handled at application layer (avoids RLS recursion)

-- Messages
create policy "Message participants can view" on public.messages for select using (
  auth.uid() = from_user_id or auth.uid() = to_user_id
);
create policy "Authenticated users can send messages" on public.messages for insert with check (auth.uid() = from_user_id);
create policy "Recipient can update read_at" on public.messages for update using (auth.uid() = to_user_id);

-- Friendships
create policy "Users manage own friendships" on public.friendships for all using (
  auth.uid() = user_id or auth.uid() = friend_id
);

-- Achievements
create policy "Anyone can read achievements" on public.achievements for select to authenticated using (true);

-- User achievements
create policy "Users can view own achievements" on public.user_achievements for select using (auth.uid() = user_id);
create policy "System can insert achievements" on public.user_achievements for insert with check (auth.uid() = user_id);

-- Notifications
create policy "Users see own notifications" on public.notifications for all using (auth.uid() = user_id);

-- ============================================
-- SEED: Achievements
-- ============================================

insert into public.achievements (id, name, description, icon, rarity, condition_type, condition_value) values
  ('first-checkin', 'Primeiro Passo', 'Fez o primeiro check-in', 'footprints', 'bronze', 'checkin_count', 1),
  ('week-streak', 'Semana Firme', '7 dias de streak', 'flame', 'bronze', 'streak', 7),
  ('strong-network', 'Rede Forte', '3+ apoiadores ativos', 'users', 'bronze', 'supporter_count', 3),
  ('not-alone', 'Não Sozinho', 'Primeiro apoiador aceito', 'heart-handshake', 'bronze', 'supporter_count', 1),
  ('fortnight-streak', 'Quinzena', '14 dias de streak', 'calendar-check', 'silver', 'streak', 14),
  ('multi-journey', 'Multi-Jornada', '2+ metas ativas', 'layers', 'silver', 'custom', 2),
  ('confidant', 'Confidente', 'Enviou 10 mensagens como apoiador', 'message-circle-heart', 'silver', 'custom', 10),
  ('month-streak', 'Mês de Ferro', '30 dias de streak', 'shield-check', 'gold', 'streak', 30),
  ('comeback', 'Volta por Cima', 'Retomou streak após quebra', 'rotate-ccw', 'gold', 'custom', 1),
  ('consistency', 'Constância', '30 check-ins com score 4+', 'trending-up', 'gold', 'custom', 30),
  ('quarter-streak', 'Trimestre', '90 dias de streak', 'trophy', 'platinum', 'streak', 90),
  ('semester-streak', 'Semestre', '180 dias de streak', 'crown', 'platinum', 'streak', 180),
  ('year-streak', 'Um Ano', '365 dias de streak', 'diamond', 'diamond', 'streak', 365)
on conflict (id) do nothing;

-- ============================================
-- FUNCTION: Auto-create user profile on signup
-- ============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
