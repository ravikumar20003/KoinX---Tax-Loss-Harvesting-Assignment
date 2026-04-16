# KoinX - Tax Loss Harvesting Assignment

A responsive React + TypeScript implementation of the KoinX Tax Loss Harvesting interface with mocked APIs, real-time harvesting updates, and selection-driven gains simulation.

## Tech Stack

- React 18
- TypeScript
- Vite
- Plain CSS (responsive)

## Features Implemented

- Pre-Harvesting card using mocked Capital Gains API
- After Harvesting card that updates in real time from selected holdings
- Net STCG, Net LTCG, and Realised Capital Gains calculations
- Savings banner shown only when post-harvest gains are lower than pre-harvest gains
- Holdings table rendered from mocked Holdings API
- Row selection + select all (header checkbox)
- Amount to sell auto-populated with total holdings when selected
- Loader and error UI states
- "View All / View Less" functionality
- Mobile responsive cards + horizontally scrollable table

## Project Structure

```text
src/
  api/
    mockApi.ts
  components/
    GainsCard.tsx
    HoldingsTable.tsx
  data/
    capitalGains.ts
    holdings.ts
  utils/
    calculations.ts
    format.ts
  App.tsx
  main.tsx
  styles.css
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## API Mocking Approach

Both APIs are mocked in `src/api/mockApi.ts` using Promise-based delays:

- `fetchCapitalGains()` returns the capital gains payload.
- `fetchHoldings()` returns holdings list payload.

## Assumptions

- Selecting an asset simulates harvesting that asset and updates post-harvesting buckets:
  - positive gain adds to `profits`
  - negative gain adds absolute value to `losses`
- Select-all applies to currently visible rows (supports View All / View Less behavior).
- Holdings are sorted by `currentPrice` (descending) for a logical default order.
