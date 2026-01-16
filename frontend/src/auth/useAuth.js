import { useMemo, useState } from "react";
import { authService } from "./auth.service";
import { authStorage } from "./auth.storage";

export function useAuth() {
  const [user, setUser] = useState(() => authStorage.getUser());

  const isAuthed = useMemo(() => !!authStorage.getToken(), []);

  const login = async (payload) => {
    const data = await authService.login(payload);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return { user, isAuthed: !!authStorage.getToken(), login, register, logout };
}
