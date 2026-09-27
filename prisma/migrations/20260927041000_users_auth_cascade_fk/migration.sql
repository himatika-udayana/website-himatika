ALTER TABLE public.users
	ADD CONSTRAINT users_auth_cascade_fk
	FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
