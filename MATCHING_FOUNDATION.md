# Contractor Connect Matching Foundation

## Purpose

This document defines the contractor-to-job matching foundation so onboarding and profile editing can keep writing normal product data while the feed and future ranking systems read a stable, normalized contract.

The design goal is:

- forms collect user-friendly fields
- services persist the raw business/job document
- services also persist a normalized `matchingProfile`
- matching logic reads only normalized fields
- the contractor feed consumes deterministic match results

This keeps matching separate from the UI and avoids a backend rewrite.

---

## 1. Matching Input Audit

### Contractor profile audit

| Field | Source today | Matching classification | Notes |
| --- | --- | --- | --- |
| `ownerId` | `contractorProfiles/{uid}` | Should be removed from matching consideration | Identity/ownership only. |
| `businessName` | Contractor onboarding / profile doc | Optional scoring input | Useful only for keyword extraction in the normalized matcher, not as a direct filter. |
| `displayName` | Contractor onboarding / profile doc | Display-only | Branding text. |
| `categories` | Contractor onboarding / profile doc | Core matching input | Primary structured supply-side service grouping. |
| `postalCode` | Contractor onboarding / profile doc | Core matching input | Base location anchor for eligibility. |
| `workRadiusKm` | Contractor onboarding / profile doc | Core matching input | Defines coverage constraint. |
| `serviceArea` / `serviceAreaDescription` | Contractor onboarding / profile doc | Display-only | Human-readable location label; not reliable enough as a primary matcher input. |
| `bio` | Contractor onboarding / profile doc | Optional scoring input | Good source for extracted keywords, not a hard filter. |
| `servicesOffered` | Contractor onboarding / profile doc | Core matching input | Best structured signal for job-type relevance inside a category. |
| `tags` | Contractor onboarding / profile doc | Optional scoring input | Useful for overlap/ranking. |
| `phone` | Contractor onboarding / profile doc | Display-only | Trust/contact only. |
| `website` | Contractor onboarding / profile doc | Display-only | Trust/contact only. |
| `availabilityStatus` | Contractor onboarding / profile doc | Optional scoring input | Soft ranking signal later; not a hard eligibility rule in MVP. |
| `imageUrls` / `imageMeta` | Contractor onboarding / profile doc | Display-only | Portfolio/media only. |
| `averageRating` / `reviewCount` | Contractor profile doc | Optional scoring input | Future ranking signal after the core matcher is stable. |
| `moderationStatus` | Contractor profile doc | Should be removed from matching consideration | Visibility gate, not semantic matching. |
| `createdAt` / `updatedAt` | Contractor profile doc | Should be removed from matching consideration | Operational metadata. |

### Customer job post audit

| Field | Source today | Matching classification | Notes |
| --- | --- | --- | --- |
| `ownerId` | `jobPosts/{id}` | Should be removed from matching consideration | Identity/ownership only. |
| `ownerSnapshot.*` | Job post service | Display-only | Helpful for display and messaging context, not job relevance. |
| `title` | Customer onboarding / job post doc | Optional scoring input | Useful for keyword extraction. |
| `category` | Customer onboarding / job post doc | Core matching input | Primary structured demand-side service grouping. |
| `description` | Customer onboarding / job post doc | Optional scoring input | Good source for extracted keywords. |
| `city` | Customer onboarding / job post doc | Optional scoring input | Helpful for fallback geographic context and UI filters. |
| `postalCode` | Customer onboarding / job post doc | Core matching input | Base location anchor for eligibility. |
| `tags` | Customer onboarding / job post doc | Optional scoring input | Useful for overlap/ranking and service intent hints. |
| `budget` | Customer onboarding / job post doc | Optional scoring input | Future ranking/filtering only. |
| `timeline` | Customer onboarding / job post doc | Optional scoring input | Future ranking/filtering only. |
| `imageUrls` / `imageMeta` / `primaryImageUrl` | Job post doc | Display-only | Presentation/context only. |
| `status` | Job post doc | Should be removed from matching consideration | Visibility gate only; feed should already query active jobs. |
| `moderationStatus` | Job post doc | Should be removed from matching consideration | Visibility gate only. |
| `createdAt` | Job post doc | Optional scoring input | Freshness is a ranking signal after eligibility. |
| `updatedAt` | Job post doc | Should be removed from matching consideration | Operational metadata. |

### Current architectural observations

- Contractor onboarding already distinguishes structured matching fields from display-only service-area text.
- Job onboarding already collects the core structured fields needed for a deterministic MVP matcher.
- Both services already persist a `matchingProfile`, which means the architecture was close to the right separation, but the previous shape was too thin and the feed still depended on ad hoc assumptions.
- The current system does **not** store geocoordinates, so exact radius math is not yet possible from Firestore data alone. The MVP foundation therefore uses deterministic postal-code compatibility now and leaves a clear path for future coordinate-based distance ranking.

---

## 2. Normalized Matching Model

Both `contractorProfiles` and `jobPosts` should persist a normalized `matchingProfile` with the same top-level structure:

```js
{
  version: 2,
  entityType: "contractor" | "job",
  accountType: "contractor" | "customer",
  location: {
    postalCode: string,
    postalPrefix: string,
    city: string | null,
    coordinates: null, // future-ready
    maxRadiusKm: number | null
  },
  categoryKeys: string[],
  serviceKeys: string[],
  tagKeys: string[],
  keywordKeys: string[],
  constraints: {
    availabilityStatus: string | null,
    budget: string | null,
    timeline: string | null
  }
}
```

### Producer responsibilities

- Contractor onboarding/profile editing writes contractor business fields and also writes `matchingProfile` using the normalizer.
- Customer job creation/editing writes job fields and also writes `matchingProfile` using the normalizer.

### Consumer responsibilities

- The feed and matching engine read `matchingProfile`, not raw form-specific field names.
- The matcher can safely evolve from postal-prefix matching to coordinate-based radius math without changing the onboarding UI contract.

---

## 3. MVP Matching Engine Design

### Eligibility rules

For MVP, a contractor should only see a job when:

1. the job is geographically eligible
2. the job category overlaps the contractor category set

### Geographic eligibility

Current product data supports three deterministic states:

- **exact postal match** → eligible
- **same postal prefix** → eligible
- **geography incompatible / missing** → not eligible

Future enhancement:

- if both sides later store coordinates, use exact distance against `maxRadiusKm`

### Ranking after eligibility

Eligible jobs are ranked using:

1. location strength
2. service overlap
3. tag overlap
4. keyword overlap
5. freshness

This keeps the logic practical and deterministic while leaving room for later semantic improvements.

### Why this is intentionally simple

- no AI dependency
- no embeddings requirement
- no backend rewrite
- deterministic explanation for every result
- future-safe enough to add coordinates, budget filters, timeline matching, and reputation weighting later

---

## 4. Files that own the foundation

- `src/lib/matching/matchingProfiles.js`  
  Normalized profile builders and shared normalization helpers.

- `src/lib/matching/matchEngine.js`  
  Deterministic contractor-to-job eligibility and ranking logic.

- `src/lib/matching/jobFeedMatcher.js`  
  Feed-facing orchestration that converts jobs into matched feed results.

- `src/services/contractorProfileService.js`  
  Producer-side persistence for contractor matching profiles.

- `src/services/jobPostService.js`  
  Producer-side persistence for job matching profiles.

- `src/pages/contractor/JobFeedPage.jsx`  
  Feed integration point for eligible/matched results.

---

## 5. Future ranking improvements

The next improvements should build on the normalized `matchingProfile`, not on the form components:

1. add coordinates/geohash to both matching profiles
2. use exact distance against `maxRadiusKm`
3. add budget compatibility filters
4. add timeline urgency / availability scoring
5. add quality weighting such as review count or response rate
6. add semantic expansion only after the deterministic layer is proven

That path improves ranking quality without rewriting onboarding or the document model.
