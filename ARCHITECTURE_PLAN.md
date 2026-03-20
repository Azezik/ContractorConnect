# Contractor Connect — Pre-Implementation Plan

## 1. Folder Structure

This structure is intentionally modular, but still practical for a real Vite + React + Firebase app.

```txt
ContractorConnect/
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ App.jsx
│  │  ├─ providers/
│  │  │  └─ AuthProvider.jsx
│  │  └─ router/
│  │     ├─ AppRouter.jsx
│  │     ├─ ProtectedRoute.jsx
│  │     ├─ RoleGate.jsx
│  │     └─ routeConfig.js
│  │
│  ├─ assets/
│  │  └─ brand/
│  │
│  ├─ components/
│  │  ├─ auth/
│  │  │  ├─ AuthShell.jsx
│  │  │  ├─ LoginForm.jsx
│  │  │  ├─ SignupForm.jsx
│  │  │  └─ RoleSelectionCard.jsx
│  │  │
│  │  ├─ onboarding/
│  │  │  ├─ StepLayout.jsx
│  │  │  ├─ StepProgress.jsx
│  │  │  ├─ customer/
│  │  │  │  ├─ CustomerOnboardingFlow.jsx
│  │  │  │  ├─ CustomerIntroStep.jsx
│  │  │  │  ├─ JobBasicsStep.jsx
│  │  │  │  ├─ JobDetailsStep.jsx
│  │  │  │  ├─ JobTagsStep.jsx
│  │  │  │  └─ JobReviewStep.jsx
│  │  │  └─ contractor/
│  │  │     ├─ ContractorOnboardingFlow.jsx
│  │  │     ├─ ContractorIntroStep.jsx
│  │  │     ├─ BusinessInfoStep.jsx
│  │  │     ├─ ServicesStep.jsx
│  │  │     ├─ ServiceAreaStep.jsx
│  │  │     ├─ ContactStep.jsx
│  │  │     └─ ProfileReviewStep.jsx
│  │  │
│  │  ├─ jobs/
│  │  │  ├─ JobCard.jsx
│  │  │  ├─ JobFeedList.jsx
│  │  │  ├─ JobDetailsHero.jsx
│  │  │  ├─ JobMetaPanel.jsx
│  │  │  ├─ JobTagList.jsx
│  │  │  └─ EmptyJobState.jsx
│  │  │
│  │  ├─ contractors/
│  │  │  ├─ ContractorProfileCard.jsx
│  │  │  ├─ ContractorSummaryPanel.jsx
│  │  │  └─ ContractorTagList.jsx
│  │  │
│  │  ├─ layout/
│  │  │  ├─ AppShell.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ MobileNav.jsx
│  │  │  ├─ PageContainer.jsx
│  │  │  └─ SectionHeader.jsx
│  │  │
│  │  ├─ landing/
│  │  │  ├─ HeroSection.jsx
│  │  │  ├─ RoleChooser.jsx
│  │  │  ├─ InfoSection.jsx
│  │  │  └─ LandingCTA.jsx
│  │  │
│  │  └─ ui/
│  │     ├─ Button.jsx
│  │     ├─ Card.jsx
│  │     ├─ Input.jsx
│  │     ├─ Textarea.jsx
│  │     ├─ Select.jsx
│  │     ├─ TagInput.jsx
│  │     ├─ Badge.jsx
│  │     ├─ Spinner.jsx
│  │     ├─ EmptyState.jsx
│  │     ├─ FormField.jsx
│  │     ├─ MultiStepShell.jsx
│  │     └─ Toast.jsx
│  │
│  ├─ constants/
│  │  ├─ categories.js
│  │  ├─ roles.js
│  │  ├─ routes.js
│  │  ├─ jobStatus.js
│  │  ├─ moderationStatus.js
│  │  ├─ availability.js
│  │  └─ appConfig.js
│  │
│  ├─ firebase/
│  │  └─ firebase.js
│  │
│  ├─ hooks/
│  │  ├─ useAuth.js
│  │  ├─ useCurrentUser.js
│  │  ├─ useJobs.js
│  │  ├─ useJobDetails.js
│  │  ├─ useContractorProfile.js
│  │  └─ useAsyncState.js
│  │
│  ├─ lib/
│  │  ├─ formatters/
│  │  │  ├─ dates.js
│  │  │  ├─ text.js
│  │  │  └─ location.js
│  │  ├─ validation/
│  │  │  ├─ authValidation.js
│  │  │  ├─ onboardingValidation.js
│  │  │  └─ commonValidation.js
│  │  └─ guards/
│  │     ├─ roleHelpers.js
│  │     └─ onboardingHelpers.js
│  │
│  ├─ pages/
│  │  ├─ LandingPage.jsx
│  │  ├─ LoginPage.jsx
│  │  ├─ SignupPage.jsx
│  │  ├─ RoleSelectionPage.jsx
│  │  ├─ DashboardPage.jsx
│  │  ├─ customer/
│  │  │  ├─ CustomerOnboardingPage.jsx
│  │  │  ├─ CustomerHomePage.jsx
│  │  │  └─ CreateJobPage.jsx
│  │  ├─ contractor/
│  │  │  ├─ ContractorOnboardingPage.jsx
│  │  │  ├─ ContractorHomePage.jsx
│  │  │  ├─ JobFeedPage.jsx
│  │  │  └─ ContractorProfilePage.jsx
│  │  ├─ jobs/
│  │  │  ├─ JobDetailsPage.jsx
│  │  │  └─ MyJobPostsPage.jsx
│  │  ├─ inbox/
│  │  │  ├─ InboxPage.jsx
│  │  │  └─ ConversationPage.jsx
│  │  ├─ settings/
│  │  │  └─ SettingsPage.jsx
│  │  ├─ moderation/
│  │  │  └─ ModerationQueuePage.jsx
│  │  └─ NotFoundPage.jsx
│  │
│  ├─ services/
│  │  ├─ authService.js
│  │  ├─ userService.js
│  │  ├─ jobPostService.js
│  │  ├─ contractorProfileService.js
│  │  ├─ conversationService.js
│  │  ├─ messageService.js
│  │  ├─ reviewService.js
│  │  ├─ reportService.js
│  │  ├─ moderationService.js
│  │  └─ storageService.js
│  │
│  ├─ styles/
│  │  ├─ index.css
│  │  ├─ theme.css
│  │  ├─ utilities.css
│  │  └─ components.css
│  │
│  ├─ main.jsx
│  └─ index.css
│
├─ .env.example
├─ package.json
├─ vite.config.js
└─ README.md
```

---

## Why this structure works

### Keeps Firebase logic out of UI
All Firebase reads/writes live in `services/` and `firebase/`, not inside page components.

### Supports Phase 1 without blocking later phases
You need working:
- signup/login
- onboarding
- job creation
- contractor profile creation
- job feed
- job details

This structure supports that immediately, while already reserving clean places for:
- inbox
- moderation
- reviews
- reports
- storage/media
- settings
- search/matching

### Avoids over-engineering
This is modular, but not “enterprise framework” heavy:
- plain React
- plain Firebase client SDK
- reusable components
- lightweight hooks
- practical service layer

---

# 2. Firestore Collection Plan

You explicitly asked to architect for the full platform now. So I would create the **full collection model from day one**, while only actively using the required parts in Phase 1.

---

## Core collections

---

## `users/{userId}`

This is the account record tied to Firebase Auth.

### Purpose
Stores profile/account metadata used throughout the app.

### Fields
```js
{
  fullName: string,
  username: string,
  email: string,
  city: string,
  postalCode: string,

  roles: string[], // ["customer"] or ["contractor"] for now
  primaryRole: string, // "customer" or "contractor"

  onboardingComplete: boolean,
  onboardingState: {
    customerComplete: boolean,
    contractorComplete: boolean
  },

  accountStatus: string, // "active", "restricted", "suspended"
  authProvider: "password",

  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Important architecture choice
Instead of only storing `role: "customer"`, I recommend:
- `primaryRole`
- `roles: []`

This allows future multi-role support **without rewriting the data model**.

---

## `jobPosts/{jobPostId}`

### Purpose
Customer-created work requests.

### Fields
```js
{
  ownerId: string,
  ownerSnapshot: {
    fullName: string,
    city: string,
    postalCode: string
  },

  title: string,
  category: string,
  description: string,
  city: string,
  postalCode: string,
  tags: string[],

  budget: string | null,
  timeline: string | null,

  imageUrls: string[],
  imageMeta: [],

  status: "active" | "closed" | "archived",
  moderationStatus: "visible" | "flagged" | "hidden",

  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Phase 1 use
Fully active:
- create
- list active jobs
- show details

### Later extension
Can support:
- search
- matching
- reporting
- conversation linkage
- moderation flags

---

## `contractorProfiles/{profileId}`

### Purpose
Public contractor business identity.

### Recommended document ID
Use **ownerId as profileId** in Phase 1.

That means:
- `contractorProfiles/{userId}`

This simplifies:
- fetching current user’s contractor profile
- checking whether onboarding is complete
- linking future reviews/messages

### Fields
```js
{
  ownerId: string,

  businessName: string,
  displayName: string,
  categories: string[],
  serviceArea: string,
  bio: string,
  servicesOffered: string[],
  tags: string[],

  phone: string | null,
  website: string | null,

  availabilityStatus: string, // "available", "busy", "limited"
  imageUrls: string[],
  imageMeta: [],

  averageRating: number,
  reviewCount: number,

  moderationStatus: "visible" | "flagged" | "hidden",

  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Phase 1 use
Fully active:
- create profile
- save to Firestore
- later show summary on contractor pages

---

## `conversations/{conversationId}`

### Purpose
Message threads between customer and contractor.

### Fields
```js
{
  participants: string[],
  participantRoles: {
    [userId]: "customer" | "contractor"
  },

  relatedJobPostId: string | null,
  relatedContractorProfileId: string | null,

  contextSnapshot: {
    jobTitle: string | null,
    contractorBusinessName: string | null,
    contractorCategories: string[] | null,
    serviceArea: string | null
  },

  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastMessagePreview: string,
  lastMessageAt: Timestamp | null,

  status: "active" | "closed" | "flagged"
}
```

### Phase 1 use
Scaffold only.
No UI yet unless we later choose to start Phase 2.

---

## `conversations/{conversationId}/messages/{messageId}``

I recommend **messages as a subcollection**, not top-level.

### Why subcollection is better here
- naturally grouped by conversation
- easier thread reads
- clean mental model for inbox
- future moderation can still reference conversation + message IDs

### Fields
```js
{
  senderId: string,
  content: string,

  createdAt: Timestamp,
  readBy: string[],

  moderationStatus: "visible" | "flagged" | "hidden",
  status: "sent" | "edited" | "deleted"
}
```

---

## `reviews/{reviewId}`

### Purpose
Verified contractor reviews tied to real job interactions.

### Fields
```js
{
  contractorId: string,
  reviewerId: string,
  jobPostId: string,

  rating: number,
  reviewText: string,

  createdAt: Timestamp,
  moderationStatus: "visible" | "flagged" | "hidden"
}
```

### Phase 1 use
Scaffold only.

---

## `reports/{reportId}`

### Purpose
User-submitted reports across the platform.

### Fields
```js
{
  reporterId: string,
  targetType: string, // "jobPost", "contractorProfile", "message", "review", "account"
  targetId: string,
  relatedConversationId: string | null,
  reason: string,
  details: string,

  createdAt: Timestamp,
  status: "open" | "reviewing" | "resolved" | "dismissed"
}
```

---

## `moderationQueue/{itemId}`

### Purpose
Operational queue for moderators.

### Fields
```js
{
  reportId: string,
  targetType: string,
  targetId: string,

  priority: "low" | "medium" | "high",
  status: "open" | "assigned" | "resolved",

  createdAt: Timestamp,
  assignedTo: string | null,

  actionTaken: string | null
}
```

---

## `adminActions/{actionId}`

### Purpose
Auditable moderator/admin decisions later.

### Fields
```js
{
  actorId: string,
  actorRole: string,
  actionType: string, // "hide_post", "restrict_account", etc.
  targetType: string,
  targetId: string,
  reason: string,
  metadata: object,
  createdAt: Timestamp
}
```

### Phase 1 use
Scaffold only.

---

## Optional `categories/{categoryId}`

### Recommendation
For Phase 1, do **not require categories in Firestore**.
Keep them in `src/constants/categories.js`.

### Why
- simpler
- faster
- stable
- no need for admin category management tonight

Later, if you want dynamic category management, you can migrate to Firestore without changing UI architecture much.

---

# 3. Storage Plan

Even if image uploads are partially implemented later, the structure should be decided now.

## Storage paths

```txt
users/{userId}/avatar/{fileName}
users/{userId}/jobPosts/{jobPostId}/{fileName}
users/{userId}/contractorProfile/{fileName}
users/{userId}/reports/{reportId}/{fileName}
users/{userId}/messages/{conversationId}/{fileName}
```

## Firestore media metadata approach
In Phase 1, job posts and contractor profiles will store:
- `imageUrls: []`
- `imageMeta: []`

That means UI and schema are ready now, even if uploads are deferred.

---

# 4. Route / Page Structure

This route map is designed so the app is coherent from day one.

---

## Public routes

### `/`
**LandingPage**
- Hero
- intro copy
- role selection
- continue to login/signup CTA

### `/login`
**LoginPage**
- email/password login

### `/signup`
**SignupPage**
- full name
- username
- email
- password
- city
- postal code

---

## Authenticated shared routes

### `/role-select`
**RoleSelectionPage**
- Choose:
  - I need work done
  - I’m a contractor
- Sets role in Firestore if not already chosen
- Future-safe for multi-role support

### `/dashboard`
**DashboardPage**
- smart redirect page
- routes users based on:
  - auth state
  - role
  - onboarding completion

This becomes the central “where should this user go?” decision layer.

---

## Customer routes

### `/onboarding/customer`
**CustomerOnboardingPage**
- multi-step onboarding
- ends by creating first real job post

### `/customer/home`
**CustomerHomePage**
Phase 1 can be simple:
- welcome
- summary
- link to create job / view jobs later

### `/jobs/new`
**CreateJobPage**
- optional future standalone job creation page
- Phase 1 may reuse onboarding flow
- useful for Phase 6 account tools later

### `/jobs/mine`
**MyJobPostsPage**
- scaffold now, implement later or lightly
- for future customer account management

---

## Contractor routes

### `/onboarding/contractor`
**ContractorOnboardingPage**
- multi-step onboarding
- ends by creating contractor profile

### `/contractor/home`
**ContractorHomePage**
- dashboard shell
- quick actions
- profile status
- link to job feed

### `/feed`
**JobFeedPage**
- active job posts for contractors
- browsable list

### `/contractor/profile`
**ContractorProfilePage**
- current contractor’s profile
- Phase 1 can be simple but real

---

## Shared authenticated content routes

### `/jobs/:jobId`
**JobDetailsPage**
- real job details view

---

## Phase 2+ scaffolded routes

### `/inbox`
**InboxPage**
- scaffold route now
- later active

### `/inbox/:conversationId`
**ConversationPage**
- scaffold route now

### `/settings`
**SettingsPage**
- scaffold now
- real later

### `/moderation/queue`
**ModerationQueuePage**
- scaffold only
- gated later by role

### `*`
**NotFoundPage**

---

# 5. Navigation / User Flow Structure

This is how the app should behave once implemented.

---

## New user flow

### Public entry
1. User lands on `/`
2. Clicks CTA or role option
3. Goes to `/signup` or `/login`

### Signup
4. Account is created in Firebase Auth
5. Firestore user doc is created in `users/{uid}`
6. User is redirected to `/role-select` unless role already exists

### Role selection
7. User chooses:
   - customer
   - contractor
8. Firestore user doc updated with:
   - `roles`
   - `primaryRole`

### Role-based onboarding
9. If customer:
   - go to `/onboarding/customer`
10. If contractor:
   - go to `/onboarding/contractor`

### Customer onboarding completion
11. Create `jobPosts/{jobPostId}`
12. Mark customer onboarding complete in `users/{uid}`
13. Send user to `/customer/home`

### Contractor onboarding completion
14. Create `contractorProfiles/{uid}`
15. Mark contractor onboarding complete in `users/{uid}`
16. Send user to `/feed` or `/contractor/home`

---

## Returning user flow

### Customer
- if onboarding complete → `/customer/home`

### Contractor
- if onboarding complete → `/feed` or `/contractor/home`

### Incomplete onboarding
- redirect back into correct onboarding flow

---

# 6. Phase 1 Page-by-Page Implementation Scope

This is the “must work tonight” scope.

---

## A. Landing page
**Must be polished and real**
- Hero
- brand direction
- role chooser
- intro sections
- CTA to login/signup

---

## B. Auth
**Must be fully functional**
- signup with required fields
- login
- logout
- auth state persistence
- Firestore user doc creation

---

## C. Role selection
**Must be fully functional**
- user picks customer or contractor
- data saved to Firestore
- future multi-role-friendly structure

---

## D. Customer onboarding
**Must be fully functional**
- multi-step flow
- form validation
- tag input
- category select
- budget/timeline optional
- save job post to Firestore
- tie to ownerId

---

## E. Contractor onboarding
**Must be fully functional**
- multi-step flow
- category multi-select
- services offered input
- tags input
- service area
- save contractor profile to Firestore
- tie to ownerId

---

## F. Job feed
**Must be fully functional**
- fetch active job posts from Firestore
- show cards
- allow contractors to browse
- mobile responsive

---

## G. Job details
**Must be fully functional**
- fetch single job
- show details cleanly
- image placeholder architecture ready

---

# 7. Implementation Order

You asked for a concrete build order before coding. This is the order I would use.

---

## Step 1 — App shell and project setup
- Initialize Vite React app structure
- Set up base CSS/theme
- Create routing shell
- Create app layout primitives
- Add constants and route map

### Why first
This gives everything else a clean foundation.

---

## Step 2 — Firebase foundation
- Create `src/firebase/firebase.js`
- initialize:
  - app
  - auth
  - db
  - storage
- create service modules:
  - authService
  - userService
  - jobPostService
  - contractorProfileService
  - storageService

### Why second
Everything core depends on this.

---

## Step 3 — Auth state management
- AuthProvider
- `useAuth`
- protected routes
- dashboard redirect logic

### Why third
All feature flows depend on user/session awareness.

---

## Step 4 — Landing page
- build polished marketing page
- role chooser UI
- intro sections
- CTA flow into auth

### Why fourth
Important for demo quality and app framing.

---

## Step 5 — Signup/login
- signup form
- login form
- Firestore user doc creation
- validation
- success/error states

### Why fifth
Enables real user entry into the product.

---

## Step 6 — Role selection flow
- role select page
- save role in Firestore
- redirect logic by role

### Why sixth
Necessary before role-based onboarding.

---

## Step 7 — Customer onboarding flow
- build multi-step onboarding UI
- validate inputs
- create job post in Firestore
- mark onboarding complete

### Why seventh
This completes one side of the marketplace loop.

---

## Step 8 — Contractor onboarding flow
- build contractor setup steps
- create contractor profile in Firestore
- mark onboarding complete

### Why eighth
This completes the second side of the marketplace loop.

---

## Step 9 — Job feed
- Firestore query for active job posts
- job cards
- empty states
- loading states

### Why ninth
Makes contractor-side value immediately real.

---

## Step 10 — Job details page
- fetch job by ID
- render clean details page
- architect for future messaging CTA and images

### Why tenth
Completes browsing loop.

---

## Step 11 — Scaffold later-phase services and routes
- conversation service stub
- review service stub
- report service stub
- moderation service stub
- inbox/settings/moderation pages scaffolded
- not wired into Phase 1 behavior yet

### Why eleventh
Preserves long-term architecture without risking tonight’s delivery.

---

# 8. Key Architecture Decisions I Recommend

These matter because they prevent future rewrites.

---

## Decision 1: `roles[]` + `primaryRole`
Instead of a single fixed `role` field only.

### Benefit
Supports:
- future multi-role accounts
- cleaner account evolution
- less painful migration later

---

## Decision 2: contractor profile ID = user ID
Use:
- `contractorProfiles/{userId}`

### Benefit
- simpler lookups
- easier ownership checks
- cleaner onboarding state logic

---

## Decision 3: messages as subcollection under conversations
Use:
- `conversations/{conversationId}/messages/{messageId}`

### Benefit
- clearer thread ownership
- easier to reason about
- scales fine for this product shape

---

## Decision 4: category constants locally first
Keep categories in:
- `src/constants/categories.js`

### Benefit
- simpler MVP
- no extra Firestore dependency
- still easy to replace later if admin-managed categories are needed

---

## Decision 5: onboarding completion tracked in user doc
Use:
```js
onboardingState: {
  customerComplete: false,
  contractorComplete: false
}
```

### Benefit
Makes routing logic much cleaner.

---

## Decision 6: image architecture now, full uploads later
Include `imageUrls` and storage service from day one, even if upload UI is partial in Phase 1.

### Benefit
No schema change later for job posts/profiles.

---

# 9. What I Will Build First Once You Confirm

If you approve this plan, I will implement in this order:

### Phase 1 code delivery order
1. project scaffold + routes + theme
2. Firebase module and services
3. auth provider + protected routes
4. landing page
5. signup/login
6. role selection
7. customer onboarding → Firestore job post creation
8. contractor onboarding → Firestore contractor profile creation
9. job feed
10. job details page
11. Phase 2+ scaffolding that does **not** break Phase 1

---

# 10. Practical Notes Before Implementation

## Firebase config
I will place your exact config in:

- `src/firebase/firebase.js`

And export:
- `auth`
- `db`
- `storage`

with one-time initialization only.

---

## Storage
I will wire Storage initialization immediately, even if image uploads are only partially surfaced in Phase 1.

---

## UI style direction
I will implement:
- green-toned palette
- rounded cards
- soft shadows
- modern onboarding feel
- responsive layout
- polished beta-ready presentation

---

## No fake features
Phase 1 will not include broken half-features for:
- messaging
- moderation dashboard
- reviews
- admin actions

Those will be **scaffolded cleanly**, not falsely simulated.
