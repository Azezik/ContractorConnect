# Contractor Connect

A modular React + Vite + Firebase marketplace for connecting contractors with people who need work done.

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`

## Firebase

The Firebase web config is initialized once in `src/firebase/firebase.js`.

### Firestore rules

This app expects each signed-in user to be able to read and write their own `users/{uid}` document during signup and login bootstrap.

A starter ruleset is included in `firestore.rules`. After updating it for your production needs, deploy it with Firebase:

```bash
firebase deploy --only firestore:rules
```
