import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'isPublic';

// Skips AuthGuard. Use only for routes that must work without a signed-in user.
export const Public = () => SetMetadata(IS_PUBLIC, true);
