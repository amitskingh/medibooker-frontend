import { useEffect, useState } from "react";
import api from "@/api/axios";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import DataTable from "@/components/ui/DataTable";

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get("accounts/doctors/");
        setDoctors(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const rows = doctors.map((doc) => ({
    name: doc.user?.full_name || doc.user?.email,
    specialization: doc.specialization_display || doc.specialization,
    email: doc.user?.email,
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-800">Doctors</h1>
      <Card>
        {loading ? (
          <Loader />
        ) : (
          <DataTable
            columns={[
              { label: "Name", accessor: "name" },
              { label: "Specialization", accessor: "specialization" },
              { label: "Email", accessor: "email" },
            ]}
            data={rows}
          />
        )}
      </Card>
    </div>
  );
}
