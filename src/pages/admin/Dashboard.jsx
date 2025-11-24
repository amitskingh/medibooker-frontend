import { useEffect, useState } from "react";
import api from "@/api/axios";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import DataTable from "@/components/ui/DataTable";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [doctorsRes, patientsRes, appsRes] = await Promise.all([
          api.get("accounts/doctors/"),
          api.get("accounts/patients/").catch(() => ({ data: { data: [] } })),
          api.get("appointments/admin/"),
        ]);
        const doctors = doctorsRes.data.data || [];
        const patients = patientsRes.data.data || [];
        const appointments = appsRes.data.data || [];

        const recentApps = appointments.slice(0, 5);

        console.log(recentApps);

        setStats({
          doctors: doctors.length,
          patients: patients.length,
          appointments: appointments.length,
        });
        setRecent(recentApps);
      } catch (err) {
        console.error(err);
        setStats({ doctors: 0, patients: 0, appointments: 0 });
        setRecent([]);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <Loader />;

  const recentRows = recent.map((app) => ({
    id: app.id,
    patient: app.patient?.full_name || app.patient?.email,
    doctor: app.doctor?.full_name || app.doctor?.email,
    date: app.slot?.date,
    time: app.slot ? `${app.slot.start_time} - ${app.slot.end_time}` : "",
    status: app.status,
  }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Admin Overview</h1>
        <p className="text-xs text-slate-500 mt-1">
          High-level snapshot of doctors, patients, and appointments across the
          platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-[11px] uppercase text-slate-500 font-semibold tracking-wide">
            Total Doctors
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {stats.doctors}
          </p>
        </Card>
        <Card>
          <p className="text-[11px] uppercase text-slate-500 font-semibold tracking-wide">
            Total Patients
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {stats.patients}
          </p>
        </Card>
        <Card>
          <p className="text-[11px] uppercase text-slate-500 font-semibold tracking-wide">
            Total Appointments
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {stats.appointments}
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-slate-800 mb-3">
          Recent Appointments
        </h2>
        <DataTable
          columns={[
            { label: "Patient", accessor: "patient" },
            { label: "Doctor", accessor: "doctor" },
            { label: "Date", accessor: "date" },
            { label: "Time", accessor: "time" },
            { label: "Status", accessor: "status" },
          ]}
          data={recentRows}
        />
      </Card>
    </div>
  );
}
