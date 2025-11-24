import { useEffect, useState } from "react";
import api from "@/api/axios";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";

export default function DoctorProfile() {
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

  const fullName = `Dr. ${profile?.user?.full_name}`;
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-900">My Profile</h1>
      <Card>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-xs text-slate-500">Name</span>
            <p className="font-medium text-slate-800">{fullName}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500">Email</span>
            <p className="font-medium text-slate-800">{profile?.user.email}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500">Role</span>
            <p className="font-medium text-slate-800 capitalize">
              {profile?.user.role}
            </p>
          </div>
          {profile?.specialization_display && (
            <div>
              <span className="text-xs text-slate-500">Specialization</span>
              <p className="font-medium text-slate-800">
                {profile.specialization_display}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
