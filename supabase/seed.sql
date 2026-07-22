INSERT INTO public.role_permissions (role, permissions) VALUES
  ('manager', ARRAY['create:user', 'read:users', 'delete:user', 'create:invoice', 'delete:invoice']::public.user_permissions[]),
  ('student', ARRAY['create:invoice']::public.user_permissions[]);