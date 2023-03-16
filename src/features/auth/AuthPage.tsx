import { Auth } from '@supabase/auth-ui-react'
import {
  ThemeSupa
} from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { createSupabaseClient } from '~/queries/supabase'
import { useUserQuery } from '~/hooks/useUser'

export const AuthPage = () => {
  const supabaseClient = createSupabaseClient()
  const user = useUserQuery()

  const router = useRouter()

  if (!user) {

    return (
      <>
        <h1 className='text-4xl'>Sign up</h1>
        <Auth
          redirectTo="http://localhost:3000/"
          appearance={{ theme: ThemeSupa }}
          supabaseClient={supabaseClient}
          providers={['google', 'facebook', 'twitter']}
          onlyThirdPartyProviders
          socialLayout="vertical"
        />
      </>
    )

  }
  else router.push('/')
}