# SyncHouse Welcome Animation

A reusable welcome/intro animation component for React projects.

## Features

- Shield icon with animated pulse rings
- "Protected by SyncHouse" branding reveal
- Smooth phase-based transitions
- Synthesized intro sound using Web Audio API
- localStorage persistence (shows only once per user)
- Click-to-start interaction

## Dependencies

- React 18+
- lucide-react (for Shield and Check icons)
- Tailwind CSS

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

## Customization

- Modify colors by changing `bg-primary` and related Tailwind classes
- Adjust timing in the `startAnimation` function
- Customize the sound in the `playIntroSound` function
