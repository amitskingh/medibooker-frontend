import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function SidebarLayout({ allowedRole }) {
  const dispatch = useDispatch();
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex h-screen">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
