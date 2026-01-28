import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Customer() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await api.get("/protected/customer");
      setData(res.data);
    } catch (err: any) {
      console.error("Customer fetch error:", err);
      setError("Failed to load customer data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <h2>Loading Customer Data...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <div>
      <h1>Customer</h1>
      <button
        style={{ marginBottom: 20 }}
        onClick={() => navigate("/profile")}
      >
        My profile
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
