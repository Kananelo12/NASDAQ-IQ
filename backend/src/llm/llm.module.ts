import { Global, Module } from '@nestjs/common';
import { GeminiLlmService } from './gemini-llm.service.js';
import { LlmService } from './llm.service.js';

@Global()
@Module({
  providers: [{ provide: LlmService, useClass: GeminiLlmService }],
  exports: [LlmService],
})
export class LlmModule {}
