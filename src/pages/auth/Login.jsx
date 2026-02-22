import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/api/axios";
import { validateEmail, minLength } from "@/utils/validation";
import { useToast } from "@/context/ToastContext";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/authSlice";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(form.email)) {
      showToast("Invalid email format", "error");
      return;
    }
    if (!minLength(form.password, 6)) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("accounts/login/", form);
      const data = res.data.data;
      dispatch(
        loginSuccess({
          user: data.user,
          access: data.access,
          refresh: data.refresh,
        }),
      );
      showToast("Logged in successfully!", "success");
      const role = data.user.role;
      if (role === "patient") navigate("/patient/dashboard");
      else if (role === "doctor") navigate("/doctor/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else navigate("/login");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-md">
          <div className="mb-4 text-center">
            <h1 className="text-xl font-semibold text-slate-800">Welcome to MediBooker</h1>
            <p className="text-xs text-slate-500 mt-1">Sign in to manage your appointments.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
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
              <label className="text-xs text-slate-600">Password</label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-2 py-1">
                {error}
              </p>
            )}
            <Button className="w-full mt-2" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-xs text-slate-500 text-center space-y-1">
            <p>
              New patient?{" "}
              <Link to="/register/patient" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </p>
            <p>
              Doctor?{" "}
              <Link to="/register/doctor" className="text-blue-600 hover:underline">
                Join as doctor
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
