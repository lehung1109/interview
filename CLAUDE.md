# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains frontend developer interview materials, including both theoretical questions and practical coding exercises. It is used by interviewers to assess candidates on HTML, CSS, JavaScript, React, TypeScript, and related frontend technologies.

**Confidentiality:** This repository contains proprietary interview materials and should not be shared externally or with candidates.

## Repository Structure

### Theoretical Questions (Root Level)
Markdown files containing curated interview questions with sources:
- `common.md` - Core frontend questions (HTML/CSS, JavaScript, React, TypeScript, Performance)
- `accessibility-questions.md` - Accessibility and WCAG topics
- `security-question.md` - Frontend security best practices
- `devops-question.md` - CI/CD, deployment, and DevOps workflows
- `seo-question.md` - SEO and web optimization

### Practical Exercises (Subdirectories)
Organized by technology category:
- `react-js/` - React and Next.js exercises
- `vanilla-js/` - Pure JavaScript challenges
- `html/` - HTML-specific exercises
- `css/` - CSS layout and styling challenges

## Exercise Naming Convention

Exercises follow a consistent pattern:
- **`test-xxx`** - Broken/incomplete version with a bug or missing feature (given to candidates)
- **`test-xxx-fixed`** - Corrected implementation (reference solution)

Example: `test-char-count-react` (has bug) → `test-char-count-react-fixed` (solution)

## Working with React Exercises

React exercises are Next.js 16 projects with React 19, TypeScript, and Tailwind CSS.

### Running a React Exercise

```bash
cd react-js/test-xxx
npm install        # Install dependencies (first time only)
npm run dev        # Start dev server at http://localhost:3000
```

### Common Commands
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Typical Workflow
1. Read the exercise's README.md for requirements
2. Run `npm run dev` to see the current behavior
3. Identify the bug or missing feature
4. If stuck, compare with the corresponding `-fixed` version

## Working with HTML/CSS/Vanilla JS Exercises

These exercises use plain HTML files with inline or linked CSS/JavaScript.

### Running HTML/CSS/Vanilla JS Exercises

Simply open the `index.html` file in a browser:
```bash
# Open in default browser (Windows)
start html/test-xxx/index.html

# Or use a local server
npx serve html/test-xxx
```

## Exercise Focus Areas

Each exercise tests specific frontend concepts:

### React Exercises
- **Lifecycle & Hooks**: `test-char-count-react` (infinite re-render bug), `test-use-hook-react`
- **Component Patterns**: `test-declare-function`, `react-form-submit`
- **State Management**: `text-use-prop-in-state`
- **useEffect**: `test-react-use-effect`

### Vanilla JS Exercises
- **Event Handling**: `test-script-form-submit-event`, `test-script-custom-event`
- **Performance**: `test-script-debounce`
- **Scope**: `test-script-scope-variable`
- **DOM Manipulation**: `test-scroll-parallax`

### CSS Exercises
- **Layout**: `test-css-flex` (Flexbox), `test-css-flex-fixed`
- **Selectors**: `test-css-selector`

### HTML Exercises
- **Script Loading**: `test-html-async-for-script-tag`, `test-html-order-load-script`

## Key Architecture Patterns

### React Project Structure (Next.js)
React exercises use Next.js App Router conventions:
- TypeScript for type safety
- Tailwind CSS for styling (using @tailwindcss/postcss v4)
- Component-based architecture
- React 19 features (Server Components, new hooks)

### Testing Philosophy
Exercises are designed to reveal understanding through observable bugs:
- Run the app to see unexpected behavior
- Identify why the bug occurs (lifecycle, scope, async, etc.)
- Fix demonstrates conceptual understanding, not just syntax

## Adding New Exercises

1. Choose the appropriate category folder (`react-js/`, `vanilla-js/`, `html/`, `css/`)
2. Create folder with naming pattern `test-xxx` (broken version)
3. Add a README.md with:
   - Getting Started instructions
   - Observable behavior
   - Requirement to fix
   - Concept being tested
4. Create corresponding `test-xxx-fixed` folder with solution
5. For React: use consistent dependencies (Next.js 16, React 19, TypeScript, Tailwind v4)

## Note on SECURITY.md

The current `SECURITY.md` file contains boilerplate Electron security information and is not relevant to this interview materials repository. It should be replaced with appropriate security guidelines for this project or removed.
