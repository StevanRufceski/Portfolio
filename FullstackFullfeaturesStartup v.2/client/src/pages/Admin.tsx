import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import UsersTable from "../components/UsersTable";
import { fetchUsers } from "../api/users";

export default function Admin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUsers, setShowUsers] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [roleCounts, setRoleCounts] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  // Load admin data
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/protected/admin");
        setData(res.data);
      } catch (err) {
        setError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Load user counts per role
  useEffect(() => {
    const loadRoleCounts = async () => {
      try {
        const allUsers = await fetchUsers();
        const counts: Record<string, number> = {};
        allUsers.forEach(u => {
          counts[u.role] = (counts[u.role] || 0) + 1;
        });
        setRoleCounts(counts);
      } catch (err) {
        console.error("Failed to load role counts", err);
      }
    };
    loadRoleCounts();
  }, [showUsers]); // Reload counts when table is shown

  if (loading) return <h2>Loading Admin Data...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <div>
      <h1>Administrator</h1>

      <button onClick={() => navigate("/signup")}>Create User</button>
      <button onClick={() => navigate("/profile")}>My Profile</button>

      <button onClick={() => setShowUsers(!showUsers)}>Users</button>

      {showUsers && (
        <>
          {/* ✅ Role Filter Dropdown */}
          <select
            value={roleFilter ?? ""}
            onChange={e =>
              setRoleFilter(e.target.value || undefined)
            }
          >
            <option value="">All Roles</option>
            {Object.entries(roleCounts).map(([role, count]) => (
              <option key={role} value={role}>
                {role} ({count})
              </option>
            ))}
          </select>

          {/* Users Table with role filter */}
          <UsersTable allowedRoleFilter={roleFilter} />
        </>
      )}

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
