export default function Home() {
  return (
    <div style={{
      fontFamily: "Georgia, serif",
      background: "#faf8f3",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      textAlign: "center"
    }}>
      <p style={{ fontSize: "12px", letterSpacing: "3px", color: "#8aaa7e", marginBottom: "24px", textTransform: "uppercase", fontFamily: "Courier New, monospace" }}>
        For Freelance Writers
      </p>
      <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: "700", color: "#2c3d2e", lineHeight: "1.1", marginBottom: "20px", maxWidth: "700px" }}>
        Generate a Professional Content Brief in 60 Seconds
      </h1>
      <p style={{ fontSize: "18px", color: "#5a6b5c", maxWidth: "480px", lineHeight: "1.6", marginBottom: "40px" }}>
        Answer 5 quick questions. Get a complete, client-ready content brief — keyword focus, H2 structure, tone guide, and CTA included.
      </p>
      <a href="/signup" style={{
        background: "#2c3d2e",
        color: "#faf8f3",
        padding: "16px 40px",
        fontSize: "13px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        textDecoration: "none",
        fontFamily: "Courier New, monospace"
      }}>
        Start Free — $29/month
      </a>
      <p style={{ marginTop: "14px", fontSize: "11px", color: "#aaa", fontFamily: "Courier New, monospace", letterSpacing: "1px" }}>
        Cancel anytime · No credit card to try
      </p>
    </div>
  );
}