# SyncHouse Welcome Animation Template

A reusable welcome/intro animation component for React projects with configurable branding and promotional features.

## Features

- Shield icon with animated pulse rings
- "Protected by SyncHouse" branding reveal
- **Feature badges** (Free period, Maintenance Included, Support level)
- **Multi-language support** (English & Arabic with RTL)
- Smooth phase-based transitions
- Synthesized intro sound using Web Audio API
- localStorage persistence (shows only once per user)
- Click-to-start interaction
- Fully configurable via template variables

## Dependencies

- React 18+
- lucide-react (for Shield and Check icons)
- Tailwind CSS

## Quick Start

1. Copy `WelcomeAnimation.tsx` to your project's components folder
2. Edit the `TEMPLATE_VARS` object at the top of the file:

```typescript
// =============================================================================
// TEMPLATE VARIABLES - Change these per project/client
// =============================================================================
const TEMPLATE_VARS = {
  // Client/Project name (used for localStorage key)
  clientName: "CLIENT_NAME",

  // Language: "en" (English) or "ar" (Arabic with RTL)
  language: "en",

  // Project status - changes the tagline text
  // Options: "production" | "development" | "warranty" | "maintenance" | "custom"
  status: "production",

  // Custom tagline (only used when status is "custom")
  customTagline: {
    en: "Protected by",
    ar: "محمي بواسطة",
  },

  // Maintenance configuration
  maintenance: {
    isFree: true,
    period: {
      en: "3 Months",
      ar: "3 أشهر",
    },
    price: "500 QAR",
    features: [...],
  },

  supportLevel: "24/7",
};
```

The `CONFIG` object below will automatically use these variables.

## Language Support (EN/AR)

Set `language` to switch between English and Arabic:

```typescript
language: "en",  // English (LTR)
language: "ar",  // Arabic (RTL)
```

**Arabic mode automatically:**
- Applies RTL direction
- Translates all UI text
- Reverses gradient direction

| Text | English | Arabic |
|------|---------|--------|
| Click to enter | "Click to enter" | "انقر للدخول" |
| Subtitle | "Your trusted technology partner" | "شريكك التقني الموثوق" |
| Free | "Free 3 Months" | "مجاناً 3 أشهر" |
| Worth | "Worth 500 QAR" | "بقيمة 500 QAR" |
| Support | "24/7 Support" | "دعم 24/7" |

## Project Status (Tagline)

The `status` field changes the tagline above "SyncHouse":

| Status | English | Arabic |
|--------|---------|--------|
| `production` | "Protected by" | "محمي بواسطة" |
| `development` | "Under Development by" | "قيد التطوير بواسطة" |
| `warranty` | "Under Warranty by" | "تحت الضمان من" |
| `maintenance` | "Maintenance Plan by" | "خطة الصيانة من" |
| `custom` | Uses `customTagline.en` | Uses `customTagline.ar` |

## Maintenance Period

If `maintenance.period` is set to `""` or `"0"`, **no feature badges will be shown** - only the tagline and brand name appear.

## Free vs Paid Maintenance

When `maintenance.period` has a value, badges are displayed based on `maintenance.isFree`:

**When `isFree: true`:**
- Shows: `Free 3 Months` (highlighted) + `Worth 500 QAR` + `24/7 Support`

**When `isFree: false`:**
- Shows: `Maintenance Included` + `24/7 Support` (no price shown)

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
