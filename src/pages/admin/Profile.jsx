import { useEffect, useState } from "react";
import api from "@/api/axios";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("accounts/profile/");
        setProfile(res.data.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader text="Loading profile..." />;

  const fullName =
    profile?.profile?.full_name ||
    `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() ||
    profile?.email;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-900">Admin Profile</h1>
      <Card>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-xs text-slate-500">Name</span>
            <p className="font-medium text-slate-800">{fullName}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500">Email</span>
            <p className="font-medium text-slate-800">{profile?.email}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500">Role</span>
            <p className="font-medium text-slate-800 capitalize">{profile?.role}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
