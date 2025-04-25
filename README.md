# DriveHub Mobile App

## Overview

DriveHub is a mobile application designed for truck drivers to manage their loads, tasks, compliance, and communication efficiently. This application aims to streamline daily operations for drivers, providing easy access to critical information and tools.

This project is built using React Native (with Expo) and Redux Toolkit for state management.

## Features Implemented

*   **Authentication**: Secure login/logout flow.
*   **Dashboard**: Overview of today's metrics, active load, and pending tasks.
*   **Loads Management**:
    *   View Confirmed/Active, Unconfirmed, and Completed loads.
    *   View detailed load information including pickup/dropoff details, timeline, load specs, instructions, recommendations, and dispatch notes.
    *   Confirm/Reject unconfirmed loads.
    *   Bulk confirm unconfirmed loads.
    *   Confirm pickup.
    *   Complete delivery with POD photo upload and notes.
    *   Request load reassignment.
*   **Compliance Tasks**: View and complete compliance-related tasks (e.g., inspections, HOS review).
*   **Documents**: View compliance, driver, and shipper documents categorized in tabs. (Upload/View/Delete functionality pending).
*   **Reporting**:
    *   Report incidents (accidents, breakdowns, etc.) with description and photo uploads.
    *   Log maintenance issues with description and photo uploads.
*   **Profile Management**: View and edit driver profile information (name, contact, license), including profile picture upload.
*   **Settings**: Basic settings structure with logout functionality. (Theme, notifications, etc., pending).
*   **Navigation**: Tab-based navigation for main sections and stack navigators for nested screens.
*   **State Management**: Centralized state management using Redux Toolkit.
*   **Mock Data**: Uses mock data and services for development purposes, simulating API interactions.

## Project Structure

```
DriveHubApp/
├── src/
│   ├── assets/             # Static assets (images, fonts)
│   ├── components/         # Reusable UI components (LoadCard, AppHeader, etc.)
│   ├── constants/          # Constant values (navigation routes, mock data)
│   ├── navigation/         # Navigation setup (stack, tab navigators)
│   ├── screens/            # Application screens (Login, Dashboard, Loads, etc.)
│   ├── services/           # API service integrations (currently mocked in slices)
│   ├── store/              # Redux store configuration and slices
│   │   ├── slices/         # Redux state slices (auth, loads, tasks, etc.)
│   │   └── store.js        # Redux store setup
│   ├── theme/              # UI Theme configuration
│   └── App.js              # Main application component
├── .gitignore
├── app.json                # Expo configuration
├── babel.config.js
├── package.json
└── README.md               # This file
```

## Setup

1.  **Prerequisites**: Ensure you have Node.js, npm/yarn, and Expo CLI installed.
    *   Node.js: [https://nodejs.org/](https://nodejs.org/)
    *   Expo CLI: `npm install -g expo-cli` or `yarn global add expo-cli`
2.  **Clone the repository** (if applicable).
3.  **Install dependencies**: Navigate to the `DriveHubApp` directory in your terminal and run:
    ```bash
    npm install
    # or
    yarn install
    ```

## Running the Application

1.  **Start the Metro Bundler**: In the `DriveHubApp` directory, run:
    ```bash
    npx expo start
    # or
    yarn start
    ```
2.  **Run on a device/simulator**:
    *   **iOS Simulator**: Press `i` in the terminal where Metro is running.
    *   **Android Emulator**: Press `a` in the terminal.
    *   **Physical Device**: Install the Expo Go app on your iOS or Android phone and scan the QR code shown in the terminal or Expo Dev Tools.

## Mock Services

This application currently uses mock services defined directly within the Redux slice files (e.g., `src/store/slices/loadsSlice.js`, `src/store/slices/authSlice.js`, etc.). These simulate API calls with artificial delays. For a production application, these would be replaced with actual API integrations (e.g., using `fetch` or `axios`) in a dedicated `src/services` directory.

## Known Issues / Future Work

*   Replace all mock services with actual API calls.
*   Implement document upload, view (PDF/Image), and delete functionality.
*   Implement theme switching and other settings in the Settings screen.
*   Implement signature capture for delivery completion.
*   Add real-time features (e.g., load updates, chat) using WebSockets or push notifications.
*   Add unit and integration tests.
*   Refine UI/UX based on user feedback.
*   Implement dynamic version display in Settings.
*   Address all remaining `TODO` comments in the codebase. 