-- Create profiles table
create table profiles (
  id uuid primary key references auth.users,
  username text,
  full_name text,
  avatar_url text,
  website text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on profiles
alter table profiles enable row level security;

-- Create policy for profiles - users can read all profiles
create policy "Profiles are viewable by everyone" 
on profiles for select 
using (true);

-- Create policy for profiles - users can update only their own profile
create policy "Users can update their own profile" 
on profiles for update 
using ((auth.uid() = id));

-- Create projects table
create table projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  status text default 'active',
  last_active timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on projects
alter table projects enable row level security;

-- Create policy for projects - users can CRUD only their own projects
create policy "Users can view their own projects" 
on projects for select 
using (auth.uid() = user_id);

create policy "Users can create their own projects" 
on projects for insert 
with check (auth.uid() = user_id);

create policy "Users can update their own projects" 
on projects for update 
using (auth.uid() = user_id);

create policy "Users can delete their own projects" 
on projects for delete 
using (auth.uid() = user_id);

-- Create user_settings table
create table user_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  theme text default 'dark',
  email_notifications boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- Enable RLS on user_settings
alter table user_settings enable row level security;

-- Create policy for user_settings - users can CRUD only their own settings
create policy "Users can view their own settings" 
on user_settings for select 
using (auth.uid() = user_id);

create policy "Users can create their own settings" 
on user_settings for insert 
with check (auth.uid() = user_id);

create policy "Users can update their own settings" 
on user_settings for update 
using (auth.uid() = user_id);

-- Create trigger function for new user profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'full_name'
  );
  
  insert into public.user_settings (user_id)
  values (new.id);
  
  return new;
end;
$$;

-- Create trigger for new users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 

-- Add agents column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS agents TEXT[] DEFAULT '{}'; 