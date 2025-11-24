import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-900">
          Good day, {user?.first_name || "there"} 👋
        </h1>
        <p className="text-xs text-slate-500 max-w-xl">
          Manage your health effortlessly. Book appointments with specialists,
          view your upcoming visits, and keep track of your care in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 mb-1">
              Book an appointment
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Search by specialization, choose a doctor and pick a convenient
              time slot that fits your schedule.
            </p>
          </div>
          <Button onClick={() => navigate("/patient/book")} className="w-fit text-xs">
            Book Appointment
          </Button>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 mb-1">
              My appointments
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              See all your upcoming visits, check details, and review past
              appointments with your doctors.
            </p>
          </div>
          <Button
            onClick={() => navigate("/patient/appointments")}
            className="w-fit text-xs bg-slate-700 hover:bg-slate-800"
          >
            View Appointments
          </Button>
        </Card>
      </div>

      <Card>
        <h3 className="text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
          How it works
        </h3>
        <ol className="text-xs text-slate-500 space-y-1 list-decimal list-inside">
          <li>Choose a specialization that matches your health concern.</li>
          <li>Select a doctor from the available list.</li>
          <li>Pick a date and time slot that works best for you.</li>
          <li>Confirm your appointment and receive instant confirmation.</li>
        </ol>
      </Card>
    </div>
  );
}
