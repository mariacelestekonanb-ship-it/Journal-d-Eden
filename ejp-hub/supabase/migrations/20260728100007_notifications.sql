-- =============================================================================
-- notifications — structure uniquement (module à venir)
-- La génération des notifications (nouveaux sujets, CR en attente, créneaux à
-- venir) sera implémentée avec les modules concernés, pas à ce stade.
-- =============================================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  message text not null,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.notifications is 'Notifications applicatives par utilisateur.';

create index if not exists notifications_user_unread_idx on public.notifications (user_id, read_at);
