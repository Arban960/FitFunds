# FitFunds

FitFunds is a hackathon project that links gym attendance to a money goal. You pick a workout target, choose a gym, check in when you're there, and track progress toward both your fitness goal and a simple investment idea.

The goal was to make consistency a little more motivating.

## What it does

- Create an account and sign in
- Set a workout goal and dollar amount
- Pick a gym and save its location
- Check in from the gym using device location
- Track workout progress and investment totals
- Connect to Alpaca paper trading when the goal is met

## Tech stack

- React Native + Expo
- TypeScript
- Firebase Authentication + Firestore
- Python + Flask
- Expo Location + React Native Maps
- Alpaca paper trading API

## Project structure

```text
FitFunds/
├── app/
├── components/
├── constants/
├── hooks/
├── scripts/
├── firebase.config.js
├── server.py
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

## Quick start

### 1. Install dependencies

```bash
git clone https://github.com/Arban960/FitFunds.git
cd FitFunds
npm install
```

### 2. Set up Firebase

Create a Firebase project with Authentication and Firestore enabled, then add your config to `firebase.config.js`.

### 3. Run the backend

```bash
python -m venv .venv
source .venv/bin/activate
pip install flask flask-cors alpaca-trade-api
python server.py
```

### 4. Start the app

```bash
npx expo start
```

Then run it in a simulator, emulator, or Expo Go app.

## How it works

1. Sign up and verify your email.
2. Set a weekly gym goal and amount.
3. Pick your gym on the map.
4. Check in at the gym and let the app verify your location.
5. See your progress and investment summary update.

## Notes

This was built as a hackathon project, so the focus was on proving the idea quickly and keeping the app easy to understand rather than turning it into a production product.

## Author

Created by [Arban960](https://github.com/Arban960).
