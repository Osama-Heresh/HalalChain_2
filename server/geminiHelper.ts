import { GoogleGenAI } from '@google/genai';

/**
 * Helper to get an initialized GoogleGenAI instance.
 */
export function getGenAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('Notice: GEMINI_API_KEY environment variable not set. Running AI features in offline fallback mode.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || 'dummy-key-fallback',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

export interface GeminiRequestOptions {
  ai: GoogleGenAI;
  model: string;
  contents: any;
  config?: any;
  maxRetries?: number;
}

export interface GeminiResponseResult {
  responseText: string | null;
  usageMetadata?: any;
  modelUsed: string;
}

/**
 * Safely executes a Gemini generateContent request with exponential backoff retries and model fallbacks for 503/429 errors.
 */
export async function generateGeminiContentWithRetry(
  options: GeminiRequestOptions
): Promise<GeminiResponseResult> {
  const { ai, model, contents, config, maxRetries = 2 } = options;

  if (!process.env.GEMINI_API_KEY) {
    return { responseText: null, modelUsed: 'offline-fallback' };
  }

  // Model fallback list in case primary model experiences high demand (503) or rate limits (429)
  const fallbackModels = [model, 'gemini-3.6-flash', 'gemini-flash-latest'].filter(
    (m, idx, arr) => arr.indexOf(m) === idx
  );

  for (const currentModel of fallbackModels) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: currentModel,
          contents,
          config
        });

        const text = response.text || '';
        if (text.trim()) {
          return {
            responseText: text,
            usageMetadata: response.usageMetadata,
            modelUsed: currentModel
          };
        }
      } catch (err: any) {
        const errMsg = (err?.message || String(err)).toLowerCase();
        const isUnavailableOrRateLimited =
          errMsg.includes('503') ||
          errMsg.includes('unavailable') ||
          errMsg.includes('high demand') ||
          errMsg.includes('429') ||
          errMsg.includes('resource_exhausted') ||
          errMsg.includes('overloaded');

        if (isUnavailableOrRateLimited && attempt < maxRetries) {
          // Exponential backoff pause (300ms, 600ms) before retry
          await new Promise((resolve) => setTimeout(resolve, 300 * Math.pow(2, attempt)));
          continue;
        }

        // If high demand on current model, try next fallback model
        if (isUnavailableOrRateLimited) {
          console.log(`Notice: Model ${currentModel} temporary high demand. Switching to fallback model...`);
          break;
        }

        // For non-retryable errors, log a clean notice and proceed to fallback
        console.log(`Notice: Gemini generation on ${currentModel} returned notice:`, err?.message || 'Unavailable');
        return { responseText: null, modelUsed: currentModel };
      }
    }
  }

  return { responseText: null, modelUsed: 'fallback' };
}
