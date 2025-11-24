import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/api/axios";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function RegisterPatient() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("accounts/patient/register/", form);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <Card>
          <h2 className="text-xl font-semibold mb-2 text-slate-800 text-center">
            Patient Registration
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 mt-3">
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <label className="text-xs text-slate-600">First Name</label>
                <Input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs text-slate-600">Last Name</label>
                <Input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-600">Email</label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-600">Phone Number</label>
              <Input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-600">Password</label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <Button className="w-full mt-2" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
          <p className="mt-3 text-xs text-slate-500 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
