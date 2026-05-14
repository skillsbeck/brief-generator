export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { topic, targetReader, desiredAction, tone, competitors } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 1500,
        messages: [
          {
            role: "system",
            content: `You create detailed, professional content briefs for freelance writers.
Output a complete brief with these exact sections:
ARTICLE TITLE OPTIONS (3 options)
META DESCRIPTION (under 155 characters)
TARGET KEYWORD
SECONDARY KEYWORDS (5)
WORD COUNT RECOMMENDATION
TARGET READER
SEARCH INTENT
TONE GUIDE
H2 STRUCTURE (all subheadings)
KEY POINTS PER SECTION (2-3 bullet points each)
CALL TO ACTION
COMPETITOR REFERENCE
Be specific and actionable. No fluff. Output the brief only.`
          },
          {
            role: "user",
            content: `Create a content brief for:
Topic: ${topic}
Target reader: ${targetReader}
Desired action after reading: ${desiredAction}
Tone: ${tone}
Competitors/examples: ${competitors || "None provided"}`
          }
        ]
      })
    });

    const data = await response.json();
    const brief = data.choices[0].message.content;
    return res.status(200).json({ brief });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}