import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const infoMessage = location.state?.message || null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
      // Redirect back to the previous page if state has a redirect path, otherwise home
      const fromPath = location.state?.from || "/";
      navigate(fromPath);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: "24px", fontSize: "2rem" }}>Log in</h1>
      {infoMessage && (
        <div style={{
          color: "var(--accent-secondary)",
          backgroundColor: "rgba(212, 175, 55, 0.08)",
          border: "1px solid rgba(212, 175, 55, 0.2)",
          padding: "12px",
          borderRadius: "var(--radius-card)",
          marginBottom: "20px",
          fontSize: "0.85rem",
          lineHeight: "1.4",
          textAlign: "left"
        }}>
          {infoMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            marginBottom: "16px",
            padding: "12px",
            backgroundColor: "var(--card-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-card)",
            color: "var(--text-primary)",
            fontSize: "1rem",
            outline: "none"
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            marginBottom: "16px",
            padding: "12px",
            backgroundColor: "var(--card-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-card)",
            color: "var(--text-primary)",
            fontSize: "1rem",
            outline: "none"
          }}
        />
        {error && <p style={{ color: "var(--danger)", marginBottom: "16px" }}>{error}</p>}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "var(--accent-primary)",
            color: "var(--text-on-primary)",
            border: "none",
            borderRadius: "var(--radius-card)",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer"
          }}
        >
          Log in
        </button>
      </form>
      <p style={{ marginTop: "24px", color: "var(--text-secondary)" }}>
        No account? <Link to="/signup" style={{ color: "var(--accent-secondary)" }}>Sign up</Link>
      </p>
    </div>
  );
}
