import { useEffect, useState } from "react";
import api from "@/api/axios";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";

export default function DoctorSlots() {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    date: "",
    start_time: "",
    end_time: "",
  });
  const [message, setMessage] = useState("");

  const loadSlots = async () => {
    setLoading(true);
    try {
      const res = await api.get("slots/");
      let data = res.data.data || [];
      if (date) {
        data = data.filter((s) => s.date === date);
      }
      setSlots(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMessage("");
    try {
      await api.post("slots/", form);
      setForm({ date: "", start_time: "", end_time: "" });
      setMessage("Slot created successfully.");
      loadSlots();
    } catch (err) {
      console.error(err);
      setMessage("Failed to create slot.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-800">Manage Slots</h1>
      <Card>
        <h2 className="text-sm font-semibold mb-2">Create Slot</h2>
        <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-4 items-end">
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Date</label>
            <Input
              type="date"
              name="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Start Time</label>
            <Input
              type="time"
              name="start_time"
              value={form.start_time}
              onChange={(e) => setForm((p) => ({ ...p, start_time: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-600">End Time</label>
            <Input
              type="time"
              name="end_time"
              value={form.end_time}
              onChange={(e) => setForm((p) => ({ ...p, end_time: e.target.value }))}
              required
            />
          </div>
          <Button type="submit" disabled={creating} className="text-xs">
            {creating ? "Creating..." : "Create Slot"}
          </Button>
        </form>
        {message && <p className="mt-2 text-xs text-slate-600">{message}</p>}
      </Card>
      <Card>
        <div className="flex items-center gap-3 mb-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-600">Filter by Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        {loading ? (
          <Loader text="Loading slots..." />
        ) : slots.length === 0 ? (
          <p className="text-xs text-slate-500">No slots found.</p>
        ) : (
          <div className="space-y-2">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="flex justify-between border border-slate-200 rounded-md p-4 "
              >
                <div className=" p-2 text-xs flex flex-col gap-1">
                  <span>
                    Date: <strong>{slot.date}</strong>
                  </span>
                  <span>
                    Time:{" "}
                    <strong>
                      {slot.start_time} - {slot.end_time}
                    </strong>
                  </span>
                  <span>
                    Booked: <strong>{slot.is_booked ? "Yes" : "No"}</strong>
                  </span>
                </div>

                <div>
                  <Button
                    className="text-xs px-3 py-1 bg-red-500 text-white rounded-md"
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to delete this slot?")) {
                        await api.delete(`slots/${slot.id}/`);
                        loadSlots();
                      }
                    }}
                    disabled={slot.is_booked}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
