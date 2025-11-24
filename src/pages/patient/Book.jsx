import { useEffect, useState } from "react";
import api from "@/api/axios";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";

export default function PatientBook() {
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [filters, setFilters] = useState({
    specialization: "",
    doctor: "",
    date: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("accounts/specializations/")
      .then((res) => {
        const data = res.data.data || [];
        console.log(data);
        setSpecializations(
          [{ value: "", label: "All" }].concat(
            data.map((s) => ({ value: s.key, label: s.value }))
          )
        );
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.specialization) {
      params.append("specialization", filters.specialization);
    }
    api
      .get(
        `accounts/doctors/${params.toString() ? `?${params.toString()}` : ""}`
      )
      .then((res) => {
        const data = res.data.data || [];
        setDoctors(
          [{ value: "", label: "All doctors" }].concat(
            data.map((d) => ({
              value: d.id,
              label: d.user.full_name || d.user.email,
            }))
          )
        );
      })
      .catch(console.error);
  }, [filters.specialization]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loadSlots = async () => {
    if (!filters.doctor) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);

    console.log("DOCTORS: ", filters.doctor);
    try {
      const res = await api.get(
        `slots/available/?doctor=${filters.doctor}&date=${filters.date}`
      );

      setSlots(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.doctor, filters.date]);

  const handleBook = async (slotId) => {
    setMessage("");
    try {
      await api.post("appointments/book/", {
        slot_id: slotId,
      });
      setMessage("Appointment booked successfully.");
      loadSlots();
    } catch (err) {
      console.error(err);
      setMessage("Failed to book appointment.");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-800">Book Appointment</h1>
      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Specialization</label>
            <Select
              name="specialization"
              value={filters.specialization}
              onChange={handleFilterChange}
              options={specializations}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Doctor</label>
            <Select
              name="doctor"
              value={filters.doctor}
              onChange={handleFilterChange}
              options={doctors}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Date</label>
            <Input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </Card>
      <Card>
        <h2 className="text-sm font-semibold text-slate-800 mb-3">
          Available Slots
        </h2>
        {loadingSlots ? (
          <Loader text="Loading slots..." />
        ) : slots.length === 0 ? (
          <p className="text-xs text-slate-500">
            No slots available. Please adjust your filters.
          </p>
        ) : (
          <div className="grid gap-2 md:grid-cols-3">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="border border-slate-200 rounded-md p-3 flex flex-col gap-1 text-xs"
              >
                <span>
                  Date: <strong>{slot.date}</strong>
                </span>
                <span>
                  Time:{" "}
                  <strong>
                    {slot.start_time} - {slot.end_time}
                  </strong>
                </span>
                <Button
                  className="mt-2 text-xs"
                  onClick={() => handleBook(slot.id)}
                >
                  Book Slot
                </Button>
              </div>
            ))}
          </div>
        )}
        {message && <p className="mt-3 text-xs text-green-600">{message}</p>}
      </Card>
    </div>
  );
}
