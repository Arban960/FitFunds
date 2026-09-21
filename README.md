# FitFunds

> **Build healthy habits. Invest in your future.**

FitFunds is a mobile fitness accountability app that connects gym attendance with personal finance. Users set a workout commitment and a dollar amount, verify gym visits using their device location, and track the investment activity associated with their progress.

Built as a full-stack hackathon project, FitFunds combines a React Native mobile experience with Firebase authentication and persistence, location-aware workout verification, and a Flask service that integrates with Alpaca paper trading.

## Why FitFunds?

Fitness apps often track activity, while finance apps track money. FitFunds brings the two ideas together through a simple behavioral incentive:

- Meet your workout goal and build consistency.
- Verify attendance at a selected gym instead of relying only on a manual check-in.
- Track an investment commitment tied to your goal.
- Make progress visible through both workout and investment summaries.

## Features

- **Account creation and authentication**
  - Email/password registration and sign-in with Firebase Authentication.
  - Email verification before accessing the main experience.
  - Persistent user records stored in Cloud Firestore.
- **Personalized workout commitments**
  - Set a target number of gym visits.
  - Set the dollar amount associated with the commitment.
  - View current progress against the target in the dashboard.
- **Location-aware gym setup**
  - Use device location to identify the user's current position.
  - Select and save a gym location on an interactive map.
  - Persist the gym coordinates to the user's Firestore profile.
- **Attendance verification**
  - Request foreground location permission at check-in time.
  - Calculate distance between the user and saved gym coordinates.
  - Increment workout progress only when the user is within the configured proximity threshold.
- **Investment tracking**
  - Connect to Alpaca's paper-trading API through a Flask backend.
  - Submit simulated VOO purchase orders when the defined commitment condition is met.
  - Retrieve total invested amount and current position value.
- **Mobile-first experience**
  - Expo Router file-based navigation.
  - NativeWind/Tailwind styling.
  - React Native components for iOS, Android, and web development workflows.
  - Light/dark theme support and Expo splash-screen handling.

## Tech stack

| Area | Technologies |
| --- | --- |
| Mobile app | React Native, Expo SDK 52, TypeScript |
| Navigation | Expo Router, React Navigation |
| Styling | NativeWind, Tailwind CSS |
| Authentication | Firebase Authentication |
| Data | Cloud Firestore |
| Location and maps | Expo Location, React Native Maps |
| Backend API | Python, Flask, Flask-CORS |
| Trading integration | Alpaca paper-trading API |
| Testing | Jest, Jest Expo, React Test Renderer |
| Quality | TypeScript, Expo lint |

## Project structure

```text
FitFunds/
├── app/
│   ├── (tabs)/          # Main dashboard and profile tabs
│   ├── Login.tsx        # Firebase sign-in flow
│   ├── Register.tsx     # Account creation and email verification
│   ├── SetGoal.tsx      # Workout and financial commitment setup
│   ├── Gym.tsx          # Map-based gym selection
│   └── _layout.tsx      # Root navigation and theme setup
├── components/          # Reusable themed and navigation components
├── constants/           # Shared design constants
├── hooks/               # Reusable React hooks
├── scripts/             # Expo project utilities
├── firebase.config.js   # Firebase client initialization
├── server.py            # Flask API for Alpaca paper trading
├── app.json             # Expo configuration
├── package.json         # App scripts and dependencies
└── tsconfig.json        # TypeScript configuration
```

## Getting started

### Prerequisites

Install the following before running FitFunds:

- Node.js 18 or newer
- npm
- Python 3.9 or newer
- An Expo-compatible device, emulator, or simulator
- A Firebase project with Authentication and Firestore enabled
- An Alpaca paper-trading account and API credentials for investment features

### 1. Clone and install the mobile app

```bash
git clone https://github.com/Arban960/FitFunds.git
cd FitFunds
npm install
```

### 2. Configure Firebase

Create or select a Firebase project, enable:

1. **Authentication** → Email/Password
2. **Cloud Firestore**

Update the Firebase client configuration in `firebase.config.js` with your project values. For production use, move configuration to environment variables and configure Firestore Security Rules before deploying.

### 3. Configure the Flask trading service

Create a virtual environment and install the backend dependencies:

```bash
python -m venv .venv

# macOS/Linux
source .venv/bin/activate

# Windows PowerShell
.venv\Scripts\Activate.ps1

pip install flask flask-cors alpaca-trade-api
```

Set your Alpaca **paper-trading** credentials in the backend configuration before starting the server. Never commit real trading credentials to source control.

Start the API:

```bash
python server.py
```

The service listens on port `5000` by default. The mobile app currently calls the backend using a configured API URL in `app/(tabs)/index.tsx`; update that URL to the local network address of the machine running Flask when testing on a physical device.

### 4. Start Expo

```bash
npx expo start
```

Then choose one of the available targets:

```bash
npm run android  # Android emulator/device
npm run ios      # iOS simulator
npm run web      # Web browser
```

For a physical device, make sure the device and development machine are on the same network and that location permissions are enabled.

## API endpoints

The Flask service currently exposes the following endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/auto_invest<investment_amount>` | Submit a paper-trading buy order for VOO |
| `GET` | `/total_invested` | Return the total notional amount invested in VOO |
| `GET` | `/total_earned` | Return current VOO value, cost basis, and calculated earnings |

> **Disclaimer:** Alpaca integration is configured for paper trading. FitFunds is a software project and does not provide financial advice. Do not use the application with live trading credentials without adding appropriate authorization, validation, audit logging, and safety controls.

## Development commands

```bash
npm start          # Start the Expo development server
npm run android    # Start with Android target
npm run ios        # Start with iOS target
npm run web        # Start web target
npm run lint       # Run Expo linting
npm test           # Run Jest in watch mode
```

## Product flow

1. Register with an email address and password.
2. Verify the email address.
3. Define a weekly gym goal and financial commitment.
4. Select and save a gym location on the map.
5. Check in from the gym using device location verification.
6. Monitor workout progress and investment totals from the dashboard.
7. If the commitment condition is not met during the configured period, the backend can place a paper-trading order.

## Architecture notes

FitFunds uses a client/API split:

- **The Expo app** owns navigation, authentication state, user preferences, location permissions, gym-distance verification, and dashboard presentation.
- **Firebase** provides authentication and per-user Firestore documents.
- **The Flask service** isolates Alpaca interactions behind a small HTTP API and calculates investment summaries.
- **Expo Router** keeps navigation close to the screen implementation through file-based routes.

## Roadmap

Potential next steps for taking FitFunds from hackathon prototype to production-ready product:

- Move secrets and API URLs to environment-specific configuration.
- Replace public backend routes with authenticated, server-side user context.
- Add Firestore Security Rules and schema validation.
- Add a proper check-in/event history instead of only storing a running counter.
- Add automated tests for distance validation, goal-period logic, and API error cases.
- Improve investment reconciliation using Alpaca order IDs and server-side records.
- Add push notifications, streaks, progress history, and richer financial charts.
- Add CI for linting, type-checking, tests, and Expo builds.
- Add a production deployment guide and screenshots/video walkthrough.

## Contributing

Contributions are welcome. For substantial changes, open an issue first to discuss the proposed direction. When submitting a pull request, include:

- A concise explanation of the change
- Screenshots or a short recording for UI changes
- Test steps and any required Firebase or Alpaca configuration
- Confirmation that linting and relevant tests pass

## License

No license has been specified yet. Add a license file before distributing FitFunds or accepting external contributions under defined terms.

## Author

Created by [Arban960](https://github.com/Arban960).

If you are reviewing this project, the most relevant areas to explore are the Expo Router screens in `app/`, the Firebase integration in `firebase.config.js`, and the Flask/Alpaca service in `server.py`.
