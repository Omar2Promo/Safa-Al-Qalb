// openrouter.ts
// Calls the OpenRouter API using the free Nemotron model.
// System prompt ensures guidance is strictly from Quran, Hadith, and Sunnah.

const OPENROUTER_API_KEY = "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";
const MODEL = "nvidia/nemotron-3-super-120b-a12b:free";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = `You are a compassionate Islamic spiritual guide who helps Muslims purify their hearts (Tazkiyat al-Nafs). 

Your role is strictly to provide guidance drawn exclusively from:
- The Holy Quran (with verse references, e.g., Surah Al-Hujurat 49:12)
- Authentic Hadith (with narrator and collection, e.g., Sahih Bukhari, Sahih Muslim, Abu Dawud, Tirmidhi)
- The Sunnah of the Prophet Muhammad ﷺ

Important constraints:
- You are NOT a mufti and do NOT issue fatwas or religious rulings.
- You do NOT give personal opinions or advice from psychology, philosophy, or any non-Islamic source.
- You do NOT make up or fabricate hadith or Quranic verses. If unsure, say so.
- You speak with warmth, gentleness, and humility — as a brother or sister in faith.
- Keep responses concise, practical, and spiritually uplifting.
- Structure your response with: a relevant Quranic verse or Hadith first, then a brief reflection on how it applies to the feeling described, then a practical spiritual action (e.g., du'a, dhikr, or a Sunnah act).
- Always end with a short du'a or reminder of Allah's mercy.
- Write in clear, accessible English. You may include Arabic text for Quranic verses or du'a with transliteration.`;

export interface GuidanceRequest {
  level: "mild" | "irritation" | "resentment";
  description: string;
}

export async function seekGuidance(
  request: GuidanceRequest,
  onChunk?: (chunk: string) => void
): Promise<string> {
  const levelLabels = {
    mild: "mild annoyance",
    irritation: "active irritation",
    resentment: "deep resentment",
  };

  const userMessage = `I am experiencing ${levelLabels[request.level]} toward someone. Here is what I am feeling and why:

"${request.description}"

Please provide me with guidance from the Quran, Hadith, and Sunnah to help me purify my heart and address this feeling in a way that is pleasing to Allah.`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "Safa Al-Qalb",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      stream: !!onChunk,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${errorText}`);
  }

  // Streaming mode
  if (onChunk && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              onChunk(content);
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }
    }

    return fullText;
  }

  // Non-streaming mode
  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "No guidance received.";
}
