INSERT INTO public.role_permissions (role, permissions) VALUES
  ('manager', ARRAY['create:user', 'read:users', 'delete:user']::public.user_permissions[]),
  ('student', ARRAY[]::public.user_permissions[]);