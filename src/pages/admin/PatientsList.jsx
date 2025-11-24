import { useEffect, useState } from "react";
import api from "@/api/axios";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import DataTable from "@/components/ui/DataTable";

export default function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get("accounts/patients/");
        setPatients(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const rows = patients.map((p) => ({
    name: p.user.full_name,
    email: p.user.email,
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-800">Patients</h1>
      <Card>
        {loading ? (
          <Loader />
        ) : (
          <DataTable
            columns={[
              { label: "Name", accessor: "name" },
              { label: "Email", accessor: "email" },
            ]}
            data={rows}
          />
        )}
      </Card>
    </div>
  );
}
