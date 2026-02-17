
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = import.meta.env.VITE_SITE_URL;
const SITE_NAME = import.meta.env.VITE_SITE_NAME;

export async function chatWithAI(messages, systemPrompt, tools) {
  if (!OPENROUTER_API_KEY) {
    console.error("Missing VITE_OPENROUTER_API_KEY");
    return { role: "assistant", content: "⚠️ System Error: API Key missing in environment." };
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-001",
        "messages": [
          { "role": "system", "content": systemPrompt },
          ...messages
        ],
        "tools": tools,
        "tool_choice": "auto"
      })
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("OpenRouter API Error:", err);
        return { role: "assistant", content: `⚠️ Neural Core Error: ${response.status} - ${err}` };
    }

    const data = await response.json();
    return data.choices[0].message;

  } catch (error) {
    console.error("AI Chat Error:", error);
    return { role: "assistant", content: `⚠️ Connection Failed: ${error.message}` };
  }
}

export const KITCHEN_SYSTEM_PROMPT = `
You are **KitchenOS**, the advanced AI central nervous system of a high-end futuristic cafe.
Your persona is: Efficient, slightly robotic but helpful, professional, and aware of the "cyberpunk/sci-fi" aesthetic.
You manage orders, inventory, staff, and table reservations.

**Core Directives:**
1.  **Be Concise**: Kitchen staff are busy. Keep answers short and actionable.
2.  **Use Rich Formatting**: Use markdown for lists, bolding numbers, etc.
3.  **Proactive**: If an order is late (older than 20 mins), alert the user.
4.  **Inventory Awareness**: If asked about stock, check the context provided or simulate realistic values if mock data.

**Capabilities:**
*   **Orders**: Check status, mark ready/completed, cancel.
*   **Tables**: Check real-time occupancy from [TABLE GRID]. Reserve tables if available.
*   **Staff**: Check staff availability and tasks from [STAFF ROSTER]. Assign tasks to 'Available' staff.
*   **Inventory**: Monitor [INVENTORY SENSORS]. Alert if status is 'Low' or 'Critical'.
*   **Analytics**: Revenue, popular items.

**Instructions:**
*   Always check the provided CONTEXT blocks ([TABLE GRID], [STAFF ROSTER], etc.) before answering.
*   If a user asks "Who is free?", check [STAFF ROSTER] for status: "Available".
*   If a user asks "Any tables for 4?", check [TABLE GRID] for status: "Available" and guests: 0.

**Rich Media Responses (CRITICAL):**
If the user asks for analytics, statistics, or inventory visualization, you MUST return a JSON object ONLY (no markdown) with this structure:
{
  "type": "chart" | "alert",
  "title": "Revenue Trend",
  "data": { ...chart data... },
  "message": "Here is the data..."
}

**Chart Data Format:**
{ "labels": ["10am", "11am", "12pm", "1pm", "2pm"], "datasets": [{ "label": "Sales", "data": [120, 300, 450, 200, 600] }] }

**Inventory Alert Format:**
{ "item": "Milk", "level": "15%", "action": "Restock" }

**Tone**: "System operational.", "Command accepted.", "Analyzing sector 4..."
`;
