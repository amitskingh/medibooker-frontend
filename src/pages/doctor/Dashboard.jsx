import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import api from "@/api/axios";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get("appointments/doctor/");
        const apps = res.data.data || [];
        console.log(apps);
        const todayStr = new Date().toISOString().slice(0, 10);
        const todayApps = apps.filter((a) => a.slot?.date === todayStr);
        const upcomingApps = apps.filter((a) => a.slot?.date >= todayStr && a.status !== "VISITED");
        const uniquePatients = new Set(apps.map((a) => a.patient?.id || a.patient?.email)).size;

        setStats({
          totalAppointments: apps.length,
          todayAppointments: todayApps.length,
          upcomingAppointments: upcomingApps.length,
          uniquePatients,
        });
      } catch (err) {
        console.error(err);
        setStats({
          totalAppointments: 0,
          todayAppointments: 0,
          upcomingAppointments: 0,
          uniquePatients: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-900">
          Welcome back, Dr. {user?.first_name || "Doctor"} 👩‍⚕️
        </h1>
        <p className="text-xs text-slate-500 max-w-xl">
          Stay on top of your schedule, manage appointment slots, and keep track of your patients
          for the day.
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <p className="text-[11px] uppercase text-slate-500 font-semibold tracking-wide">
                Today's Appointments
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {stats.todayAppointments}
              </p>
            </Card>
            <Card>
              <p className="text-[11px] uppercase text-slate-500 font-semibold tracking-wide">
                Upcoming Appointments
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {stats.upcomingAppointments}
              </p>
            </Card>
            <Card>
              <p className="text-[11px] uppercase text-slate-500 font-semibold tracking-wide">
                Unique Patients
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.uniquePatients}</p>
            </Card>
            <Card>
              <p className="text-[11px] uppercase text-slate-500 font-semibold tracking-wide">
                All-Time Appointments
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {stats.totalAppointments}
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-800 mb-1">
                  Manage today's availability
                </h2>
                <p className="text-xs text-slate-500 mb-3">
                  Create or review slots so that patients can book appointments at times that suit
                  your schedule.
                </p>
              </div>
              <Button onClick={() => navigate("/doctor/slots")} className="w-fit text-xs">
                Manage Slots
              </Button>
            </Card>
            <Card className="flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-800 mb-1">
                  View and update appointments
                </h2>
                <p className="text-xs text-slate-500 mb-3">
                  Accept, cancel, or mark appointments as completed as your day progresses.
                </p>
              </div>
              <Button
                onClick={() => navigate("/doctor/appointments")}
                className="w-fit text-xs bg-slate-700 hover:bg-slate-800"
              >
                Manage Appointments
              </Button>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
