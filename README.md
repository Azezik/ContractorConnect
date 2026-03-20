# Contractor Connect

A modular React + Vite + Firebase marketplace for connecting contractors with people who need work done.

## Matching foundation

Contractor Connect matches **contractor profiles to job posts**, not people to people.

The current foundation keeps matching separate from form flows:

- onboarding forms write normal job/profile fields
- services also persist a normalized `matchingProfile`
- the contractor feed reads the normalized matching profile instead of scraping raw form fields

See `MATCHING_FOUNDATION.md` for the field audit, normalized model, and MVP scoring design.

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`

## Firebase

The Firebase web config is initialized once in `src/firebase/firebase.js`.

### Firestore rules

This app expects each signed-in user to be able to read and write their own `users/{uid}` document during signup and login bootstrap.

Starter rulesets are included in `firestore.rules` and `storage.rules`. After updating them for your production needs, deploy them with Firebase:

```bash
firebase deploy --only firestore:rules,storage
```

The Storage rules expect account-scoped file ownership under paths like `users/{uid}/jobPosts/{jobPostId}/...` and `users/{uid}/contractorProfile/...`.
