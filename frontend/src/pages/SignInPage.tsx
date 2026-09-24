import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router'
import { signInWithGoogle, useMe } from '../auth/session.ts'

export function SignInPage() {
  const me = useMe()
  const [searchParams] = useSearchParams()
  const [redirecting, setRedirecting] = useState(false)

  if (me.isSuccess) return <Navigate to="/" replace />

  // Better Auth appends ?error=<code> when the Google flow fails or the
  // account is rejected by the allowlist.
  const error = searchParams.get('error')

  const handleSignIn = async () => {
    setRedirecting(true)
    const { error: signInError } = await signInWithGoogle()
    if (signInError) setRedirecting(false)
  }

  return (
    <div className="center-page">
      <div className="panel">
        <h1>NASDAQ Macro Intelligence</h1>
        <p className="muted">Sign in with an approved Google account.</p>
        {error && (
          <p className="status-down">
            Sign-in failed. This Google account may not be approved for access.
          </p>
        )}
        <button className="button" onClick={handleSignIn} disabled={redirecting}>
          {redirecting ? 'Redirecting…' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  )
}
