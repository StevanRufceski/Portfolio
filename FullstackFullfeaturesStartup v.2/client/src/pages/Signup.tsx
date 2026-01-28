import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ZodError } from "zod";
import { useNavigate } from "react-router-dom";
import { signupSchema } from "../schemas/auth.schema";

export default function Signup() {
  const { signup, adminCreateUser, user } = useAuth();
  const navigate = useNavigate();

  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Customer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Role options based on logged-in user
  const roleOptions =
    user?.role === "Administrator"
      ? ["Customer", "Officer", "Manager", "Administrator"]
      : ["Customer"];

  // Normalize phone to +389 format
  const normalizePhone = (input: string) => {
    let cleaned = input.replace(/[\s-]/g, "");
    if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);
    if (!cleaned.startsWith("+389")) cleaned = `+389${cleaned}`;
    return cleaned;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const normalizedPhone = normalizePhone(phone);

    // Validate input
    try {
      signupSchema.parse({
        full_name,
        email,
        phone: normalizedPhone,
        password,
        role,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.issues.map(i => i.message).join(", "));
      } else {
        setError("Invalid input");
      }
      setLoading(false);
      return;
    }

    // Determine if it's public signup or admin creating user
    const result =
      user?.role && ["Administrator", "Manager", "Officer"].includes(user.role)
        ? await adminCreateUser(full_name, email, normalizedPhone, password, role)
        : await signup(full_name, email, normalizedPhone, password);

    if (!result.success) {
      setError(result.error || "Operation failed");
      setLoading(false);
      return;
    }

    // Show success message with role
    alert(`${role} created successfully!`);

    // Conditional navigation
    if (!user) {
      // Public signup → go to login
      navigate("/login");
    } else {
      // Logged-in user → stay on their dashboard (no change on new user verification)
      switch (user.role) {
        case "Administrator":
          navigate("/admin");
          break;
        case "Manager":
          navigate("/manager");
          break;
        case "Officer":
          navigate("/officer");
          break;
        default:
          navigate("/");
      }
    }

    // Reset form fields
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setRole("Customer");
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: 50 }}>
      <h1>Signup</h1>
      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          value={full_name}
          onChange={e => setFullName(e.target.value)}
          placeholder="Full Name"
          required
        />
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="Phone"
          required
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
        />
        <select value={role} onChange={e => setRole(e.target.value)}>
          {roleOptions.map(r => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
