import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import type { Env } from '../config/env.js';
import { LlmRequest, LlmService } from './llm.service.js';

@Injectable()
export class GeminiLlmService extends LlmService {
  private readonly client: GoogleGenAI | null;
  private readonly model: string;

  constructor(config: ConfigService<Env, true>) {
    super();
    const apiKey = config.get('GEMINI_API_KEY', { infer: true });
    // The app boots without a key; only LLM features fail until one is configured.
    this.client = apiKey ? new GoogleGenAI({ apiKey }) : null;
    this.model = config.get('GEMINI_MODEL', { infer: true });
  }

  async generate({ system, prompt, temperature = 0.2 }: LlmRequest) {
    if (!this.client) {
      throw new ServiceUnavailableException('GEMINI_API_KEY is not configured');
    }

    const response = await this.client.models.generateContent({
      model: this.model,
      contents: prompt,
      config: { systemInstruction: system, temperature },
    });
    return response.text ?? '';
  }
}
