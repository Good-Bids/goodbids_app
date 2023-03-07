import { Auth } from '@supabase/auth-ui-react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { ChangeEvent, useEffect, useState } from 'react'
import { Database } from '~/utils/types/supabase'
import { useRouter } from 'next/router'
import { SignInWithPasswordCredentials } from '@supabase/supabase-js'

export const LogInPage = () => {
  const supabaseClient = useSupabaseClient<Database>()
  const user = useUser()
  const router = useRouter()
  const [loginMethod, setLoginMethod] = useState<'OAuth' | 'email'>('email')
  const [loginData, setLoginData] = useState<SignInWithPasswordCredentials>({ email: '', password: '' })

  const handleLogin = (data: unknown) => {
    supabaseClient.auth.signInWithPassword(loginData).then((data) => { window.alert(data) }).catch((err) => {
      window.alert(err)
    })
  }

  const handleChange = (e: { target: { value: string, name: string } }) => {
    const target = e.target.name
    const newValue = e.target.value
    setLoginData(prior => ({ ...prior, [target]: newValue }))
  }



  if (!user) {

    return (
      <div className='flex flex-col w-50 overflow-scroll'>
        <h1 className='text-4xl font-bold'>Sign in</h1>
        <form>
          {['email', 'password'].map((field) => (
            <label className='block' key={field}>
              <span className='block text-sm font-medium text-slate-700'>{field}</span>
              <input
                type={field}
                name={field}
                value={loginData[field as keyof typeof loginData] as string}
                onChange={handleChange}
                className='class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500'/>
            </label>
          ))}
          <input type='submit' onSubmit={handleLogin} className='cursor-pointer' />
        </form>
      </div>
    )

  }
  else router.push('/auctions')
}