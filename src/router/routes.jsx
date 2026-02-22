import { createBrowserRouter } from "react-router-dom";
import SidebarLayout from "@/layouts/SidebarLayout";

// auth pages
import Login from "@/pages/auth/Login";
import RegisterPatient from "@/pages/auth/RegisterPatient";
import RegisterDoctor from "@/pages/auth/RegisterDoctor";

// patient pages
import PatientDashboard from "@/pages/patient/Dashboard";
import PatientBook from "@/pages/patient/Book";
import PatientAppointments from "@/pages/patient/Appointments";
import PatientProfile from "@/pages/patient/Profile";

// doctor pages
import DoctorDashboard from "@/pages/doctor/Dashboard";
import DoctorSlots from "@/pages/doctor/Slots";
import DoctorAppointments from "@/pages/doctor/Appointments";
import DoctorProfile from "@/pages/doctor/Profile";

// admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminDoctors from "@/pages/admin/DoctorsList";
import AdminPatients from "@/pages/admin/PatientsList";
import AdminAppointments from "@/pages/admin/AppointmentsList";
import AdminProfile from "@/pages/admin/Profile";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register/patient",
    element: <RegisterPatient />,
  },
  {
    path: "/register/doctor",
    element: <RegisterDoctor />,
  },
  {
    path: "/patient",
    element: <SidebarLayout allowedRole="patient" />,
    children: [
      { path: "dashboard", element: <PatientDashboard /> },
      { path: "book", element: <PatientBook /> },
      { path: "appointments", element: <PatientAppointments /> },
      { path: "profile", element: <PatientProfile /> },
    ],
  },
  {
    path: "/doctor",
    element: <SidebarLayout allowedRole="doctor" />,
    children: [
      { path: "dashboard", element: <DoctorDashboard /> },
      { path: "slots", element: <DoctorSlots /> },
      { path: "appointments", element: <DoctorAppointments /> },
      { path: "profile", element: <DoctorProfile /> },
    ],
  },
  {
    path: "/admin",
    element: <SidebarLayout allowedRole="admin" />,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "doctors", element: <AdminDoctors /> },
      { path: "patients", element: <AdminPatients /> },
      { path: "appointments", element: <AdminAppointments /> },
      { path: "profile", element: <AdminProfile /> },
    ],
  },
  {
    path: "*",
    element: <Login />,
  },
]);
