export default function Home() {
  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#f8f9fa", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
      <div style={{ background: "#1a3a5c", color: "#fff", padding: "8px 20px", fontSize: "11px", letterSpacing: "3px", fontFamily: "Courier New, monospace", marginBottom: "32px" }}>
        LISTINGAI
      </div>
      <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: "700", color: "#1a3a5c", lineHeight: "1.1", marginBottom: "20px", maxWidth: "600px" }}>
        Generate Property Content in 30 Seconds
      </h1>
      <p style={{ fontSize: "18px", color: "#666", maxWidth: "440px", lineHeight: "1.6", marginBottom: "40px" }}>
        Listing descriptions, follow-up emails, and open house invitations — generated instantly for your agency.
      </p>
      <a href="/signup" style={{ background: "#1a3a5c", color: "#fff", padding: "16px 40px", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", textDecoration: "none", fontFamily: "Courier New, monospace" }}>
        Get Started — $297/month
      </a>
      <p style={{ marginTop: "14px", fontSize: "11px", color: "#aaa", fontFamily: "Courier New, monospace" }}>
        Cancel anytime · No contracts · Setup in 24 hours
      </p>
    </div>
  );
}