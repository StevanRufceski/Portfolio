import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function RequestReset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/request-reset", { email });

      // Show success message and redirect to login
      alert("If your email exists, a reset link was sent.");
      navigate("/login");
    } catch (err: any) {
      console.error("Request reset error:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: 50 }}>
      <h1>Reset Password</h1>
      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
    </div>
  );
}
