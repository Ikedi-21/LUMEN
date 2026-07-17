import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      await signUp(email, password, username);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (success) {
    return (
      <div>
        <h1 style={{ marginBottom: "16px", fontSize: "2rem" }}>Check your email</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px", lineHeight: "1.6" }}>
          We sent a confirmation link to <strong style={{ color: "var(--text-primary)" }}>{email}</strong>. Confirm it, then log in.
        </p>
        <Link
          to="/login"
          style={{
            display: "inline-block",
            width: "100%",
            textAlign: "center",
            padding: "12px",
            backgroundColor: "var(--accent-primary)",
            color: "var(--text-on-primary)",
            borderRadius: "var(--radius-card)",
            fontWeight: "500"
          }}
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: "24px", fontSize: "2rem" }}>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
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
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
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
          Sign up
        </button>
      </form>
      <p style={{ marginTop: "24px", color: "var(--text-secondary)" }}>
        Already have an account? <Link to="/login" style={{ color: "var(--accent-secondary)" }}>Log in</Link>
      </p>
    </div>
  );
}
