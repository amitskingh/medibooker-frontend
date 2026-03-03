import { useEffect, useState, useRef } from "react";
import api from "@/api/axios";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    profile_url: "",
    profile_file: null,
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("accounts/profile/");
        setProfile(res.data.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (profile) {
      const user = profile.profile || profile;
      const profilePic =
        (typeof user.profile_url === "string" ? user.profile_url : user.profile_url?.url) || "";
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        role: user.role || "",
        profile_url: profilePic,
        profile_file: null,
      });
    }
  }, [profile]);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((f) => ({ ...f, profile_url: reader.result, profile_file: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    if (profile) {
      const user = profile.profile || profile;
      const profilePic =
        (typeof user.profile_url === "string" ? user.profile_url : user.profile_url?.url) || "";
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        role: user.role || "",
        profile_url: profilePic,
        profile_file: null,
      });
    }
    setEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("first_name", form.first_name);
      payload.append("last_name", form.last_name);
      // Append selected File directly if present
      if (form.profile_file) {
        payload.append("profile_url", form.profile_file, form.profile_file.name || "profile.jpg");
      }
      
      const res = await api.patch("accounts/profile/", payload);
      setProfile(res.data.data);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  if (loading) return <Loader text="Loading profile..." />;

  const user = profile.profile || profile;
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-900">Admin Profile</h1>
      <Card>
        {/* Image Section - Always at Top */}
        <div className="flex justify-center mb-6 pb-6 border-b border-slate-200">
          <div className="relative group cursor-pointer" onClick={editing ? triggerFileInput : undefined}>
            {form.profile_url ? (
              <img
                src={form.profile_url}
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover border-4 border-blue-100"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-slate-300 flex items-center justify-center text-white font-semibold text-2xl">
                {user.first_name?.charAt(0)?.toUpperCase() || "A"}
              </div>
            )}
            {editing && (
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Upload Picture
                </span>
              </div>
            )}
          </div>
        </div>
        {editing && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        )}

        {/* Form Section */}
        {editing ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500" htmlFor="first_name">
                  First Name
                </label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-500" htmlFor="last_name">
                  Last Name
                </label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500" htmlFor="email">
                  Email
                </label>
                <Input id="email" name="email" value={form.email} disabled className="bg-slate-100" />
              </div>
              <div>
                <label className="text-xs text-slate-500" htmlFor="role">
                  Role
                </label>
                <Input id="role" name="role" value={form.role} disabled className="bg-slate-100" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit">Save</Button>
              <Button type="button" className="bg-gray-500 hover:bg-gray-600" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500">First Name</span>
                <p className="font-medium text-slate-800">{user.first_name}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Last Name</span>
                <p className="font-medium text-slate-800">{user.last_name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500">Email</span>
                <p className="font-medium text-slate-800">{user.email}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Role</span>
                <p className="font-medium text-slate-800 capitalize">{user.role}</p>
              </div>
            </div>
            <div>
              <Button onClick={handleEdit}>Edit Profile</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
