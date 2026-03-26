<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# TalentID

AI-powered psychometric profiling application that generates talent profiles based on Enneagram test responses.

## Features

- 20-question Enneagram-based psychometric test
- AI-generated personality profiles with competencies
- Bilingual support (English/Spanish)
- Leadership style and cultural fit analysis

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   ```
   npm run dev
   ```

## Testing

Run all tests:
```
npm test
```

Test coverage:
- L0: Unit tests (utils, types)
- L1: Component tests (TalentForm)
- L2: API integration tests
- L3: E2E flow tests

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Jest + Testing Library
- Google Gemini API