# ShopFlow POS Design Guidelines

## Design Approach
**Hybrid Strategy**: Professional SaaS aesthetic for marketing pages (inspired by Stripe, Linear) + functional design system for application features (Material Design principles).

**Core Philosophy**: Trust-building through clarity, professionalism through restraint, functionality through intuitive patterns.

## Typography System
- **Primary Font**: Inter (Google Fonts CDN) - clean, modern, highly legible
- **Hierarchy**:
  - Hero Headlines: text-5xl md:text-6xl font-bold
  - Section Headers: text-3xl md:text-4xl font-semibold
  - Subsection Headers: text-xl md:text-2xl font-medium
  - Body Text: text-base leading-relaxed
  - Small Text/Labels: text-sm font-medium
- **Letter Spacing**: Tight for headlines (-0.025em), normal for body

## Layout & Spacing System
**Tailwind Units**: Consistently use 4, 6, 8, 12, 16, 20, 24 for spacing
- Section Padding: py-16 md:py-24 (vertical rhythm)
- Container: max-w-7xl mx-auto px-6 md:px-8
- Component Spacing: gap-8 md:gap-12 between major elements
- Card Padding: p-6 md:p-8

## Component Library

**Navigation**
- Sticky header with backdrop-blur effect (bg-white/90 backdrop-blur-md)
- Logo left, links center/right
- Mobile: Hamburger menu with slide-in drawer (transform translate-x-full transition)
- Auth buttons: Primary CTA style when logged out

**Hero Section (Home)**
- Full-width container with centered content
- Headline + subheadline + dual CTAs (Primary "Get Started" + Secondary "Watch Demo")
- Background: Subtle gradient or abstract geometric pattern (not solid)
- Include hero image: Modern dashboard mockup or POS terminal in use (right side on desktop, full-width on mobile)

**Feature Grid**
- 3-column grid (grid-cols-1 md:grid-cols-3 gap-8)
- Each card: Icon (64px, primary color) + Title + Description
- Cards with subtle border (border border-gray-200) and hover lift effect (hover:-translate-y-1 transition)

**Pricing Cards**
- 2-column layout (grid-cols-1 md:grid-cols-2)
- Highlighted Enterprise tier (ring-2 ring-blue-500 shadow-xl)
- Pricing display: Large number (text-5xl) + ₹ symbol + "/month" (text-sm)
- Feature list with checkmarks (green)
- "Inclusive of all taxes" in text-xs text-gray-500
- 14-day trial badge (absolute top-right, bg-green-100 text-green-800)

**Reviews Section**
- Star rating input: Interactive filled/outlined stars (text-3xl cursor-pointer)
- Review cards: White cards with shadow, user icon + rating + comment + date
- Filter tabs: Pill-shaped buttons (rounded-full px-4 py-2)
- Active tab: Primary background with white text

**Admin Panel**
- Data table with alternating row colors (even:bg-gray-50)
- Action buttons: Icon buttons with tooltips
- Dropdown selects: Custom styled (not native)
- Date picker: Modern calendar UI component

**Dashboard**
- Card-based layout showcasing license info
- Status badges: Pill-shaped with color coding (green=active, yellow=trial, red=expired)
- Profile section with avatar placeholder

**Modals**
- Privacy/Terms: Full-screen overlay (fixed inset-0 bg-black/50)
- Content card: max-w-3xl centered, scrollable content
- Close button: top-right (absolute)

## Interaction Patterns
- Button hovers: Subtle scale (hover:scale-105) + brightness shift
- Card hovers: Shadow increase + slight lift
- Form focus: Ring highlight (focus:ring-2 focus:ring-blue-500)
- Page transitions: Fade-in (opacity-0 → opacity-100, duration-300)
- Loading states: Pulse animations on skeleton components

## Accessibility
- Focus indicators on all interactive elements
- ARIA labels for icon-only buttons
- Form labels always visible (no placeholder-only)
- Sufficient contrast ratios (WCAG AA minimum)

## Images
**Hero Image**: Professional photograph or high-quality mockup of ShopFlow dashboard in use (tablet/desktop showing POS interface). Position right side on desktop (50% width), full-width below headline on mobile. Image should convey modern retail environment.

**About Us Section**: Developer profile images linked from provided portfolio sites - circular avatars (w-24 h-24) with subtle shadow.

**Feature Icons**: Use Heroicons (outline style) via CDN for consistency - specifically: ShoppingCartIcon, ChartBarIcon, CubeIcon for the three main features.

## Responsive Breakpoints
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Navigation: Hamburger below md breakpoint
- Grid layouts: Stack to single column below md

## Visual Polish
- Subtle shadows: shadow-sm for cards, shadow-lg for elevated elements
- Rounded corners: rounded-lg for cards, rounded-md for buttons
- Transitions: duration-200 for micro-interactions, duration-300 for page changes
- No distracting animations - focus on purposeful, smooth transitions