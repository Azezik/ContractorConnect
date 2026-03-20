# Role boundary audit and refactor notes

## Pre-refactor audit

### Shared / neutral routes

| Route | Current behavior before refactor | Data dependencies | Actual role | Boundary finding |
| --- | --- | --- | --- | --- |
| `/` | Marketing landing page with role chooser CTAs. | None. | Shared / neutral. | Correctly shared. |
| `/login` | Email/password login that always redirected to `/dashboard` or previous path. | Auth only. | Shared / neutral. | Correctly shared, but post-login redirect depended on mixed dashboard logic. |
| `/signup` | Account creation page that always sent users to `/role-select`. | User profile seed fields. | Shared / neutral. | Correctly shared. |
| `/dashboard` | Redirect shim driven by `getDefaultAuthedRoute(userDoc)`. | `userDoc.primaryRole`, `onboardingState.customerComplete`, `onboardingState.contractorComplete`. | Shared / neutral. | Central redirect existed, but the rest of the route tree still exposed bucket routes directly. |
| `/role-select` | Picked a role and wrote `primaryRole` / `roles`. | `users/{uid}` document. | Shared / neutral setup only. | Correctly shared, but role state used `primaryRole` and not a dedicated account-role field. |
| `/settings` | Shared settings form for profile/password updates. | `userDoc`, Firebase auth user. | Shared / neutral. | Route itself was shared, but navigation into it was not bucketed by role. |
| `/inbox`, `/inbox/:conversationId` | Shared conversation list and thread screens. | `conversations`, `messages`. | Shared capability. | Shared page type is valid, but routes were not bucketed and conversation access lacked participant checks. |

### Client-only routes

| Route | Current behavior before refactor | Data dependencies | Actual role | Boundary finding |
| --- | --- | --- | --- | --- |
| `/onboarding/customer` | Multi-step first-job flow. | `userDoc`, job-post form state, `markOnboardingComplete('customer')`. | Client-only. | Correct bucket intent, but naming was `customer` and the route coexisted with mixed default redirects elsewhere. |
| `/customer/home` | Post-first-job home page listing the signed-in user's jobs. | `getUserJobPosts(userId)`. | Client-only. | Correctly role-gated, but route naming and job detail links still shared components with contractor flows. |
| `/jobs/new` | Reused the onboarding flow to create another job. | Job-post form state, `userDoc`. | Client-only. | Correctly role-gated, but route path lived outside a client bucket. |
| `/jobs/mine` | Listed the signed-in user's posted jobs. | `getUserJobPosts(userId)`. | Client-only. | Correctly role-gated, but route path lived outside a client bucket. |

### Contractor-only routes

| Route | Current behavior before refactor | Data dependencies | Actual role | Boundary finding |
| --- | --- | --- | --- | --- |
| `/onboarding/contractor` | Multi-step contractor profile setup. | `userDoc`, contractor onboarding form state, `upsertContractorProfile`, `markOnboardingComplete('contractor')`. | Contractor-only. | Correct bucket intent. |
| `/contractor/home` | Contractor workspace summary and CTA to the feed. | None beyond static copy. | Contractor-only. | Correctly role-gated. |
| `/feed` | Matched feed built from `useJobs()` plus `useContractorProfile(uid)`. | `contractorProfiles/{uid}`, active `jobPosts`. | Contractor-only. | Correctly role-gated, but it was also the default contractor home and lived at a top-level shared-looking path. |
| `/contractor/profile` | Displayed the signed-in contractor's profile and reviews. | `contractorProfiles/{uid}`, `reviews`. | Contractor-only. | Misleading implementation: the page included customer review form logic even though the route was contractor-only. |

### Ambiguous or leaking routes / screens

| Route / screen | Current behavior before refactor | Data dependencies | Actual role | Boundary finding |
| --- | --- | --- | --- | --- |
| `/jobs/:jobId` | Single shared job-details page used by all authenticated users. Contractors could message from it; clients could also load it. | `jobPosts/{jobId}`, current `userDoc`. | Should have been split into client-owned job management vs contractor opportunity review. | Major role leak. Clients could reach a contractor-oriented page shell, and the route itself was shared. |
| `/inbox/:conversationId` | Loaded any conversation document by id, then messages. | `conversations/{id}`, `messages`. | Shared capability with per-user access. | Major security/boundary leak. No participant check before rendering the thread. |
| Navbar | Showed mixed top-level routes with conditional links (`Dashboard`, `Job Feed`, `My Jobs`, `Profile`, `Inbox`, `Settings`). | `userDoc.roles` / `primaryRole`. | Role-specific navigation should have been bucketed. | Mixed navigation model; routes lived in one header rather than explicit client vs contractor IA. |
| `ContractorProfilePage` review form | Checked `userDoc.primaryRole === 'customer'` to decide whether to render a review form on a contractor-only route. | `userDoc.primaryRole`, `reviews`. | Review authoring is client-side behavior, not contractor profile management. | Dead/ambiguous logic demonstrating bucket bleed. |
| Direct access to `/client` or contractor pages before onboarding | Role gate only checked role, not whether onboarding for that role was finished. | `primaryRole`, onboarding state. | Role bucket routes should require onboarding completion except onboarding pages themselves. | Users could manually hit pages outside their intended progress state. |

## Final route bucket map after refactor

### Shared / neutral

- `/`, `/login`, `/signup`.
- `/app` redirector.
- `/role-select` for choosing the required `accountRole` before entering a bucket.
- `/moderation/queue` for staff roles only.

### Client-only

- `/client/onboarding`
- `/client/home`
- `/client/jobs/new`
- `/client/jobs`
- `/client/jobs/:jobId`
- `/client/inbox`
- `/client/inbox/:conversationId`
- `/client/settings`

### Contractor-only

- `/contractor/onboarding`
- `/contractor/home`
- `/contractor/jobs/feed`
- `/contractor/jobs/:jobId`
- `/contractor/profile`
- `/contractor/inbox`
- `/contractor/inbox/:conversationId`
- `/contractor/settings`

## Explicit role source of truth

- Authenticated users now carry a required `accountRole` field in `users/{uid}`.
- `accountRole` is normalized from legacy data at read time and backfilled to Firestore by `synchronizeUserDocumentShape()`.
- Route guards and navigation now read from `accountRole`; they do not infer the role from contractor profiles or job-post existence.

## Route enforcement model

- `ProtectedRoute` blocks unauthenticated access at the top of the app shell.
- `RoleGate` checks the explicit account role and optionally requires onboarding completion.
- Client-only and contractor-only routes live in separate route groups, so the wrong role is redirected before a page renders.
- Shared conversation threads now verify the signed-in user is actually a participant before rendering the thread.
- Client job details verify the signed-in client owns the job before rendering the page.

## Shared pages that intentionally remain shared

- Login, signup, landing, and role selection are truly neutral.
- Inbox and settings remain shared *components*, but they are mounted through role-bucketed routes so the user never leaves the correct workspace hierarchy.

## Future caveat: dual-role accounts

The new architecture assumes one active `accountRole` per account. If dual-role accounts are introduced later, the safest extension is:

1. keep `accountRole` as the currently active workspace,
2. add an explicit role-switcher with a controlled transition,
3. preserve separate route buckets,
4. avoid reviving mixed dashboards.
