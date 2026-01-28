import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { useParams } from "react-router-dom";

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const [msg, setMsg] = useState("Verifying...");
  const called = useRef(false); // prevent double execution (Strict Mode)

  useEffect(() => {
    if (!token) {
      setMsg("Invalid verification link.");
      return;
    }

    // Prevent React Strict Mode double mount from calling API twice
    if (called.current) return;
    called.current = true;

    const verifyEmail = async () => {
      try {
        const res = await api.get(`/auth/verify/${token}`);
        setMsg(res.data?.message || "Email verified! You can log in now.");
      } catch (err: any) {
        console.error("Email verification error:", err);
        setMsg(err.response?.data?.message || "Invalid or expired token.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontSize: "20px" }}>
      {msg}
    </div>
  );
}

