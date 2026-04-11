-- Allow users to view the profile (name, avatar_url) of their active friends
create policy "Users can view friends profiles" on public.users for select using (
  id in (
    select friend_id from public.friendships
    where user_id = auth.uid() and status = 'active'
  )
);
