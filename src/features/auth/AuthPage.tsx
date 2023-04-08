import { Auth } from '@supabase/auth-ui-react'
import {
  ThemeSupa
} from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { useUserQuery } from '~/hooks/useUser'
import useSupabase from '~/hooks/useSupabase'

export const AuthPage = () => {
  const supabaseClient = useSupabase()
  const { data: user } = useUserQuery()

  const getRedirectURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      'http://localhost:3000/';
    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`;
    // Make sure to including trailing `/`.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    return url;
  };


  const router = useRouter()

  if (user === undefined) {
    return (
      <>
        <Auth
          redirectTo={getRedirectURL()}
          appearance={{ theme: ThemeSupa }}
          supabaseClient={supabaseClient}
          providers={['google']}
          socialLayout="vertical"
        />
      </>
    )

  }
  else router.push('/')
}