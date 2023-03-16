import { User } from "@supabase/supabase-js"
import { createContext } from "react"
import { useUserQuery } from "~/hooks/useUser"

interface ContextProps {
  children: React.ReactNode
}

export const UserContextProvider = ({ children }: ContextProps) => {

  const { data: user } = useUserQuery()

  const UserContext = createContext<{ user?: User }>({
    user
  })

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>


}