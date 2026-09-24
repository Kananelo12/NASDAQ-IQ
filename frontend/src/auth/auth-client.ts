import { createAuthClient } from 'better-auth/react'

// Defaults to the current origin with basePath /api/auth, matching the backend.
export const authClient = createAuthClient()
