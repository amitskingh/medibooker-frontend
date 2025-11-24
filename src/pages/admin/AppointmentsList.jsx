import { useEffect, useState } from "react";
import api from "@/api/axios";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import Input from "@/components/ui/Input";
import DataTable from "@/components/ui/DataTable";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (date) params.append("date", date);
      const res = await api.get(
        `appointments/admin/${params.toString() ? `?${params.toString()}` : ""}`
      );
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const rows = appointments.map((app) => ({
    patient: app.patient?.full_name || app.patient?.email,
    doctor: app.doctor?.full_name,
    date: app.slot?.date,
    time: app.slot ? `${app.slot.start_time} - ${app.slot.end_time}` : "",
    status: app.status,
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-800">All Appointments</h1>
      <Card>
        <div className="space-y-1">
          <label className="text-xs text-slate-600">Filter by Date</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </Card>
      <Card>
        {loading ? (
          <Loader />
        ) : (
          <DataTable
            columns={[
              { label: "Patient", accessor: "patient" },
              { label: "Doctor", accessor: "doctor" },
              { label: "Date", accessor: "date" },
              { label: "Time", accessor: "time" },
              { label: "Status", accessor: "status" },
            ]}
            data={rows}
          />
        )}
      </Card>
    </div>
  );
}
