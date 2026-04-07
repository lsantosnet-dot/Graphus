---
name: authjs-skills
description: 'High-quality skill for managing Auth.js (NextAuth.js v5) in modern Next.js applications'
---

# Auth.js (NextAuth.js v5)

Auth.js is the next generation of NextAuth.js, optimized for the App Router and Edge Runtime.

## Installation

```bash
npm install next-auth@beta
```

## Setup

### Environment Variables

```bash
AUTH_SECRET=your-secret
AUTH_URL=http://localhost:3000
```

### Auth Configuration (`auth.ts`)

```tsx
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
})
```

### API Route (`app/api/auth/[...nextauth]/route.ts`)

```tsx
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

## Usage

### Server Side (RSC)

```tsx
import { auth } from "@/auth"

export default async function Page() {
  const session = await auth()
  
  if (!session) return <div>Not authenticated</div>
  
  return <div>Welcome, {session.user?.name}!</div>
}
```

### Client Side

```tsx
'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
```

### Middleware

```tsx
export { auth as middleware } from "@/auth"
```

## Protecting Routes

```tsx
import { auth } from "@/auth"

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})
```
