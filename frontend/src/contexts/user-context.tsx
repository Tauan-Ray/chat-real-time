"use client"

import { logout } from "@/app/actions/auth";
import { deleteSession, getUser, UserProps } from "@/app/lib/session"
import { HttpStatusCode } from "axios";
import * as React from "react"
import { toast } from "sonner";

const UserContext = React.createContext<UserProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<UserProps>();

  React.useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        const res = await getUser();
        if (!res?.message) {
          setUser(res);
        } else {
          if (res.status == HttpStatusCode.Unauthorized) {
            toast.warning("Login expirado!", {
              description: "Necessário realizar login novamente",
            })

            logout()
          } else {
            console.log(res);

            toast.error('Atenção', {
              description: res.message,
            })
          }
        }
      }
    };
    fetchUser();
  }, [user]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export const useUser = () => React.useContext(UserContext);