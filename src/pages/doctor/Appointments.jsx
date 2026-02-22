import { useEffect, useState, useCallback } from "react";
import api from "@/api/axios";
import Loader from "@/components/ui/Loader";
import Card from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("appointments/doctor/");
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed loading appointments", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  async function updateStatus(id, status) {
    try {
      await api.patch(`/appointments/${id}/status/`, { status });
      showToast("Status updated", "success");
      load();
    } catch (err) {
      console.error(err);
      showToast("Failed to update status", "error");
    }
  }

  useEffect(() => {
    load();
  }, [load]);

  const rows = appointments.map((a) => ({
    id: a.id,
    patient: a.patient?.full_name || a.patient?.email,
    date: a.slot?.date,
    time: `${a.slot?.start_time} - ${a.slot?.end_time}`,
    status: a.status,
    actions: a,
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Appointments</h1>
      <Card>
        {loading ? (
          <Loader />
        ) : (
          <DataTable
            columns={[
              { label: "Patient", accessor: "patient" },
              { label: "Date", accessor: "date" },
              { label: "Time", accessor: "time" },
              { label: "Status", accessor: "status" },
              {
                label: "Actions",
                accessor: "actions",
                render: (val) => (
                  <div className="flex gap-2">
                    {val.status === "pending" && (
                      <Button className="text-xs" onClick={() => updateStatus(val.id, "accepted")}>
                        Accept
                      </Button>
                    )}
                    {val.status !== "visited" && (
                      <Button
                        className="text-xs bg-slate-700 hover:bg-slate-800"
                        onClick={() => updateStatus(val.id, "VISITED")}
                        disabled={val.status === "VISITED"}
                      >
                        Mark Visited
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
