const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');

// ── LangSmith tracing is automatic when LANGCHAIN_TRACING_V2=true in .env ──
// No manual tracer setup needed. LangChain SDK auto-detects these env vars:
//   LANGCHAIN_TRACING_V2=true
//   LANGCHAIN_API_KEY=...
//   LANGCHAIN_PROJECT=...
//   LANGCHAIN_ENDPOINT=...

// ── Gemini LLM via LangChain ──────────────────────────────────────────────────
let model = null;

const getModel = () => {
  if (model) return model;
  if (!process.env.GEMINI_API_KEY) return null;
  model = new ChatGoogleGenerativeAI({
    model: 'gemini-1.5-flash',
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.3,
    maxOutputTokens: 2048,
  });
  return model;
};

// ── analyzeText ────────────────────────────────────────────────────────────────
exports.analyzeText = async (text) => {
  const llm = getModel();

  if (!llm) {
    // No GEMINI_API_KEY → produce a basic summary from the raw text itself
    const snippet = text.substring(0, 500).replace(/\n+/g, ' ').trim();
    return {
      summary: snippet.length >= 500
        ? snippet + '…'
        : snippet,
      keywords: extractBasicKeywords(text),
      insights: [
        `Document contains approximately ${text.split(/\s+/).length} words.`,
        'Add GEMINI_API_KEY to backend .env for full AI-powered analysis.',
      ],
      tags: detectTags(text),
    };
  }

  try {
    const promptTemplate = PromptTemplate.fromTemplate(
      `You are an expert document analyst. Analyze the following document text and respond ONLY with a valid JSON object. No markdown, no code fences, no explanation — just pure JSON.

The JSON must have exactly these 4 keys:
- "summary": A clear, detailed 3-5 sentence summary describing what this document is about and its key content.
- "keywords": An array of 5-10 important keywords or phrases extracted from the document.
- "insights": An array of 3-5 specific, meaningful insights or key takeaways from this document.
- "tags": An array of 2-4 category tags (e.g. "Finance", "Legal", "Technical", "Research", "Report", "Education").

Document Text:
{text}

JSON:`
    );

    const chain = promptTemplate.pipe(llm).pipe(new StringOutputParser());

    // This call is automatically traced by LangSmith
    const responseText = await chain.invoke({
      text: text.substring(0, 8000),
    });

    // Strip any accidental code fences
    const cleaned = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned);
    return {
      summary: parsed.summary || 'Summary not available',
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      insights: Array.isArray(parsed.insights) ? parsed.insights : [],
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    };
  } catch (err) {
    console.error('AI Analysis Error:', err.message);
    // Fallback: return a basic summary from raw text
    const snippet = text.substring(0, 500).replace(/\n+/g, ' ').trim();
    return {
      summary: snippet + (text.length > 500 ? '…' : ''),
      keywords: extractBasicKeywords(text),
      insights: ['AI analysis encountered an error. Document text was extracted successfully.'],
      tags: detectTags(text),
    };
  }
};

// ── generateEmbedding ──────────────────────────────────────────────────────────
// Simple hash-based 128-d vector for cosine-similarity semantic search
exports.generateEmbedding = async (text) => {
  return textToVector(text);
};

exports.generateQueryEmbedding = async (query) => {
  return textToVector(query);
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function extractBasicKeywords(text) {
  const stopWords = new Set([
    'the','a','an','and','or','but','in','on','at','to','for','of','with',
    'is','are','was','were','be','been','this','that','it','its','by','from',
    'as','not','can','will','have','has','had','do','does','did','so','if',
    'we','our','their','they','he','she','his','her','you','your','which',
    'would','could','should','about','more','also','than','then','into',
    'been','being','each','other','some','such','only','very','just','may',
  ]);

  const freq = {};
  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  for (const w of words) {
    if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w);
}

function detectTags(text) {
  const lower = text.toLowerCase();
  const tags = [];
  if (/invoice|receipt|payment|amount|total|price|cost|revenue/.test(lower)) tags.push('Finance');
  if (/contract|agreement|terms|clause|party|legal|law/.test(lower)) tags.push('Legal');
  if (/research|study|analysis|methodology|results|conclusion|hypothesis/.test(lower)) tags.push('Research');
  if (/report|summary|overview|executive|quarterly/.test(lower)) tags.push('Report');
  if (/code|function|class|algorithm|software|api|programming/.test(lower)) tags.push('Technical');
  if (/meeting|agenda|minutes|action|discussion/.test(lower)) tags.push('Meeting');
  if (/student|education|course|syllabus|exam|university/.test(lower)) tags.push('Education');
  if (tags.length === 0) tags.push('Document');
  return tags.slice(0, 4);
}

function textToVector(text) {
  const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
  const vec = new Array(128).fill(0);
  for (const word of words) {
    let h = 5381;
    for (let i = 0; i < word.length; i++) {
      h = ((h << 5) + h) + word.charCodeAt(i);
      h = h & 0x7fffffff;
    }
    vec[h % 128] += 1;
  }
  const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map(v => v / mag);
}
