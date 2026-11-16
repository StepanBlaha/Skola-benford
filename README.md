# Benford's law

Web app that checks if numbers in a CSV file follow Benford's law.

Live: https://stepanblaha.github.io/Skola-benford/

## What it does

- Upload a CSV, drop it on the page, paste it or load the sample (population of countries)
- Picks the column with the most numbers automatically, you can change it
- Shows how often each first digit (1-9) appears compared to Benford's law, as a chart and a table
- Says if the data follows the law, using MAD (mean absolute deviation)
- Warns when there are too few numbers or when the numbers are too close to each other

## Benford's law

In a lot of real data (populations, prices, bank accounts...) the first digit is not random. About 30 % of numbers
start with 1 and only about 5 % with 9. The expected share of numbers starting with digit d is:

```
P(d) = log10(1 + 1/d)
```

It works for data that grows by multiplying and goes over several orders of magnitude. Heights of people or grades
don't follow it.

To say how close the data is, the app counts MAD, the average difference between the data and the law. Limits are
from Mark Nigrini (Benford's Law, 2012):

| MAD             | Result        |
| --------------- | ------------- |
| up to 0.006     | close         |
| up to 0.012     | acceptable    |
| up to 0.015     | marginal      |
| more than 0.015 | nonconformity |

## CSV support

- Delimiter `,` `;` or tab, picked from the header line
- Czech numbers like `1 234,5` and English like `1,234.5`
- Quoted cells like `"Rohlik; s.r.o."`
- Dates like `01.01.2025` are not counted as numbers
- Max file size 5 MB

Test files are in `test-data/`.

## Running it

```
npm install
npm run dev
```

Other scripts:

| Script           | What it does                       |
| ---------------- | ---------------------------------- |
| `npm test`       | runs tests (Vitest)                |
| `npm run lint`   | ESLint                             |
| `npm run format` | formats code with Prettier         |
| `npm run build`  | type check and build to `dist/`    |
| `npm run deploy` | builds and deploys to GitHub Pages |

GitHub Actions runs format check, lint, tests and build on every push.

## Structure

```
src/
  components/        Button, Section
  hooks/useCsvData   state of the app, loading files and the sample
  pages/home/        page and its parts (data, result, chart, table)
  schemas/csv        Zod validation of files and text
  utils/
    benford          Benford's law, first digits, number parsing
    conformity       MAD and warnings
    csv              CSV parsing
    format           percents
```

## Built with

React, TypeScript, Vite, Recharts, Zod, Vitest, CSS modules
