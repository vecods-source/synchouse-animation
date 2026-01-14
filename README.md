# SyncHouse Welcome Animation Template

A reusable welcome/intro animation component for React projects with configurable branding and promotional features.

## Features

- Shield icon with animated pulse rings
- "Protected by SyncHouse" branding reveal
- **Feature badges** (Free 3 Months, Maintenance Included, 24/7 Support)
- Smooth phase-based transitions
- Synthesized intro sound using Web Audio API
- localStorage persistence (shows only once per user)
- Click-to-start interaction
- Fully configurable via props or CONFIG object

## Dependencies

- React 18+
- lucide-react (for Shield and Check icons)
- Tailwind CSS

## Quick Start

1. Copy `WelcomeAnimation.tsx` to your project's components folder
2. Edit the `CONFIG` object at the top of the file to customize:

```typescript
const CONFIG = {
  storageKey: "your_project_welcome_shown",  // Unique per project
  brandName: "SyncHouse",
  tagline: "Protected by",
  subtitle: "Your trusted technology partner",
  features: [
    { text: "Free 3 Months", highlight: true },
    { text: "Maintenance Included", highlight: false },
    { text: "24/7 Support", highlight: false },
  ],
  soundEnabled: true,
};
```

## Usage

```tsx
import { WelcomeAnimation, shouldShowWelcomeAnimation } from "./WelcomeAnimation";

function App() {
  const [showWelcome, setShowWelcome] = useState(() => shouldShowWelcomeAnimation());

  return (
    <>
      {showWelcome && (
        <WelcomeAnimation onComplete={() => setShowWelcome(false)} />
      )}
      {/* Your app content */}
    </>
  );
}
```

## Props (Optional Overrides)

You can also override CONFIG values via props:

```tsx
<WelcomeAnimation
  brandName="YourBrand"
  tagline="Powered by"
  subtitle="Custom tagline here"
  features={[
    { text: "Feature 1", highlight: true },
    { text: "Feature 2", highlight: false },
  ]}
  onComplete={() => setShowWelcome(false)}
/>
```

## Utility Functions

```tsx
// Check if animation should show
shouldShowWelcomeAnimation(); // returns true/false/null

// Reset animation (for testing)
resetWelcomeAnimation();
```

## Customization

- **Colors**: Modify `bg-primary` and related Tailwind classes
- **Timing**: Adjust values in `CONFIG.timing`
- **Sound**: Set `CONFIG.soundEnabled = false` to disable
- **Features**: Add/remove items from `CONFIG.features` array
  - Set `highlight: true` for primary-colored badges
