import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || "Invalid email or password");
      setLoading(false);
      return;
    }

    // Redirect based on role
    const roleRedirectMap: Record<string, string> = {
      Administrator: "/admin",
      Manager: "/manager",
      Officer: "/officer",
      Customer: "/customer",
    };

    if (result.user) {
      const redirectPath = roleRedirectMap[result.user.role] || "/";
      navigate(redirectPath);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: "50px" }}>
      <h1>Login</h1>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}

      <a href="/request-reset" style={{ display: "block", marginTop: 15 }}>
        Forgot password?
      </a>
    </div>
  );
}
