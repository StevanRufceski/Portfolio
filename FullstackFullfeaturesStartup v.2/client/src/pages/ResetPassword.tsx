import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { resetPasswordSchema } from "../../../server/src/schemas/auth.schema"; // adjust path
import { ZodError, ZodIssue } from "zod";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate password with Zod
    const parsed = resetPasswordSchema.safeParse({ password });
    if (!parsed.success) {
      const messages = parsed.error.issues.map((issue: ZodIssue) => issue.message);
      setError(messages.join(", "));
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Reset token is missing or invalid");
      setLoading(false);
      return;
    }

    try {
      // Call backend API to reset password
      const res = await api.post(`/auth/reset-password/${token}`, { password });

      // Show success message
      alert(res.data.message || "Password updated successfully");

      // Redirect to login page after successful reset
      navigate("/login");
    } catch (err: any) {
      console.error("Reset password error:", err.response?.data || err);
      const msg = err.response?.data?.message || "Failed to reset password";
      setError(msg);
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
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>

      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
    </div>
  );
}
