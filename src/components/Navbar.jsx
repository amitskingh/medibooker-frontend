import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();
  return (
    <header className="w-full h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white text-xs font-semibold">
          MB
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-slate-800">MediBooker</span>
          <span className="text-[11px] text-slate-400">Appointment management dashboard</span>
        </div>
      </div>
      <div className="text-xs text-slate-500">
        {user ? (
          <span>
            Logged in as{" "}
            <span className="font-medium text-slate-700">{user.first_name || user.email}</span>{" "}
            <span className="text-slate-400">({user.role})</span>
          </span>
        ) : (
          <span>Not logged in</span>
        )}
      </div>
    </header>
  );
}
