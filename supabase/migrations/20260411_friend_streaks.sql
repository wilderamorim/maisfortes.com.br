-- Friend Streaks (ofensiva de amigos)
create table public.friend_streaks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  user_goal_id uuid not null references public.goals(id) on delete cascade,
  user_goal_visible boolean not null default true,
  friend_id uuid not null references public.users(id) on delete cascade,
  friend_goal_id uuid references public.goals(id) on delete set null,
  friend_goal_visible boolean not null default true,
  target_days int not null default 30,
  current_streak int not null default 0,
  best_streak int not null default 0,
  last_both_date date,
  status text not null default 'pending' check (status in ('pending', 'active', 'broken', 'completed', 'removed')),
  created_at timestamptz not null default now()
);

create index idx_friend_streaks_user on public.friend_streaks(user_id);
create index idx_friend_streaks_friend on public.friend_streaks(friend_id);
create index idx_friend_streaks_status on public.friend_streaks(status);

alter table public.friend_streaks enable row level security;

create policy "Users manage own friend_streaks" on public.friend_streaks
  for all using (auth.uid() = user_id or auth.uid() = friend_id);

-- Update users profile visibility to use friend_streaks instead of friendships
drop policy if exists "Users can view friends profiles" on public.users;
create policy "Users can view friends profiles" on public.users for select using (
  id in (
    select friend_id from public.friend_streaks
    where user_id = auth.uid() and status in ('pending', 'active', 'completed')
    union
    select user_id from public.friend_streaks
    where friend_id = auth.uid() and status in ('pending', 'active', 'completed')
  )
);

-- Friend streak achievements
insert into public.achievements (id, name, description, icon, rarity, condition_type, condition_value) values
  ('first-friend-streak', 'Parceiros', 'Completou primeira ofensiva de amigos', 'handshake', 'bronze', 'custom', 1),
  ('friend-streak-3', 'Trio de Fogo', 'Completou 3 ofensivas de amigos', 'flame', 'silver', 'custom', 3),
  ('friend-streak-keeper', 'Guardião do Streak', 'Completou ofensiva de 60+ dias', 'shield', 'gold', 'custom', 1),
  ('friend-streak-legend', 'Lenda entre Amigos', 'Completou ofensiva de 90+ dias', 'award', 'platinum', 'custom', 1)
on conflict (id) do nothing;
