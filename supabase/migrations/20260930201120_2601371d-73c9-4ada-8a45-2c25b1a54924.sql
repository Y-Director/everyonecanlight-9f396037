UPDATE public.admin_accounts
SET email = 'hellochibuzorossai@gmail.com',
    updated_at = now()
WHERE email = 'hellochibuzor@gmail.com';

UPDATE public.activity_log
SET notified_emails = array_replace(notified_emails, 'hellochibuzor@gmail.com', 'hellochibuzorossai@gmail.com')
WHERE 'hellochibuzor@gmail.com' = ANY(notified_emails);