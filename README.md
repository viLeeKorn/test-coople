# Coople Mobile App

## Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npx expo start
   ```

## Project Structure & Architecture

- **app/**
  - **(tabs)/**: Contains the main tab navigation and tab screens (jobs, favorites, profile).
    - **jobs/**: Job list and related screens.
    - **favorites/**: User's favorite jobs.
    - **profile/**: User profile screen.
  - **job/**: Contains the job details screen, which opens as a separate stack/modal and supports deep linking (`/job/:id`).
  - **_layout.tsx**: Root navigation layout. Uses a Stack navigator to combine tabs and modal screens.

- **utils/**
  - **favorites.ts**: Utility functions for managing favorite jobs using AsyncStorage.

- **assets/**: App icons and images.

## Navigation
- Uses `expo-router` for navigation.
- Tab navigation is defined in `app/(tabs)/_layout.tsx`.
- Job details (`/job/:id`) open as a modal/screen outside the tabs for deep linking and better UX.

---

For more details, see the code comments and each directory's files. 