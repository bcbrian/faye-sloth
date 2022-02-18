import { createContext, useContext, useEffect, useState } from "react";
import { AuthUser } from "~/utils/session.server";

export const AuthContext = createContext<AuthUser | null>(null);

export function AuthProvider({
  children,
  user: userProp,
}: {
  children: React.ReactNode;
  user: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(userProp);

  useEffect(() => {
    setUser(userProp);
  }, [userProp]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
