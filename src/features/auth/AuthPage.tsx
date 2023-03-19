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

  const router = useRouter()

  if (user === undefined) {
    return (
      <>
        <Auth
          redirectTo="http://localhost:3000/"
          appearance={{ theme: ThemeSupa }}
          supabaseClient={supabaseClient}
          providers={['google']}
          onlyThirdPartyProviders
          socialLayout="vertical"
        />
      </>
    )

  }
  else router.push('/')
}