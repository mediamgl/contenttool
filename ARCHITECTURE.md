# ContentFlow - Architecture Overview

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Application                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    App.tsx (Router)                      │  │
│  │  - React Router configuration                           │  │
│  │  - Route definitions (14 routes)                        │  │
│  │  - Auth guard wrapper                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Context Providers (index.tsx)               │  │
│  │  ├─ AuthProvider (Authentication)                       │  │
│  │  ├─ ContentProvider (Content Management)                │  │
│  │  └─ ToastProvider (Notifications)                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  MainLayout Component                    │  │
│  │  ├─ TopNav (Header)                                     │  │
│  │  │  ├─ Logo                                             │  │
│  │  │  ├─ Navigation Links                                 │  │
│  │  │  └─ User Menu (Dropdown)                             │  │
│  │  └─ Sidebar                                             │  │
│  │     ├─ Navigation Items                                 │  │
│  │     └─ Mobile Menu (Responsive)                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Page Components (14 pages)                  │  │
│  │  ├─ Dashboard                                           │  │
│  │  ├─ Login & Register                                    │  │
│  │  ├─ Settings                                            │  │
│  │  ├─ Ideas                                               │  │
│  │  ├─ ContentBuilder (3-step wizard)                      │  │
│  │  ├─ Editor (Rich text)                                  │  │
│  │  ├─ Library (Content management)                        │  │
│  │  ├─ KnowledgeBase                                       │  │
│  │  ├─ Publisher (Multi-platform)                          │  │
│  │  ├─ AdminDashboard                                      │  │
│  │  ├─ Analytics                                           │  │
│  │  ├─ ContentAnalysis                                     │  │
│  │  └─ DesignSystemTest                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            UI Component Library (Reusable)               │  │
│  │  ├─ Button (primary, secondary, ghost, danger)          │  │
│  │  ├─ Card (default, interactive, elevated, compact)      │  │
│  │  ├─ Input (text, textarea, select)                      │  │
│  │  ├─ Modal (dialog with sizes)                           │  │
│  │  ├─ Badge (semantic colors)                             │  │
│  │  └─ Toast (notifications)                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Styling System (theme.css)                    │  │
│  │  ├─ CSS Variables (colors, spacing, typography)         │  │
│  │  ├─ Component Classes (.btn, .card, .input)             │  │
│  │  ├─ Utility Classes (Tailwind)                          │  │
│  │  └─ Animations (fadeIn, slideIn, etc.)                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 State Management Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Global State (Context)                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              AuthContext                            │    │
│  │  ├─ user (current user object)                     │    │
│  │  ├─ token (auth token)                             │    │
│  │  ├─ isAuthenticated (boolean)                      │    │
│  │  ├─ preferences (user prefs)                       │    │
│  │  └─ actions:                                       │    │
│  │     ├─ login(email, password)                      │    │
│  │     ├─ register(userData)                          │    │
│  │     ├─ logout()                                    │    │
│  │     ├─ updateProfile(data)                         │    │
│  │     └─ updatePreferences(prefs)                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            ContentContext                           │    │
│  │  ├─ content (array of content items)               │    │
│  │  ├─ ideas (array of ideas)                         │    │
│  │  ├─ outlines (array of outlines)                   │    │
│  │  └─ actions:                                       │    │
│  │     ├─ addContent(item)                            │    │
│  │     ├─ updateContent(id, data)                     │    │
│  │     ├─ deleteContent(id)                           │    │
│  │     ├─ saveIdea(idea)                              │    │
│  │     ├─ deleteIdea(id)                              │    │
│  │     └─ getSavedIdeas()                             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            ToastContext                             │    │
│  │  ├─ toasts (array of toast notifications)          │    │
│  │  └─ actions:                                       │    │
│  │     ├─ addToast(message, type)                     │    │
│  │     └─ removeToast(id)                             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────┐
        │     localStorage (Persistence)   │
        │  ├─ user                        │
        │  ├─ content                     │
        │  └─ preferences                 │
        └──────────────────────────────────┘
```

## 📡 API Layer Architecture

```
┌──────────────────────────────────────────────────────────┐
│              API Service Layer (api.ts)                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │          Authentication API                       │  │
│  │  • authAPI.login()                               │  │
│  │  • authAPI.register()                            │  │
│  │  • authAPI.logout()                              │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Content Management API                    │  │
│  │  • contentAPI.getContentList()                   │  │
│  │  • contentAPI.createContent()                    │  │
│  │  • contentAPI.updateContent()                    │  │
│  │  • contentAPI.deleteContent()                    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │             Ideas API                             │  │
│  │  • ideasAPI.generateIdeas()                      │  │
│  │  • ideasAPI.saveIdea()                           │  │
│  │  • ideasAPI.getSavedIdeas()                      │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Content Builder API                     │  │
│  │  • builderAPI.generateHooks()                    │  │
│  │  • builderAPI.generateOutline()                  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │              AI Features API                      │  │
│  │  • aiAPI.expandText()                            │  │
│  │  • aiAPI.condenseText()                          │  │
│  │  • aiAPI.improveText()                           │  │
│  │  • aiAPI.rephraseText()                          │  │
│  │  • aiAPI.analyzeText()                           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │            Publishing API                         │  │
│  │  • publishingAPI.getPlatforms()                  │  │
│  │  • publishingAPI.publishContent()                │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │             Admin API                             │  │
│  │  • adminAPI.getStats()                           │  │
│  │  • adminAPI.getUserList()                        │  │
│  │  • adminAPI.getActivityLog()                     │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│         All APIs simulated with 500-2000ms delays       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## 📊 Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
}
```

### Content Model
```typescript
interface Content {
  id: string;
  userId: string;
  title: string;
  content: string;
  contentType: 'blog' | 'social' | 'script' | 'outline' | 'thread';
  status: 'draft' | 'ready' | 'published';
  wordCount: number;
  characterCount: number;
  tags: string[];
  targetPlatform?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
```

### Idea Model
```typescript
interface Idea {
  id: string;
  userId: string;
  title: string;
  description: string;
  category?: string;
  tags: string[];
  savedAt: string;
  contentTypes: string[];
}
```

## 🎯 Component Hierarchy

```
App
├── AuthProvider
│   ├── ContentProvider
│   │   └── ToastProvider
│   │       └── Router
│   │           ├── Route: Dashboard
│   │           │   └── MainLayout
│   │           │       ├── TopNav
│   │           │       ├── Sidebar
│   │           │       └── Dashboard Page
│   │           │           ├── Card
│   │           │           ├── Button
│   │           │           └── StatCards
│   │           │
│   │           ├── Route: Login
│   │           │   └── Login Page
│   │           │       ├── Input
│   │           │       └── Button
│   │           │
│   │           ├── Route: Editor
│   │           │   └── MainLayout
│   │           │       └── Editor Page
│   │           │           ├── Input (title)
│   │           │           ├── Textarea
│   │           │           ├── Button (formatting)
│   │           │           ├── Modal (export)
│   │           │           └── Toast (notifications)
│   │           │
│   │           └── ... (11 more pages)
│   │
│   └── Toast Notifications (Portal)
│       └── Toast Items
```

## 🔌 Component Props Flow

```
App (Router)
  ↓
Page Component
  ↓
Receives: useAuth(), useContent(), useToast()
  ↓
Uses: UI Components (Button, Card, Input, etc.)
  ↓
Calls: API functions (via Context)
  ↓
Updates: State (Context)
  ↓
Re-renders: Page and Components
  ↓
Persists: localStorage
```

## 📱 Responsive Architecture

```
Mobile (< 640px)
├── TopNav (sticky)
├── Hamburger Menu (overlay)
│   ├── Sidebar (mobile)
│   └── Navigation Items
└── Main Content (single column, full width)
    ├── Cards (stacked)
    ├── Inputs (full width)
    └── Buttons (full width)

Tablet (640px - 1024px)
├── TopNav (sticky)
├── Sidebar (collapsed or visible)
└── Main Content (2-column layout)
    ├── Cards (2-col grid)
    ├── Inputs (wider)
    └── Buttons (normal)

Desktop (> 1024px)
├── TopNav (sticky)
├── Sidebar (fixed, visible)
└── Main Content (3+ column layout)
    ├── Cards (3+ col grid)
    ├── Complex layouts
    └── Full UI experience
```

## 🎨 Styling Architecture

```
theme.css
├── CSS Variables
│   ├── Colors (primary, secondary, accent, semantic)
│   ├── Spacing (xs, sm, md, lg, xl, 2xl, 3xl)
│   ├── Typography (font sizes, weights)
│   ├── Shadows (xs, sm, md, lg, xl, 2xl)
│   └── Border Radius (xs, sm, md, lg, full)
├── Component Classes
│   ├── .btn (Button base)
│   ├── .card (Card base)
│   ├── .input (Input base)
│   ├── .badge (Badge base)
│   └── .alert (Alert base)
├── Utilities (Tailwind)
│   ├── Spacing (p, m, gap)
│   ├── Layout (grid, flex)
│   ├── Typography (text sizes)
│   └── Effects (shadows, opacity)
└── Animations
    ├── fadeIn
    ├── slideIn
    ├── scaleIn
    └── pulse
```

## 🚀 Performance Considerations

```
Optimization Strategies
├── Code Splitting
│   └── React Router lazy loading ready
├── Component Memoization
│   └── useMemo, useCallback where needed
├── State Management
│   └── Context API (local state management)
├── CSS Optimization
│   └── CSS Variables for theming
├── Bundle Size
│   └── Minimal dependencies
└── Network
    └── Mock API (no network bottleneck)
```

## 🔐 Security Architecture

```
Security Considerations
├── Authentication
│   ├── Token-based (mock)
│   ├── localStorage storage
│   └── Session management
├── Authorization
│   ├── Role-based access (mock)
│   └── Route guards
├── Input Validation
│   ├── Form validation
│   └── Data sanitization
└── HTTPS Ready
    └── Environment variables for API keys
```

## 📈 Scalability Considerations

```
Current Architecture
├── Local State (Context)
│   └── Fine for current scale
├── localStorage (Persistence)
│   └── Limited to device storage
└── Mock API (Development)
    └── No backend scaling concerns

Production Ready Path
├── Replace with Real Backend API
│   └── Add authentication server
├── Replace localStorage with Database
│   └── Add persistence layer
├── Add Caching Strategy
│   └── Redis or similar
└── Add Load Balancing
    └── Horizontal scaling
```

## 📚 File Organization

```
src/
├── pages/                  (14 page components)
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Settings.tsx
│   ├── Ideas.tsx
│   ├── ContentBuilder.tsx
│   ├── Editor.tsx
│   ├── Library.tsx
│   ├── KnowledgeBase.tsx
│   ├── Publisher.tsx
│   ├── AdminDashboard.tsx
│   ├── Analytics.tsx
│   ├── ContentAnalysis.tsx
│   └── DesignSystemTest.tsx
├── components/
│   ├── ui/                (6 reusable UI components)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   └── Toast.tsx
│   ├── layout/            (Layout components)
│   │   ├── MainLayout.tsx
│   │   ├── TopNav.tsx
│   │   └── Sidebar.tsx
│   └── ComponentPreview.tsx
├── context/               (State management)
│   ├── AuthContext.tsx
│   └── ContentContext.tsx
├── services/              (API layer)
│   └── api.ts
├── theme.css              (Design system)
├── App.tsx                (Router)
└── index.tsx              (Entry point)
```

## 🔄 Request/Response Flow

```
User Action
    ↓
Component Handler
    ↓
API Call
    ↓
Simulated Delay (500-2000ms)
    ↓
Mock Response
    ↓
Context Update
    ↓
localStorage Update
    ↓
Component Re-render
    ↓
UI Update
```

---

This architecture is designed to be:
- **Scalable**: Easy to add new pages and features
- **Maintainable**: Clear separation of concerns
- **Reusable**: Component library for consistency
- **Testable**: Each component can be tested independently
- **Responsive**: Works on all screen sizes
- **Accessible**: Semantic HTML and ARIA attributes

For questions, refer to the main README.md or specific page implementations.
