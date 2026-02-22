import { useEffect, useState, useCallback } from "react";
import api from "@/api/axios";
import Loader from "@/components/ui/Loader";
import Card from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("appointments/patient/");
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed loading appointments", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]); // include dependencies used inside

  async function cancel(id) {
    try {
      await api.post(`appointments/${id}/status/`, { status: "cancelled" });
      showToast("Appointment cancelled", "success");
      load();
    } catch {
      showToast("Failed to cancel", "error");
    }
  }

  useEffect(() => {
    load();
  }, [load]);

  const rows = appointments.map((a) => ({
    id: a.id,
    doctor: a.doctor?.full_name,
    date: a.slot?.date,
    time: `${a.slot?.start_time} - ${a.slot?.end_time}`,
    status: a.status,
    actions: a,
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-800">My Appointments</h1>
      <Card>
        {loading ? (
          <Loader />
        ) : (
          <DataTable
            columns={[
              { label: "Doctor", accessor: "doctor" },
              { label: "Date", accessor: "date" },
              { label: "Time", accessor: "time" },
              { label: "Status", accessor: "status" },
              {
                label: "Actions",
                accessor: "actions",
                render: (val) => (
                  <div className="flex gap-2">
                    {val.status !== "cancelled" && (
                      <Button
                        className="text-xs bg-red-600 hover:bg-red-700"
                        onClick={() => cancel(val.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                ),
              },
            ]}
            data={rows}
          />
        )}
      </Card>
    </div>
  );
}
