-- FIX: Infinite recursion in RLS policies
-- Run this in Supabase SQL Editor

-- Drop the problematic policies
drop policy if exists "Supporters can view supported goals" on public.goals;
drop policy if exists "Goal owner manages supporters" on public.supporters;
drop policy if exists "Supporters can view checkins" on public.checkins;
drop policy if exists "Users can CRUD own checkins" on public.checkins;

-- Recreate goals policies (only own goals, no supporter sub-query on goals)
-- The "Users can CRUD own goals" policy already handles owner access

-- Supporters: use goal_id directly, avoid querying goals table
create policy "Goal owner manages supporters" on public.supporters
  for all using (
    goal_id in (select id from public.goals where user_id = auth.uid())
  );

-- Checkins: use goal_id to find owner without recursion
create policy "Users can CRUD own checkins" on public.checkins
  for all using (
    goal_id in (select id from public.goals where user_id = auth.uid())
  );

-- For supporter access to goals and checkins, we'll handle it in the application layer
-- instead of RLS to avoid cross-table recursion. The app code already filters by supporter status.
