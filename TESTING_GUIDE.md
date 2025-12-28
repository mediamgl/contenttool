# ContentFlow - Quick Testing Guide

## 🎯 Test Scenarios

### Scenario 1: Complete User Journey
1. Start at `/` (Dashboard)
2. Navigate to `/login`
3. Try login (any email/password works in mock)
4. Verify redirect to dashboard
5. Explore sidebar navigation
6. Visit each main section

### Scenario 2: Content Creation Flow
1. Go to `/ideas`
2. Enter business description
3. Click "Generate Ideas"
4. Browse generated ideas
5. Click to save an idea
6. Go to `/builder`
7. Select a topic
8. Complete the 3-step wizard
9. Review generated outline
10. Confirm and save

### Scenario 3: Rich Text Editing
1. Navigate to `/editor`
2. Enter a title
3. Write some content
4. Try formatting buttons (Bold, Italic, Heading, List, Link)
5. Switch between Write/Preview/Split modes
6. Click AI button to expand content
7. Click Save
8. Check `/library` to confirm content was saved

### Scenario 4: Content Management
1. Go to `/library`
2. View all content in list
3. Use search to filter content
4. Try different sort options
5. Filter by status
6. Click edit button (icon only in prototype)
7. Click delete button

### Scenario 5: Analytics Deep Dive
1. Navigate to `/analytics`
2. Switch between time ranges (7d, 30d, 90d, 1y)
3. Review metric cards (Views, Engagement, Shares, Comments)
4. View platform breakdown
5. Check audience insights charts
6. Download report (button only)

### Scenario 6: Content Analysis
1. Go to `/analysis`
2. Paste sample content
3. Click "Analyze Content"
4. Wait for analysis to complete (simulated 1.5s)
5. Review all scores (SEO, Readability, Originality, Tone)
6. Read optimization suggestions
7. Review key metrics
8. Check tone analysis and alternatives

### Scenario 7: Admin Features
1. Navigate to `/admin`
2. Review system overview stats
3. Check user management table
4. View system health indicators
5. Review recent activity log
6. All data is mocked

### Scenario 8: Settings & Preferences
1. Go to `/settings`
2. Test Profile tab (update name, email, etc.)
3. Test API Keys tab (add/remove keys)
4. Test Preferences tab (change defaults)
5. Verify settings persist on refresh

### Scenario 9: Publisher Integration
1. Go to `/publisher`
2. View all platforms (Medium, Twitter, LinkedIn, BlueSky, Substack)
3. Click "Connect" on a platform
4. Verify status changes to "Connected"
5. Click "Disconnect" to toggle
6. Check recent posts section (empty state)

### Scenario 10: Knowledge Base
1. Navigate to `/knowledge-base`
2. See empty state with upload button
3. Click upload button (shows toast message)
4. (Feature placeholder in prototype)

## 🔍 Component-Level Tests

### Buttons
- [ ] Primary button (blue)
- [ ] Secondary button (gray)
- [ ] Ghost button (transparent)
- [ ] Danger button (red)
- [ ] Disabled state
- [ ] Loading state with spinner
- [ ] Different sizes (sm, md, lg)

### Cards
- [ ] Default variant
- [ ] Interactive variant (hover effect)
- [ ] Elevated variant (shadow)
- [ ] Compact variant
- [ ] With header and title

### Input Components
- [ ] Text input
- [ ] Textarea
- [ ] Select dropdown
- [ ] Error states (red border)
- [ ] Labels
- [ ] Icons in inputs

### Modals
- [ ] Modal opens and closes
- [ ] Modal title displays
- [ ] Close button works
- [ ] Content renders inside
- [ ] Different sizes (sm, md, lg)

### Badges
- [ ] Success badge (green)
- [ ] Danger badge (red)
- [ ] Warning badge (yellow)
- [ ] Info badge (blue)
- [ ] Primary badge (indigo)

### Toast Notifications
- [ ] Success toast (green)
- [ ] Error toast (red)
- [ ] Warning toast (yellow)
- [ ] Info toast (blue)
- [ ] Toast auto-dismisses
- [ ] Multiple toasts stack

## 📱 Responsive Testing

### Mobile (< 640px)
- [ ] Sidebar becomes overlay menu
- [ ] Hamburger menu appears
- [ ] Navigation adapts
- [ ] Typography scales down
- [ ] Cards stack vertically
- [ ] Tables become stacked cards
- [ ] Buttons scale down

### Tablet (640px - 1024px)
- [ ] Sidebar visible
- [ ] Two-column layouts work
- [ ] Content readable
- [ ] Touch targets adequate
- [ ] No horizontal scroll

### Desktop (> 1024px)
- [ ] Three-column layouts render
- [ ] All features visible
- [ ] Hover states work
- [ ] Full charts render

## ⚡ Performance Checks

- [ ] Page loads quickly
- [ ] No console errors
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] Mock API delays (500-2000ms)
- [ ] State updates smoothly

## 🎨 Visual Consistency

- [ ] Colors match design system
- [ ] Spacing is consistent (multiples of 0.25rem)
- [ ] Typography hierarchy clear
- [ ] Shadows consistent
- [ ] Border radius consistent
- [ ] Icons properly sized
- [ ] Icons from same set (Lucide)

## 🔐 Edge Cases

- [ ] Empty states display correctly
- [ ] Loading states show
- [ ] Error states handled
- [ ] Very long text wraps properly
- [ ] Large datasets paginate/truncate
- [ ] Disabled buttons are unclickable
- [ ] Required fields validated
- [ ] Special characters handled

## 📋 Accessibility Checks

- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Focus states visible
- [ ] Color not sole differentiator
- [ ] Form labels associated with inputs
- [ ] Error messages descriptive
- [ ] Images have alt text
- [ ] Modals trap focus
- [ ] Contrast ratios adequate (WCAG AA)

## 🐛 Known Issues to Check

- [ ] Import paths use absolute paths (`/src/...`) - works in Sandpack
- [ ] Mock API has artificial delays - intentional
- [ ] No real backend - all data is mock
- [ ] Some features are UI-only (placeholders)
- [ ] No actual OAuth/social media integration
- [ ] No real file uploads

## ✅ Sign-Off Checklist

- [ ] All 14 pages load
- [ ] Navigation works throughout
- [ ] All main flows complete
- [ ] Responsive design works
- [ ] No console errors
- [ ] Design system consistent
- [ ] All UI components work
- [ ] State management works
- [ ] Toast notifications work
- [ ] Modals work
- [ ] Forms validate
- [ ] Mock data displays
- [ ] Analytics displays
- [ ] Admin features accessible
- [ ] Performance acceptable

## 🚀 Testing Commands

### Check for Build Errors
```bash
npm run build
```

### Check for Type Errors
```bash
npx tsc --noEmit
```

### Check Imports
Look for any files with broken imports in console

### Manual Testing Workflow
1. Clear browser cache
2. Full page refresh (Cmd+Shift+R / Ctrl+Shift+R)
3. Visit each route
4. Try main user flows
5. Check browser console for errors
6. Test on multiple browsers if possible

## 📝 Test Results Template

```
Test Date: ___________
Tester: ___________
Browser: ___________
OS: ___________

✅ Passed: ___/___
❌ Failed: ___/___
⚠️ Issues:

Notes:


Sign-off: ___________
```
