import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { ApiError, apiGet } from '../lib/api.ts'
import { authClient } from './auth-client.ts'

export interface Me {
  id: string
  name: string
  email: string
  image: string | null
}

// /api/me is the source of truth for access: 401 = not signed in, 403 = not allowlisted.
export function useMe() {
  return useQuery<Me, ApiError>({
    queryKey: ['me'],
    queryFn: () => apiGet<Me>('/me'),
    retry: false,
    staleTime: 5 * 60_000,
  })
}

export function signInWithGoogle() {
  return authClient.signIn.social({
    provider: 'google',
    callbackURL: '/',
    errorCallbackURL: '/sign-in',
  })
}

export function useSignOut() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return async () => {
    await authClient.signOut()
    queryClient.clear()
    navigate('/sign-in', { replace: true })
  }
}
