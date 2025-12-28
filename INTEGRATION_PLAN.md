# ContentFlow - Frontend-Backend Integration Plan

## Current State Analysis

The application has **ALL backend infrastructure in place** (database, Edge Functions, services), but the **frontend UI is still using mock data and disconnected buttons**. Here's what needs to be connected:

---

## 🔴 CRITICAL ISSUES TO FIX

### 1. Ideas Page (`/ideas`)
**File:** `src/pages/Ideas.tsx`

#### What's Wrong:
- Line 59: Uses `ideasAPI.generateIdeas()` which returns MOCK data
- Line 197: "Use Idea" button does nothing
- Line 247: "Start Writing" button does nothing
- Line 72: Hardcodes `userId: '1'` instead of using real user

#### What Needs to Happen:
- ✅ Replace `ideasAPI.generateIdeas()` with `aiService.generateIdeas()`
- ✅ Make "Use Idea" button navigate to `/builder?ideaId={id}` with idea pre-filled
- ✅ Make "Start Writing" button navigate to `/editor?ideaId={id}` with idea context
- ✅ Use `user.id` from `useAuth()` instead of hardcoded '1'
- ✅ Call `addIdea()` which already connects to Supabase

**Impact:** HIGH - Core feature not working

---

### 2. Content Builder (`/builder`)
**File:** `src/pages/ContentBuilder.tsx`

#### What's Wrong:
- Line 55: Uses `builderAPI.generateHooks()` which returns MOCK hooks
- Line 78: Uses `builderAPI.generateOutline()` which returns MOCK outlines
- Line 107: Hardcodes `userId: '1'` instead of using real user
- Line 382: "Start Writing" button navigates to `/editor` but doesn't pass outline data

#### What Needs to Happen:
- ✅ Replace `builderAPI.generateHooks()` with `aiService.generateHooks()`
- ✅ Replace `builderAPI.generateOutline()` with `aiService.generateOutline()`
- ✅ Use `user.id` from `useAuth()`
- ✅ Pass outline ID to editor: `/editor?outlineId={outlineId}`
- ✅ `addOutline()` already works with Supabase

**Impact:** HIGH - Core feature not working

---

### 3. Editor (`/editor`)
**File:** `src/pages/Editor.tsx`

#### What's Wrong:
- Line 127-152: AI actions (expand, condense, improve, rephrase) just add mock text
- Line 79: Hardcodes `userId: '1'`
- No way to load existing content or outlines
- No URL parameter handling for `outlineId` or `ideaId`

#### What Needs to Happen:
- ✅ Replace mock AI actions with real `aiService` calls:
  - `handleAiAction('expand')` → `aiService.expandText(selectedText)`
  - `handleAiAction('condense')` → `aiService.condenseText(selectedText)`
  - `handleAiAction('improve')` → `aiService.improveText(selectedText)`
  - `handleAiAction('rephrase')` → `aiService.rephraseText(selectedText)`
- ✅ Add URL parameter handling:
  - `?outlineId={id}` → Load outline and pre-fill editor
  - `?ideaId={id}` → Load idea and pre-fill title
  - `?contentId={id}` → Load existing content for editing
- ✅ Use `user.id` from `useAuth()`
- ✅ `addContent()` already works with Supabase

**Impact:** HIGH - Core feature not working

---

### 4. Library (`/library`)
**File:** `src/pages/Library.tsx`

#### What's Wrong:
- Line 116: "New Content" button doesn't navigate
- Line 212-216: Edit button doesn't do anything
- Line 218-222: Share button doesn't do anything
- Delete works but has no confirmation dialog

#### What Needs to Happen:
- ✅ "New Content" → Navigate to `/editor`
- ✅ Edit button → Navigate to `/editor?contentId={item.id}`
- ✅ Share button → Navigate to `/publisher?contentId={item.id}`
- ✅ Add confirmation modal for delete
- ✅ `deleteContent()` already works with Supabase

**Impact:** MEDIUM - Navigation broken

---

### 5. Content Analysis (`/analysis`)
**File:** `src/pages/ContentAnalysis.tsx`

#### What's Wrong:
- Line 54-92: Uses completely mock analysis results
- Doesn't call any real AI service

#### What Needs to Happen:
- ✅ Replace mock analysis with `aiService.analyzeContent(content, title)`
- ✅ Map response to UI format
- ✅ Add error handling for API failures

**Impact:** MEDIUM - Feature not functional

---

### 6. Publisher (`/publisher`)
**File:** `src/pages/Publisher.tsx`

#### What's Wrong:
- Line 30-38: Connect/Disconnect just toggles local state
- No integration with `publishingService`
- No way to select content to publish
- No publishing history displayed
- No actual OAuth flow

#### What Needs to Happen:
- ✅ Replace local state toggle with `publishingService.connectPlatform()`
- ✅ Add content selection UI (dropdown or list)
- ✅ Add "Publish Now" button that calls `publishingService.publishContent()`
- ✅ Load and display publishing connections with `publishingService.getConnections()`
- ✅ Load and display published content with `publishingService.getPublishedContent()`
- ✅ Handle URL parameter `?contentId={id}` to pre-select content

**Impact:** HIGH - Feature completely non-functional

---

### 7. Knowledge Base (`/knowledge-base`)
**File:** `src/pages/KnowledgeBase.tsx`

#### What's Wrong:
- Line 20: Documents array is hardcoded empty `[]`
- Line 44-49: Upload button just shows toast "coming soon"
- No file upload UI
- No document list
- No integration with `storageService`

#### What Needs to Happen:
- ✅ Load documents on mount with `storageService.getDocuments()`
- ✅ Add file upload UI with drag-and-drop
- ✅ Call `storageService.uploadDocument()` on file select
- ✅ Display uploaded documents in list
- ✅ Add download functionality with `storageService.downloadDocument()`
- ✅ Add delete with `storageService.deleteDocument()`

**Impact:** HIGH - Feature completely non-functional

---

### 8. Mock API Service (`src/services/api.ts`)
**File:** `src/services/api.ts`

#### What's Wrong:
- Entire file is mock implementations
- Being imported in pages instead of real services

#### What Needs to Happen:
- ✅ DELETE this file entirely
- ✅ Replace all imports from `api.ts` with real services:
  - `ideasAPI` → `aiService`
  - `builderAPI` → `aiService`
  - `aiAPI` → `aiService`
  - `publishingAPI` → `publishingService`

**Impact:** CRITICAL - Blocking all AI features

---

## 📋 DETAILED IMPLEMENTATION CHECKLIST

### Phase 1: Remove Mock API & Wire Up AI Features (CRITICAL)

#### 1.1 Delete Mock API
- [ ] Delete `src/services/api.ts`
- [ ] Fix all import errors across the app

#### 1.2 Fix Ideas Page
- [ ] Import `aiService` and `useAuth`
- [ ] Get real user ID from `useAuth()`
- [ ] Replace `ideasAPI.generateIdeas()` with `aiService.generateIdeas()`
- [ ] Add error handling for AI failures
- [ ] Make "Use Idea" button navigate to builder with query param
- [ ] Make "Start Writing" button navigate to editor with idea data
- [ ] Ensure `addIdea()` saves to Supabase (already works)

#### 1.3 Fix Content Builder
- [ ] Import `aiService` and `useAuth`
- [ ] Get real user ID from `useAuth()`
- [ ] Replace `builderAPI.generateHooks()` with `aiService.generateHooks()`
- [ ] Replace `builderAPI.generateOutline()` with `aiService.generateOutline()`
- [ ] Add error handling
- [ ] Handle URL parameter `?ideaId={id}` to pre-fill topic
- [ ] Pass `outlineId` to editor when navigating
- [ ] Ensure `addOutline()` saves to Supabase (already works)

#### 1.4 Fix Editor
- [ ] Import `aiService` and `useAuth`
- [ ] Get real user ID from `useAuth()`
- [ ] Add text selection detection
- [ ] Wire up AI expand: `aiService.expandText(selectedText)`
- [ ] Wire up AI condense: `aiService.condenseText(selectedText)`
- [ ] Wire up AI improve: `aiService.improveText(selectedText)`
- [ ] Wire up AI rephrase: `aiService.rephraseText(selectedText)`
- [ ] Handle URL params:
  - `?outlineId={id}` → Load outline and pre-fill
  - `?ideaId={id}` → Load idea and pre-fill
  - `?contentId={id}` → Load existing content
- [ ] Ensure `addContent()` and `updateContent()` work with Supabase (already do)

#### 1.5 Fix Content Analysis
- [ ] Import `aiService`
- [ ] Replace mock analysis with `aiService.analyzeContent(content)`
- [ ] Map API response to UI structure
- [ ] Add loading states
- [ ] Add error handling

---

### Phase 2: Wire Up Publishing Features

#### 2.1 Fix Publisher Page
- [ ] Import `publishingService` and `useAuth`
- [ ] Load connections on mount: `publishingService.getConnections()`
- [ ] Display real connection status from database
- [ ] Replace connect/disconnect handlers with real service calls
- [ ] Add content selection UI
  - Load user's content from `useContent()`
  - Add dropdown or modal to select content
- [ ] Add "Publish Now" button
  - Call `publishingService.publishContent(contentId, platforms)`
- [ ] Load and display publishing history
  - Call `publishingService.getPublishedContent()`
  - Show status, platform, URLs, timestamps
- [ ] Handle URL param `?contentId={id}` to pre-select content
- [ ] Add platform OAuth redirect handling (future enhancement)

---

### Phase 3: Wire Up Knowledge Base

#### 3.1 Fix Knowledge Base Page
- [ ] Import `storageService` and `useAuth`
- [ ] Create state for documents list
- [ ] Load documents on mount: `storageService.getDocuments()`
- [ ] Add file input UI
  - Create file picker
  - Add drag-and-drop zone
  - Show upload progress
- [ ] Wire up upload: `storageService.uploadDocument(file, title, description, tags)`
- [ ] Display documents in list with:
  - File name, size, date
  - Download button
  - Delete button
- [ ] Wire up download: `storageService.downloadDocument(filePath)`
- [ ] Wire up delete: `storageService.deleteDocument(documentId)`
- [ ] Add confirmation for delete

---

### Phase 4: Navigation & URL Parameters

#### 4.1 Fix Library Page Navigation
- [ ] "New Content" button → Navigate to `/editor`
- [ ] Edit button → Navigate to `/editor?contentId={id}`
- [ ] Share button → Navigate to `/publisher?contentId={id}`
- [ ] Add delete confirmation modal

#### 4.2 Add URL Parameter Handling
- [ ] Editor: Parse `outlineId`, `ideaId`, `contentId` from URL
- [ ] Editor: Load data based on params
- [ ] Builder: Parse `ideaId` from URL
- [ ] Builder: Pre-fill topic if idea provided
- [ ] Publisher: Parse `contentId` from URL
- [ ] Publisher: Pre-select content if provided

---

### Phase 5: User Authentication Integration

#### 5.1 Replace Hardcoded User IDs
- [ ] Ideas page: Use `user.id` from `useAuth()`
- [ ] Builder page: Use `user.id` from `useAuth()`
- [ ] Editor page: Use `user.id` from `useAuth()`
- [ ] All pages: Show loading state while checking auth
- [ ] All pages: Redirect to login if not authenticated

---

### Phase 6: Error Handling & Edge Cases

#### 6.1 Add Error States
- [ ] AI service failures
  - Show error message in toast
  - Allow retry
  - Don't break the UI
- [ ] Network failures
  - Graceful degradation
  - Retry button
- [ ] Database failures
  - Clear error messages
  - Suggest actions

#### 6.2 Add Loading States
- [ ] All API calls show loading spinners
- [ ] Disable buttons during operations
- [ ] Show progress for file uploads
- [ ] Skeleton loaders for lists

#### 6.3 Add Empty States
- [ ] Already mostly done, verify all pages
- [ ] Ensure they guide users to take action

---

## 🎯 PRIORITY ORDER

### Immediate (Do First):
1. **Delete `src/services/api.ts`** - Remove all mock data
2. **Fix Ideas page AI generation** - Core feature
3. **Fix Builder page AI generation** - Core feature
4. **Fix Editor AI operations** - Core feature
5. **Add user authentication integration** - Security critical

### High Priority (Do Second):
6. **Fix Library navigation** - UX blocker
7. **Fix Knowledge Base file uploads** - Core feature
8. **Fix Content Analysis** - Core feature
9. **Wire up URL parameters for data passing** - UX critical

### Medium Priority (Do Third):
10. **Fix Publisher connections & publishing** - Feature completion
11. **Add error handling everywhere** - Production readiness
12. **Add loading states everywhere** - UX polish

---

## 🚨 KEY TECHNICAL NOTES

### Authentication:
```typescript
import { useAuth } from '../context/AuthContext';

const { user, isAuthenticated } = useAuth();

// Use user.id instead of hardcoded '1'
// Check isAuthenticated before operations
```

### AI Service Calls:
```typescript
import { aiService } from '../services/aiService';

const result = await aiService.generateIdeas(
  businessDescription,
  contentTypes,
  count
);

if (result.success) {
  setIdeas(result.data);
} else {
  addToast(result.error || 'Failed', 'error');
}
```

### Navigation with Data:
```typescript
import { useNavigate, useSearchParams } from 'react-router-dom';

// Navigate with query params
navigate(`/editor?outlineId=${outlineId}`);

// Read query params
const [searchParams] = useSearchParams();
const outlineId = searchParams.get('outlineId');
```

### Context Usage:
```typescript
import { useContent } from '../context/ContentContext';

const {
  content,      // Already loads from Supabase
  addContent,   // Already saves to Supabase
  updateContent,// Already updates Supabase
  getContent,   // Get by ID from state
} = useContent();
```

---

## ✅ WHAT ALREADY WORKS

The following are **ALREADY FULLY FUNCTIONAL** and don't need changes:

1. ✅ **Database** - All tables, RLS, triggers working
2. ✅ **Authentication** - Login, Register, Logout working
3. ✅ **Edge Functions** - All 5 AI functions deployed
4. ✅ **Service Layer** - All services (`aiService`, `storageService`, `publishingService`, etc.)
5. ✅ **Context Providers** - `AuthContext` and `ContentContext` fully wired to Supabase
6. ✅ **Data Persistence** - All CRUD operations save to database
7. ✅ **Security** - Input validation and sanitization utilities

**The ONLY issue is that the UI components aren't calling these working services!**

---

## 📊 ESTIMATED WORK

- **Phase 1 (AI Features):** 3-4 hours
- **Phase 2 (Publishing):** 2-3 hours
- **Phase 3 (Knowledge Base):** 2-3 hours
- **Phase 4 (Navigation):** 1-2 hours
- **Phase 5 (Auth Integration):** 1 hour
- **Phase 6 (Polish):** 2-3 hours

**Total: ~12-18 hours of development work**

---

## 🎬 READY TO BUILD?

Once you approve this plan, I will:
1. Delete the mock API file
2. Wire up each page systematically
3. Test each feature as I go
4. Ensure all user flows work end-to-end
5. Run build to verify no errors

**Say "GO" and I'll start implementing this plan step by step!**
