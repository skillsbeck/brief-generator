import { useState } from "react";

export const getServerSideProps = async () => {
  return { props: {} };
};

export default function Signup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#faf8f3", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <p style={{ fontSize: "12px", letterSpacing: "3px", color: "#8aaa7e", marginBottom: "16px", textTransform: "uppercase", fontFamily: "Courier New, monospace" }}>
          Brief Generator
        </p>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#2c3d2e", marginBottom: "8px" }}>
          Create your account
        </h1>
        <p style={{ fontSize: "15px", color: "#5a6b5c", marginBottom: "32px", lineHeight: "1.5" }}>
          Start with a free trial. $29/month after. Cancel anytime.
        </p>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "14px 16px", fontSize: "15px", border: "1px solid #dde8d8", background: "#fff", marginBottom: "12px", fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box" }}
          />
          {error && (
            <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#2c3d2e", color: "#faf8f3", padding: "16px", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Courier New, monospace", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Loading..." : "Continue to Payment"}
          </button>
        </form>
        <p style={{ marginTop: "20px", fontSize: "12px", color: "#aaa", textAlign: "center", fontFamily: "Courier New, monospace" }}>
          Already have an account?{" "}
          <a href="/dashboard" style={{ color: "#2c3d2e" }}>Log in</a>
        </p>
      </div>
    </div>
  );
}