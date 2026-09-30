import OpenAI from "openai";

const aspectRatioToSize = {
  "1:1": "1024x1024",
  "16:9": "1536x1024",
  "9:16": "1024x1536",
  "4:3": "1536x1024"
};

function mockImages({ prompt, aspectRatio, count }) {
  const encoded = encodeURIComponent(prompt);
  return Array.from({ length: count }, (_, index) => ({
    id: `mock-${Date.now()}-${index}`,
    url: `https://placehold.co/1024x1024/png?text=AI+Art+${index + 1}+%7C+${encoded.slice(0, 45)}`,
    meta: { provider: "mock", aspectRatio }
  }));
}

async function generateWithOpenAI({ prompt, aspectRatio, count }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing. Add it to server/.env or use IMAGE_PROVIDER=mock.");
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const result = await client.images.generate({
    model: "gpt-image-2",
    prompt,
    size: aspectRatioToSize[aspectRatio],
    n: count
  });

  return (result.data || []).map((item, index) => ({
    id: `openai-${Date.now()}-${index}`,
    url: item.b64_json
      ? `data:image/png;base64,${item.b64_json}`
      : item.url,
    meta: {
      provider: "openai",
      aspectRatio
    }
  })).filter((item) => item.url);
}

export async function generateImages(options) {
  const provider = (process.env.IMAGE_PROVIDER || "openai").toLowerCase();

  if (provider === "mock") {
    return mockImages(options);
  }

  if (provider === "openai") {
    return generateWithOpenAI(options);
  }

  throw new Error(`Unsupported IMAGE_PROVIDER: ${provider}`);
}
