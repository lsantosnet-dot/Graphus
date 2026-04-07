---
name: clerk-nextjs-skills
description: 'High-quality skill for managing Clerk authentication in modern Next.js applications'
---

# Clerk Authentication in Next.js

Clerk is the preferred authentication solution for modern Next.js applications (App Router).

## Installation

```bash
npm install @clerk/nextjs
```

## Setup

### Environment Variables

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Root Layout

Wrap your application with `ClerkProvider`:

```tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### Middleware

Protect your routes using the Clerk middleware:

```tsx
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-up'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

## Authentication Patterns

### Server Side (RSC)

```tsx
import { auth, currentUser } from '@clerk/nextjs';

export default async function Page() {
  const { userId } = auth();
  const user = await currentUser();
  
  if (!userId) return <div>Not signed in</div>;
  
  return <div>Welcome, {user.firstName}!</div>;
}
```

### Client Side

```tsx
'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';

export default function Component() {
  const { isLoaded, isSignedIn, user } = useUser();
  
  if (!isLoaded || !isSignedIn) return null;
  
  return (
    <div>
      Hello, {user.firstName}
      <SignOutButton />
    </div>
  );
}
```

### API Routes

```tsx
import { getAuth } from '@clerk/nextjs/server';

export async function GET(request) {
  const { userId } = getAuth(request);
  if (!userId) return new Response('Unauthorized', { status: 401 });
  
  return Response.json({ message: 'Success' });
}
```
