import { Controller, Get, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from './auth.guard.js';

@Controller('me')
export class MeController {
  // The frontend uses this to decide between the app, the sign-in page and "access denied".
  @Get()
  me(@Req() request: AuthenticatedRequest) {
    const { id, name, email, image } = request.auth.user;
    return { id, name, email, image: image ?? null };
  }
}
