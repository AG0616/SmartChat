import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateText(prompt, retries = 3) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    if (err.status === 429 && retries > 0) {
      const retryInfo = err.errorDetails?.find(d => d['@type']?.includes('RetryInfo'));
      const delaySec = parseInt(retryInfo?.retryDelay) || 30;
      await new Promise(res => setTimeout(res, delaySec * 1000));
      return generateText(prompt, retries - 1);
    }
    throw err;
  }
}
export async function generateEmbedding(text, isQuery = false) {
  const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });
  const result = await model.embedContent({
    content: { parts: [{ text }] },
    taskType: isQuery ? "RETRIEVAL_QUERY" : "RETRIEVAL_DOCUMENT",
    outputDimensionality: 768,
  });
  return result.embedding.values;
}