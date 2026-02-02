# User Guide

## Installation

```bash
pnpm add synchouse-welcome-animation
```

Or from local path:

```bash
pnpm add ../path/to/synchouse-welcome-animation
```

## Quick Start

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

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"dark"` \| `"light"` | `"dark"` | Color scheme |
| `status` | `"production"` \| `"maintenance"` \| `"development"` | `"production"` | Message type |
| `clientName` | `string` | `"client"` | Unique key for localStorage |
| `onComplete` | `() => void` | - | Called when animation ends |

## Status Options

| Status | Message |
|--------|---------|
| `production` | "Created by" |
| `maintenance` | "Maintained by" |
| `development` | "Under Development by" |

## Examples

### Dark Mode (Production)

```tsx
<WelcomeAnimation
  mode="dark"
  status="production"
  clientName="MyApp"
/>
```

### Light Mode (Maintenance)

```tsx
<WelcomeAnimation
  mode="light"
  status="maintenance"
  clientName="MyApp"
/>
```

### With Callback

```tsx
<WelcomeAnimation
  clientName="MyApp"
  onComplete={() => {
    console.log("Welcome animation finished");
  }}
/>
```

## Utility Functions

```tsx
import {
  shouldShowWelcomeAnimation,
  resetWelcomeAnimation
} from "synchouse-welcome-animation";

// Check if should show
shouldShowWelcomeAnimation("MyApp"); // true | false | null

// Reset for testing
resetWelcomeAnimation("MyApp");
```

## Tailwind Setup

Add to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    // ... your paths
    "./node_modules/synchouse-welcome-animation/**/*.{js,mjs}",
  ],
}
```
