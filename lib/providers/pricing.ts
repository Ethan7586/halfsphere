export const ANTHROPIC_PRICING: Record<string, { input: number; output: number }> = {
  // Claude 4.x
  "claude-opus-4-7": { input: 0.015, output: 0.075 },
  "claude-sonnet-4-6": { input: 0.003, output: 0.015 },
  "claude-haiku-4-5-20251001": { input: 0.00025, output: 0.00125 },
  // Claude 3.7 / 3.5 / 3
  "claude-3-7-sonnet-20250219": { input: 0.003, output: 0.015 },
  "claude-3-5-sonnet-20241022": { input: 0.003, output: 0.015 },
  "claude-3-5-sonnet-20240620": { input: 0.003, output: 0.015 },
  "claude-3-5-haiku-20241022": { input: 0.0008, output: 0.004 },
  "claude-3-opus-20240229": { input: 0.015, output: 0.075 },
  "claude-3-sonnet-20240229": { input: 0.003, output: 0.015 },
  "claude-3-haiku-20240307": { input: 0.00025, output: 0.00125 },
  // Legacy
  "claude-2.1": { input: 0.008, output: 0.024 },
  "claude-2.0": { input: 0.008, output: 0.024 },
  "claude-instant-1.2": { input: 0.0008, output: 0.0024 },
};

export const OPENAI_PRICING: Record<string, { input: number; output: number }> = {
  // GPT-4o family
  "gpt-4o": { input: 0.0025, output: 0.01 },
  "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
  // o-series reasoning
  "o1": { input: 0.015, output: 0.06 },
  "o1-mini": { input: 0.003, output: 0.012 },
  "o3": { input: 0.01, output: 0.04 },
  "o3-mini": { input: 0.0011, output: 0.0044 },
  "o4-mini": { input: 0.0011, output: 0.0044 },
  // Legacy GPT-4
  "gpt-4-turbo": { input: 0.01, output: 0.03 },
  "gpt-4": { input: 0.03, output: 0.06 },
  "gpt-3.5-turbo": { input: 0.0005, output: 0.0015 },
  // Embeddings & image (output = 0 as cost is input-only)
  "text-embedding-3-small": { input: 0.00002, output: 0 },
  "text-embedding-3-large": { input: 0.00013, output: 0 },
  "dall-e-3": { input: 0.04, output: 0 },
};
