import { Auth } from '@supabase/auth-ui-react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { Database } from '~/utils/types/supabase'
import { useRouter } from 'next/router'

export const LogInPage = () => {
  const supabaseClient = useSupabaseClient<Database>()
  const user = useUser()
  const [data, setData] = useState<unknown>()

  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient.from('auction').select('*')
      setData(data)
    }
    // Only run query once user is logged in.
    if (user) loadData()
  }, [user])

  if (!user) {

    return (
      <Auth
        redirectTo="http://localhost:3000/"
        supabaseClient={supabaseClient}
        providers={['google', 'apple', 'facebook', 'twitter']}
        socialLayout="horizontal"
      />
    )

  }
  else router.push('/auctions')
}