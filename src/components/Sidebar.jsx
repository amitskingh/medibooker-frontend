import { Link, useLocation } from "react-router-dom";
import Button from "./ui/Button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const navConfig = {
  patient: [
    { to: "/patient/dashboard", label: "Dashboard" },
    { to: "/patient/book", label: "Book Appointment" },
    { to: "/patient/appointments", label: "My Appointments" },
    { to: "/patient/profile", label: "Profile" }
  ],
  doctor: [
    { to: "/doctor/dashboard", label: "Dashboard" },
    { to: "/doctor/slots", label: "Manage Slots" },
    { to: "/doctor/appointments", label: "Manage Appointments" },
    { to: "/doctor/profile", label: "Profile" }
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/doctors", label: "Doctors" },
    { to: "/admin/patients", label: "Patients" },
    { to: "/admin/appointments", label: "Appointments" },
    { to: "/admin/profile", label: "Profile" }
  ]
};

export default function Sidebar({ onLogout }) {
  const { role } = useAuth();
  const links = navConfig[role] || [];
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-200 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex items-center justify-between px-3 py-3 border-b border-slate-200">
        <span
          className={`font-semibold text-sm tracking-tight text-slate-800 ${
            collapsed ? "hidden" : "block"
          }`}
        >
          MediBooker
        </span>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="text-slate-500 text-xs rounded-md border border-slate-200 px-1 py-0.5 hover:bg-slate-50"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-1">
        {links.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center rounded-md px-3 py-2 text-xs font-medium relative overflow-hidden ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-0 h-full w-0.5 bg-blue-600" />
              )}
              <span className="truncate">
                {collapsed ? item.label[0] : item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-slate-200">
        <Button
          className={`w-full text-xs justify-center ${collapsed ? "px-0" : ""}`}
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
