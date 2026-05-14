import { useState } from "react";

export const getServerSideProps = async (context) => {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
  const email = context.req.cookies['user_email'];
  if (!email) {
    return { redirect: { destination: '/signup', permanent: false } };
  }
  const { data: user } = await supabase
    .from('clients')
    .select('active')
    .eq('email', email)
    .single();
  if (!user || !user.active) {
    return { redirect: { destination: '/signup', permanent: false } };
  }
  return { props: {} };
};

const TOOLS = [
  {
    id: "listing",
    label: "Property Listing Description",
    fields: [
      { name: "address", label: "Property Address", placeholder: "e.g. 123 Maple Street, Austin TX" },
      { name: "bedrooms", label: "Bedrooms / Bathrooms", placeholder: "e.g. 4 bed / 2 bath" },
      { name: "sqft", label: "Square Footage", placeholder: "e.g. 2,400 sq ft" },
      { name: "features", label: "Key Features", placeholder: "e.g. renovated kitchen, hardwood floors, large backyard, 2-car garage" },
      { name: "neighborhood", label: "Neighborhood Highlights", placeholder: "e.g. walkable to downtown, top-rated schools, quiet cul-de-sac" },
      { name: "price", label: "Listing Price", placeholder: "e.g. $485,000" },
    ],
    systemPrompt: `You write compelling real estate listing descriptions that sell homes.
Rules: Open with the most impressive feature. Use evocative but accurate language.
Include lifestyle benefits, not just features. End with a call to schedule a showing.
Under 200 words. No clichés like "stunning" or "must-see". Output listing description only.`,
    userPrompt: (f) => `Write a listing description for:
Address: ${f.address}
Bedrooms/Bathrooms: ${f.bedrooms}
Square footage: ${f.sqft}
Key features: ${f.features}
Neighborhood: ${f.neighborhood}
Price: ${f.price}`
  },
  {
    id: "followup",
    label: "Lead Follow-Up Email",
    fields: [
      { name: "leadName", label: "Lead Name", placeholder: "e.g. James and Sarah" },
      { name: "property", label: "Property They Viewed", placeholder: "e.g. 123 Maple Street, 4bed/2bath" },
      { name: "showing", label: "When They Viewed It", placeholder: "e.g. last Saturday afternoon" },
      { name: "notes", label: "Notes From the Showing", placeholder: "e.g. loved the kitchen, concerned about backyard size" },
      { name: "agentName", label: "Your Name", placeholder: "e.g. Sarah Miller" },
    ],
    systemPrompt: `You write follow-up emails from real estate agents to potential buyers.
Rules: Warm and personal. Reference specific details from the showing.
Address any concerns they raised. One clear next step as the CTA.
Under 150 words. Sound like a trusted advisor, not a salesperson.
Output: subject line on line 1, blank line, email body. Nothing else.`,
    userPrompt: (f) => `Write a follow-up email from agent ${f.agentName} to ${f.leadName}.
They viewed: ${f.property}
When: ${f.showing}
Notes from showing: ${f.notes}`
  },
  {
    id: "openhouse",
    label: "Open House Invitation",
    fields: [
      { name: "address", label: "Property Address", placeholder: "e.g. 123 Maple Street, Austin TX" },
      { name: "date", label: "Open House Date & Time", placeholder: "e.g. Sunday, May 18th, 1–4pm" },
      { name: "highlights", label: "Top 3 Property Highlights", placeholder: "e.g. newly renovated kitchen, pool, cul-de-sac location" },
      { name: "price", label: "Listing Price", placeholder: "e.g. $485,000" },
      { name: "agentName", label: "Your Name & Contact", placeholder: "e.g. Sarah Miller, 512-555-0123" },
    ],
    systemPrompt: `You write open house invitation emails for real estate agents.
Rules: Create excitement without overpromising. Lead with the best feature.
Make attending feel easy and low-pressure. Include all logistics clearly.
Under 150 words. Output: subject line on line 1, blank line, email. Nothing else.`,
    userPrompt: (f) => `Write an open house invitation for:
Property: ${f.address}
Date/Time: ${f.date}
Top highlights: ${f.highlights}
Price: ${f.price}
Agent: ${f.agentName}`
  }
];

export default function Dashboard() {
  const [activeTool, setActiveTool] = useState(TOOLS[0]);
  const [form, setForm] = useState({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleToolChange = (tool) => {
    setActiveTool(tool);
    setForm({});
    setOutput("");
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: activeTool.systemPrompt,
          userPrompt: activeTool.userPrompt(form)
        }),
      });
      const data = await res.json();
      if (data.output) {
        setOutput(data.output);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const brand = { color: "#1a3a5c", name: "ListingAI" };

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: brand.color, padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#fff", fontSize: "18px", fontWeight: "700", letterSpacing: "1px" }}>{brand.name}</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontFamily: "Courier New, monospace", letterSpacing: "2px" }}>REAL ESTATE CONTENT GENERATOR</div>
      </div>

      {/* Tool selector */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 32px", display: "flex", gap: "0" }}>
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleToolChange(tool)}
            style={{
              padding: "16px 24px",
              fontSize: "13px",
              fontFamily: "Georgia, serif",
              border: "none",
              borderBottom: activeTool.id === tool.id ? `2px solid ${brand.color}` : "2px solid transparent",
              background: "transparent",
              color: activeTool.id === tool.id ? brand.color : "#666",
              cursor: "pointer",
              fontWeight: activeTool.id === tool.id ? "600" : "400"
            }}
          >
            {tool.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", display: "grid", gridTemplateColumns: output ? "1fr 1fr" : "1fr", gap: "32px" }}>
        {/* Form */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", padding: "32px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a1a", marginBottom: "24px" }}>{activeTool.label}</h2>
          <form onSubmit={handleGenerate}>
            {activeTool.fields.map((field) => (
              <div key={field.name} style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "11px", fontFamily: "Courier New, monospace", letterSpacing: "2px", color: "#666", marginBottom: "6px", textTransform: "uppercase" }}>
                  {field.label}
                </label>
                <textarea
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  rows={2}
                  required
                  style={{ width: "100%", padding: "10px 12px", fontSize: "14px", border: "1px solid #e5e7eb", background: "#fafafa", fontFamily: "Georgia, serif", outline: "none", resize: "vertical", lineHeight: "1.5", boxSizing: "border-box" }}
                />
              </div>
            ))}
            {error && (
              <p style={{ color: "red", fontSize: "13px", marginBottom: "12px", fontFamily: "Courier New, monospace" }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", background: brand.color, color: "#fff", padding: "14px", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Courier New, monospace", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Generating..." : "Generate Content"}
            </button>
          </form>
        </div>

        {/* Output */}
        {output && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", padding: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a1a" }}>Your Content</h2>
              <button
                onClick={copyToClipboard}
                style={{ background: copied ? brand.color : "transparent", color: copied ? "#fff" : "#666", border: "1px solid #e5e7eb", padding: "6px 16px", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: "Courier New, monospace", transition: "all 0.2s" }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div style={{ fontSize: "14px", lineHeight: "1.8", color: "#1a1a1a", whiteSpace: "pre-wrap" }}>
              {output}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}