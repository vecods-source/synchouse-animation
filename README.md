# SyncHouse Welcome Animation

A simple welcome animation component for React/Next.js projects. Shows once per user, takes full viewport, and supports dark/light modes.

## Installation

```bash
pnpm add synchouse-welcome-animation
```

Or install from local path:

```bash
pnpm add ../path/to/synchouse-welcome-animation
```

## Requirements

- React 18+
- Tailwind CSS (for styling classes)

## Usage

### Basic Usage

```tsx
import { WelcomeAnimation } from "synchouse-welcome-animation";

function App() {
  return (
    <>
      <WelcomeAnimation />
      {/* Your app content */}
    </>
  );
}
```

### With All Options

```tsx
import { WelcomeAnimation } from "synchouse-welcome-animation";

function App() {
  return (
    <WelcomeAnimation
      mode="dark"
      status="production"
      clientName="MyProject"
      onComplete={() => console.log("Animation finished!")}
    />
  );
}
```

### With Conditional Rendering

```tsx
import { useState, useEffect } from "react";
import {
  WelcomeAnimation,
  shouldShowWelcomeAnimation
} from "synchouse-welcome-animation";

function App() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const shouldShow = shouldShowWelcomeAnimation("MyProject");
    if (shouldShow) {
      setShowWelcome(true);
    }
  }, []);

  return (
    <>
      {showWelcome && (
        <WelcomeAnimation
          clientName="MyProject"
          onComplete={() => setShowWelcome(false)}
        />
      )}
      <main>{/* Your app content */}</main>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"dark"` \| `"light"` | `"dark"` | Color scheme |
| `status` | `"production"` \| `"maintenance"` \| `"development"` | `"production"` | Message displayed above brand |
| `clientName` | `string` | `"client"` | Used for localStorage key (unique per project) |
| `onComplete` | `() => void` | - | Callback when animation finishes |

## Status Messages

| Status | Message Displayed |
|--------|-------------------|
| `production` | "Created by" |
| `maintenance` | "Maintained by" |
| `development` | "Under Development by" |

## Color Modes

### Dark Mode (default)
- Black background
- White text
- White icon circle with black icon

### Light Mode
- White background
- Black text
- Black icon circle with white icon

## Utility Functions

```tsx
import {
  shouldShowWelcomeAnimation,
  resetWelcomeAnimation
} from "synchouse-welcome-animation";

// Check if animation should show (returns true/false/null)
const shouldShow = shouldShowWelcomeAnimation("MyProject");

// Reset animation for testing (clears localStorage)
resetWelcomeAnimation("MyProject");
```

## How It Works

1. Component checks localStorage for previous view
2. If not seen before, displays full-screen overlay (100vw x 100vh)
3. User clicks the shield icon to start animation
4. Animation sequence:
   - Shield icon pulses
   - Status message fades in ("Created by", etc.)
   - "SyncHouse" brand name appears
   - Shield transforms to checkmark
   - Overlay fades out
5. Stores flag in localStorage so it won't show again

## Tailwind CSS Setup

Make sure your Tailwind config includes the library in content paths:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/synchouse-welcome-animation/**/*.{js,mjs}",
  ],
  // ...
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build library
pnpm build

# Watch mode
pnpm dev
```

## License

MIT
