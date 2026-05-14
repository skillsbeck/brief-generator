import { useState } from "react";

export default function Dashboard() {
  const [form, setForm] = useState({
    topic: "",
    targetReader: "",
    desiredAction: "",
    tone: "",
    competitors: ""
  });
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setBrief("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.brief) {
        setBrief(data.brief);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(brief);
  };

  const fields = [
    { name: "topic", label: "01. What is the article topic?", placeholder: "e.g. Best running shoes for flat feet" },
    { name: "targetReader", label: "02. Who is the target reader?", placeholder: "e.g. Beginner runners aged 25-45 with knee problems" },
    { name: "desiredAction", label: "03. What should the reader do after reading?", placeholder: "e.g. Click through to buy the recommended shoes" },
    { name: "tone", label: "04. What tone does the client want?", placeholder: "e.g. Friendly and authoritative, like a trusted coach" },
    { name: "competitors", label: "05. Any competitors or examples to reference?", placeholder: "e.g. runnersworld.com (optional)" }
  ];

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#faf8f3", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "1px solid #dde8d8", paddingBottom: "20px" }}>
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "3px", color: "#8aaa7e", textTransform: "uppercase", fontFamily: "Courier New, monospace", marginBottom: "4px" }}>Brief Generator</p>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#2c3d2e" }}>Generate Content Brief</h1>
          </div>
          <a href="/api/billing" style={{ fontSize: "11px", color: "#aaa", fontFamily: "Courier New, monospace", letterSpacing: "1px" }}>Manage billing</a>
        </div>

        <form onSubmit={handleGenerate}>
          {fields.map((field) => (
            <div key={field.name} style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "12px", fontFamily: "Courier New, monospace", letterSpacing: "2px", color: "#5a6b5c", marginBottom: "8px", textTransform: "uppercase" }}>
                {field.label}
              </label>
              <textarea
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                rows={2}
                required={field.name !== "competitors"}
                style={{ width: "100%", padding: "12px 14px", fontSize: "14px", border: "1px solid #dde8d8", background: "#fff", fontFamily: "Georgia, serif", outline: "none", resize: "vertical", lineHeight: "1.5", boxSizing: "border-box" }}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#2c3d2e", color: "#faf8f3", padding: "16px", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Courier New, monospace", opacity: loading ? 0.7 : 1, marginBottom: "32px" }}
          >
            {loading ? "Generating brief..." : "Generate Brief"}
          </button>
        </form>

        {error && (
          <div style={{ padding: "16px", background: "#fff0f0", border: "1px solid #ffcccc", marginBottom: "24px" }}>
            <p style={{ color: "red", fontSize: "13px", fontFamily: "Courier New, monospace" }}>{error}</p>
          </div>
        )}

        {brief && (
          <div style={{ border: "1px solid #dde8d8", background: "#fff", padding: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <p style={{ fontSize: "11px", letterSpacing: "3px", color: "#8aaa7e", textTransform: "uppercase", fontFamily: "Courier New, monospace" }}>Your Content Brief</p>
              <button onClick={copyToClipboard} style={{ background: "transparent", border: "1px solid #dde8d8", padding: "6px 16px", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: "Courier New, monospace", color: "#5a6b5c" }}>
                Copy
              </button>
            </div>
            <div style={{ fontSize: "14px", lineHeight: "1.8", color: "#2c3d2e", whiteSpace: "pre-wrap" }}>
              {brief}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}