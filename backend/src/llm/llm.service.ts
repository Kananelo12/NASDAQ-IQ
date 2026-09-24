export interface LlmRequest {
  system?: string;
  prompt: string;
  temperature?: number;
}

/**
 * Provider-agnostic LLM interface. Inject this, never a concrete provider, so switching
 * from Gemini to another provider only touches llm.module.ts.
 *
 * The LLM explains and summarises source material only. It must never be the source of
 * economic values (PRD §14).
 */
export abstract class LlmService {
  abstract generate(request: LlmRequest): Promise<string>;
}
