# NAD PORTFOLIO | Cinematic & Modern

A dual-site portfolio system for **Nadjibullah Uwabato**. 

## Structure
- `/public-site`: The high-end, cinematic public portfolio.
- `/admin-site`: The secure control panel for managing portfolio content.

## Features
- **Cinematic Design**: High-contrast, premium typography (Outfit & Inter), and smooth visual transitions.
- **Dynamic Content**: Real-time synchronization with Firebase Firestore.
- **Project Filtering**: categorization for Video/AI Film and Website/Graphic projects.
- **In-App Previews**: Cinematic modals for viewing YouTube, Drive, or External links without leaving the site.
- **Admin Control**: Add or delete projects with instant global updates.

## Setup
1. **Firebase**: Deployment is configured for `nadportfolio.web.app`.
2. **Firestore Rules**: Deploy the included `firestore.rules` to enforce secure administrative access.
3. **Admin Access**:
   - **Method**: Email/Password or Authorized Google Account.
   - **Signup**: Available via the login interface for new administrators.

## Deployment
Update your `firebase.json` if you wish to deploy specific folders to specific domains or paths.
