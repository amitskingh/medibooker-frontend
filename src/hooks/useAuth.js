import { useSelector } from "react-redux";

export function useAuth() {
  const auth = useSelector((state) => state.auth);
  const isLoggedIn = !!auth?.access;
  const role = auth?.user?.role || null;
  return { ...auth, isLoggedIn, role };
}
