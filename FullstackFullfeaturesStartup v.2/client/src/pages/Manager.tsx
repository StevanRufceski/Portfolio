import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import UsersTable from "../components/UsersTable";

export default function Manager() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUsers, setShowUsers] = useState(false); // ✅ NEW
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/protected/manager");
        setData(res.data);
      } catch (err) {
        setError("Failed to load manager data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <h2>Loading Manager Data...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <div>
      <h1>Manager</h1>

      <button onClick={() => navigate("/signup")}>Create User</button>
      <button onClick={() => navigate("/profile")}>My Profile</button>

      {/* ✅ USERS BUTTON */}
      <button onClick={() => setShowUsers(!showUsers)}>
        Users
      </button>

      {/* ✅ CUSTOMERS ONLY */}
      {showUsers && <UsersTable allowedRoleFilter="Customer" />}

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
