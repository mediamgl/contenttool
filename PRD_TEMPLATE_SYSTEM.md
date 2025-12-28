# PRD: Template System - Reduce Friction for Repeat Content

**Feature Name**: Template System - Script Templates, Platform Presets & Brand Kits
**Priority**: HIGH (Phase 2.2)
**Business Impact**: HIGH - 50% faster repeat content creation
**User Value**: Dramatically reduces friction for recurring content formats
**Effort Estimate**: 12% of development time (1-2 weeks)

---

## Executive Summary

The Template System allows users to save successful content structures, platform-specific presets, and brand assets as reusable templates. Users can apply templates with one click to new content, maintaining consistency while drastically reducing creation time for repeat formats.

**Core Value Proposition**: "Create once, reuse forever"

---

## Problem Statement

### Current Pain Points

1. **Repetitive Formatting**: Users recreate the same structure for every episode/post
2. **Brand Inconsistency**: Without templates, brand elements (colors, fonts, logos) vary across content
3. **Slow Onboarding**: New team members don't know content formats/structure
4. **Platform Optimization Friction**: Remembering optimal specs for each platform (aspect ratios, durations, caption lengths)
5. **Decision Fatigue**: Every piece requires decisions on format, structure, branding

### User Stories

**As a podcast host**, I want to:
- Save my episode script structure (intro, segments, outro) as a template
- Apply the template to new episodes without rewriting structure
- Automatically populate episode number, guest name, topic
- Maintain consistent branding across all episodes

**As a content creator**, I need to:
- Store my brand colors, fonts, and logo in one place
- Apply brand kit to all graphics and videos automatically
- Create platform-specific presets (TikTok 9:16, Instagram 4:5, etc.)
- Save successful caption formats for reuse

**As a team manager**, I want to:
- Create templates for my team to ensure consistency
- Onboard new creators with template library
- Track which templates perform best
- Share templates across team members

---

## Success Metrics

### Primary KPIs
- **50% Time Reduction**: Template users create content 50% faster
- **70% Template Adoption**: 70% of active users create at least 1 template
- **3+ Templates per User**: Average user creates 3+ templates
- **80% Template Usage Rate**: 80% of content uses a template

### Secondary KPIs
- **Brand Consistency**: 90% of content matches brand guidelines (measured by color/font usage)
- **Engagement**: Content created from templates has 15% higher engagement (due to consistency)
- **Team Efficiency**: Team accounts save 10+ hours/week using templates
- **Retention**: +15% retention among template users (sticky feature)

---

## Feature Components

### 1. Script Templates

**Purpose**: Save content structure/outline for reuse

**Template Types**:

**Video Script Template**:
```
Template Name: "Weekly Podcast Episode"

Structure:
┌──────────────────────────────────────────────────┐
│ 1. Cold Open (0:00-0:30)                         │
│    {hook} - Attention-grabbing opening           │
│                                                   │
│ 2. Intro Sequence (0:30-1:00)                    │
│    - Welcome message                              │
│    - Introduce topic: {topic}                     │
│    - Guest intro: {guest_name}, {guest_title}     │
│                                                   │
│ 3. Main Content (1:00-25:00)                     │
│    Segment 1: {segment_1_topic}                   │
│    - Key Point 1: {point_1}                       │
│    - Key Point 2: {point_2}                       │
│    - Key Point 3: {point_3}                       │
│                                                   │
│    Segment 2: {segment_2_topic}                   │
│    - Discussion points: {discussion_notes}        │
│                                                   │
│    Segment 3: Q&A / Lightning Round              │
│    - {qa_questions}                               │
│                                                   │
│ 4. Sponsor Message (25:00-26:00)                 │
│    {sponsor_copy}                                 │
│                                                   │
│ 5. Outro (26:00-28:00)                           │
│    - Recap key takeaways                          │
│    - Call to action: {cta}                        │
│    - Next episode teaser: {next_episode}          │
│    - Sign-off                                     │
└──────────────────────────────────────────────────┘

Variables:
- {episode_number} - Auto-increments
- {guest_name} - Manual input
- {guest_title} - Manual input
- {topic} - Manual input
- {segment_1_topic}, {segment_2_topic} - Manual input
- {sponsor_copy} - Optional, saved snippet
- {cta} - Saved snippet with variations

Metadata:
- Duration: 28-30 minutes
- Tone: Conversational, educational
- Target platforms: YouTube, Spotify, Apple Podcasts
```

**Blog Post Template**:
```
Template Name: "How-To Guide"

Structure:
┌──────────────────────────────────────────────────┐
│ Title: How to {action}: {benefit}                │
│ Meta Description: {summary} (150-160 chars)      │
│                                                   │
│ Introduction (100-150 words)                     │
│ - Hook: {problem_statement}                      │
│ - Why it matters: {importance}                   │
│ - What you'll learn: {takeaways}                 │
│                                                   │
│ Section 1: Understanding {concept}               │
│ - Definition                                      │
│ - Why it's important                              │
│ - Common mistakes                                 │
│                                                   │
│ Section 2: Step-by-Step Process                  │
│ - Step 1: {step_1_title}                         │
│   • {step_1_description}                         │
│   • {step_1_tip}                                 │
│ - Step 2: {step_2_title}                         │
│   • {step_2_description}                         │
│   • {step_2_tip}                                 │
│ [... repeat for N steps]                         │
│                                                   │
│ Section 3: Advanced Tips                         │
│ - Tip 1: {advanced_tip_1}                        │
│ - Tip 2: {advanced_tip_2}                        │
│                                                   │
│ Section 4: Common Pitfalls to Avoid              │
│ - Mistake 1: {mistake_1}                         │
│ - How to avoid: {solution_1}                     │
│                                                   │
│ Conclusion (50-100 words)                        │
│ - Recap main points                              │
│ - Final encouragement                             │
│ - Call to action: {cta}                          │
│                                                   │
│ SEO Elements:                                    │
│ - Primary keyword: {keyword}                      │
│ - Secondary keywords: {keyword_2}, {keyword_3}    │
│ - Internal links: {related_post_1}, {related_post_2} │
│ - Featured image: {image_prompt}                  │
└──────────────────────────────────────────────────┘

Variables:
- {action}, {benefit}, {concept} - Manual input
- {keyword}, {keyword_2}, {keyword_3} - Manual input
- {step_N_title}, {step_N_description} - Repeatable
- All other variables - Manual input

Metadata:
- Word count: 1200-1800
- Tone: Professional, helpful
- Target platforms: Blog, Medium, LinkedIn
```

**Social Media Template**:
```
Template Name: "Product Tip Tuesday"

Caption Format:
┌──────────────────────────────────────────────────┐
│ Platform: Instagram                               │
│                                                   │
│ Caption:                                          │
│ 💡 TIP #{tip_number}: {tip_title}                │
│                                                   │
│ {tip_description} (2-3 sentences)                │
│                                                   │
│ Here's how:                                       │
│ ✅ {step_1}                                      │
│ ✅ {step_2}                                      │
│ ✅ {step_3}                                      │
│                                                   │
│ Try this and let me know how it goes! 👇         │
│                                                   │
│ Hashtags:                                         │
│ #ProductivityTips #{custom_hashtag_1}            │
│ #{custom_hashtag_2} #TuesdayTips                 │
│                                                   │
│ Posting Time: Tuesdays at 10:00 AM               │
└──────────────────────────────────────────────────┘

Variables:
- {tip_number} - Auto-increments
- {tip_title} - Manual input
- {tip_description} - Manual input
- {step_1}, {step_2}, {step_3} - Manual input
- {custom_hashtag_1}, {custom_hashtag_2} - Manual input

Visual Template:
- Aspect Ratio: 4:5 (Instagram optimal)
- Background: Brand gradient
- Text overlay: Tip title in brand font
- Logo: Bottom right corner
```

**Template Creation Flow**:
```
1. Create New Template
   └─> Name template (e.g., "Weekly Podcast")
   └─> Select template type (Script, Caption, Video, Blog)

2. Define Structure
   └─> Add sections (Introduction, Main Content, Conclusion)
   └─> Add variables in {curly_braces} for dynamic content
   └─> Set default values for variables (optional)
   └─> Add formatting rules (word count, tone, style)

3. Configure Metadata
   └─> Target platforms
   └─> Optimal duration/length
   └─> Tone/style guidelines
   └─> SEO requirements (if applicable)

4. Save & Test
   └─> Apply template to test content
   └─> Preview output
   └─> Adjust template if needed
   └─> Save final version

5. Share (Optional)
   └─> Keep private or share with team
   └─> Publish to template marketplace (future)
```

---

### 2. Platform-Specific Presets

**Purpose**: Save optimal settings for each platform to avoid lookup/guesswork

**Preset Categories**:

**Video Presets**:
```
┌──────────────────────────────────────────────────┐
│ Platform Presets - Video                          │
├──────────────────────────────────────────────────┤
│                                                   │
│ TikTok                                            │
│ • Aspect Ratio: 9:16 (Portrait)                  │
│ • Optimal Duration: 15-60 seconds                │
│ • Max Duration: 10 minutes                       │
│ • Resolution: 1080x1920 (min 720x1280)           │
│ • File Format: MP4, MOV                          │
│ • Max Size: 287 MB (iOS), 72 MB (Android)        │
│ • Caption Style: Auto-captions on-screen         │
│ • Soundtrack: Trending audio recommended         │
│ • Posting Time: 2-6 PM, 9-11 PM weekdays         │
│                                                   │
│ Instagram Reels                                   │
│ • Aspect Ratio: 9:16 (Portrait)                  │
│ • Optimal Duration: 15-30 seconds (max 90s)      │
│ • Resolution: 1080x1920                          │
│ • File Format: MP4, MOV                          │
│ • Max Size: 4 GB                                 │
│ • Caption Style: Subtitles at bottom            │
│ • Audio: Original or trending audio              │
│ • Posting Time: 11 AM-1 PM, 7-9 PM              │
│                                                   │
│ YouTube Shorts                                    │
│ • Aspect Ratio: 9:16 (Portrait)                  │
│ • Duration: 15-60 seconds                        │
│ • Resolution: 1080x1920 (min 720x1280)           │
│ • File Format: MP4                               │
│ • Max Size: 256 GB                               │
│ • Caption Style: Optional on-screen text         │
│ • Title: 100 characters max                      │
│ • Posting Time: 3-6 PM weekdays                  │
│                                                   │
│ YouTube Long-Form                                 │
│ • Aspect Ratio: 16:9 (Landscape)                 │
│ • Optimal Duration: 8-15 minutes (10:01+ for ads) │
│ • Resolution: 1920x1080 (4K preferred)           │
│ • File Format: MP4, MOV                          │
│ • Max Size: 256 GB                               │
│ • Thumbnail: 1280x720, <2 MB                     │
│ • Title: 70 characters optimal (100 max)         │
│ • Description: 5000 characters max               │
│ • Tags: 500 characters max                       │
│ • Posting Time: 2-4 PM weekdays                  │
│                                                   │
│ LinkedIn Video                                    │
│ • Aspect Ratio: 16:9 or 1:1                      │
│ • Duration: 30 seconds - 3 minutes optimal       │
│ • Resolution: 1920x1080                          │
│ • File Format: MP4                               │
│ • Max Size: 5 GB                                 │
│ • Captions: Required (accessibility)             │
│ • Caption Length: 3000 characters                │
│ • Posting Time: 7-9 AM, 12-1 PM weekdays         │
└──────────────────────────────────────────────────┘
```

**Image/Graphic Presets**:
```
┌──────────────────────────────────────────────────┐
│ Platform Presets - Images                         │
├──────────────────────────────────────────────────┤
│                                                   │
│ Instagram Feed Post                               │
│ • Aspect Ratios:                                  │
│   - Square: 1:1 (1080x1080)                      │
│   - Portrait: 4:5 (1080x1350) - Recommended      │
│   - Landscape: 1.91:1 (1080x566)                 │
│ • File Format: JPG, PNG                          │
│ • Max Size: 30 MB                                │
│ • Caption: 2200 characters max                   │
│ • Hashtags: 10-15 optimal, 30 max                │
│                                                   │
│ Instagram Story/Reels Cover                       │
│ • Aspect Ratio: 9:16 (1080x1920)                 │
│ • File Format: JPG, PNG                          │
│ • Max Size: 30 MB                                │
│ • Text: Keep in "safe zone" (center 1080x1350)  │
│                                                   │
│ Twitter/X Image                                   │
│ • Aspect Ratio:                                   │
│   - Single image: 16:9 (1200x675)                │
│   - Multiple: 2:1 (1200x600)                     │
│ • File Format: JPG, PNG, GIF                     │
│ • Max Size: 5 MB (photos), 15 MB (GIF)           │
│ • Alt text: 1000 characters                      │
│ • Caption: 280 characters                        │
│                                                   │
│ LinkedIn Post Image                               │
│ • Aspect Ratio: 1.91:1 (1200x627) optimal        │
│ • File Format: JPG, PNG, GIF                     │
│ • Max Size: 10 MB                                │
│ • Caption: 3000 characters                       │
│ • Professional aesthetic preferred                │
│                                                   │
│ Facebook Post                                     │
│ • Aspect Ratio: 1.91:1 (1200x630) optimal        │
│ • File Format: JPG, PNG                          │
│ • Max Size: 4 MB                                 │
│ • Caption: 63,206 characters max (but keep short) │
│                                                   │
│ Blog Featured Image                               │
│ • Aspect Ratio: 16:9 (1920x1080) or 2:1          │
│ • File Format: JPG, PNG                          │
│ • Max Size: 1 MB (compressed for web)            │
│ • Alt text: 125 characters                       │
└──────────────────────────────────────────────────┘
```

**Caption Presets**:
```
┌──────────────────────────────────────────────────┐
│ Platform Presets - Captions                       │
├──────────────────────────────────────────────────┤
│                                                   │
│ Twitter/X                                         │
│ • Length: 200-280 characters                     │
│ • Structure: Hook + Value + CTA/Thread           │
│ • Hashtags: 1-2 max                              │
│ • Emojis: Minimal, strategic                     │
│ • Tone: Conversational, witty                    │
│                                                   │
│ LinkedIn                                          │
│ • Length: 1200-1600 characters optimal           │
│ • Structure: Story + Insight + CTA               │
│ • Hashtags: 3-5 industry-specific                │
│ • Emojis: Professional, minimal                  │
│ • Tone: Professional, authoritative              │
│ • First 2 lines critical (hook)                  │
│                                                   │
│ Instagram                                         │
│ • Length: 125-150 words (2200 char limit)        │
│ • Structure: Hook + Storytelling + CTA           │
│ • Hashtags: 10-15 (mix popular + niche)          │
│ • Emojis: Liberal use, visual breaks             │
│ • Tone: Casual, community-focused                │
│ • First sentence is hook                         │
│                                                   │
│ TikTok                                            │
│ • Length: 150-300 characters                     │
│ • Structure: Hook/trend + Context + Hashtags     │
│ • Hashtags: 3-5 (trending + niche)               │
│ • Emojis: Frequent, playful                      │
│ • Tone: Casual, entertaining, trend-aware        │
└──────────────────────────────────────────────────┘
```

**Preset Application**:
```
User Experience:

1. Select Platform
   └─> User selects "Instagram Reel"

2. Auto-Apply Preset
   └─> System automatically:
       • Sets aspect ratio to 9:16
       • Sets optimal duration to 15-30s
       • Applies caption template (Instagram style)
       • Suggests hashtags
       • Recommends posting time

3. Override (Optional)
   └─> User can adjust any preset value
   └─> System warns if outside optimal range
   └─> Save custom preset for future use
```

---

### 3. Brand Kit System

**Purpose**: Central repository for brand assets and guidelines

**Brand Kit Components**:

```
┌──────────────────────────────────────────────────┐
│ Brand Kit - "ContentFlow Brand"                  │
├──────────────────────────────────────────────────┤
│                                                   │
│ 🎨 Colors                                         │
│ Primary:                                          │
│ • #6366F1 (Indigo) - Main brand color            │
│ • #8B5CF6 (Purple) - Accent                      │
│ • #EC4899 (Pink) - Highlight                     │
│                                                   │
│ Secondary:                                        │
│ • #10B981 (Green) - Success/Growth               │
│ • #F59E0B (Amber) - Warning/Energy               │
│ • #EF4444 (Red) - Error/Urgent                   │
│                                                   │
│ Neutral:                                          │
│ • #1F2937 (Dark Gray) - Text                     │
│ • #6B7280 (Gray) - Secondary text                │
│ • #F3F4F6 (Light Gray) - Backgrounds             │
│                                                   │
│ 📝 Typography                                     │
│ Headings: Inter Bold                             │
│ • H1: 48px / 56px line height                    │
│ • H2: 36px / 44px                                │
│ • H3: 24px / 32px                                │
│                                                   │
│ Body: Inter Regular                              │
│ • Body: 16px / 24px line height                  │
│ • Small: 14px / 20px                             │
│ • Caption: 12px / 16px                           │
│                                                   │
│ 🖼️ Logos                                          │
│ • Full logo (horizontal): logo-full.png          │
│ • Icon only: logo-icon.png                       │
│ • Wordmark: logo-wordmark.png                    │
│ • White version: logo-white.png                  │
│                                                   │
│ Usage Rules:                                      │
│ • Minimum size: 120px wide                       │
│ • Clear space: 20px all sides                    │
│ • Background: Use on dark or light only          │
│                                                   │
│ 🎬 Video Assets                                   │
│ • Intro clip (5 seconds): intro.mp4              │
│ • Outro clip (5 seconds): outro.mp4              │
│ • Lower third template: lowerthird.png           │
│ • Transition graphic: transition.mp4             │
│                                                   │
│ 🎵 Audio                                          │
│ • Brand music (instrumental): brand-music.mp3    │
│ • Intro sound effect: intro-sfx.wav              │
│ • Outro sound effect: outro-sfx.wav              │
│                                                   │
│ ✍️ Brand Voice                                    │
│ Tone: Professional yet approachable              │
│ • Confident but not arrogant                     │
│ • Helpful and educational                        │
│ • Conversational without being too casual        │
│ • Data-driven with human touch                   │
│                                                   │
│ Do's:                                             │
│ ✅ Use "we" and "you" (inclusive)                │
│ ✅ Lead with benefits                            │
│ ✅ Use concrete examples                         │
│ ✅ Be encouraging and supportive                 │
│                                                   │
│ Don'ts:                                           │
│ ❌ Overpromise or hype                           │
│ ❌ Use jargon without explanation                │
│ ❌ Be overly formal or corporate                 │
│ ❌ Make assumptions about user skill level       │
└──────────────────────────────────────────────────┘
```

**Brand Kit Features**:

**1. Asset Library**:
- Upload and organize brand assets
- Tag assets by type (logo, color, font, video, audio)
- Version control (track updates to brand assets)
- Usage guidelines per asset
- Download in multiple formats

**2. One-Click Application**:
```
When creating quote graphics:
[Apply Brand Kit]
  └─> Automatically applies:
      • Brand colors to background/text
      • Brand fonts to all text
      • Logo in bottom corner
      • Color palette from brand kit
      • Maintains brand guidelines
```

**3. Brand Compliance Checking**:
```
System analyzes content and alerts:

⚠️ Brand Compliance Warning:
  • Color #FF5733 not in brand kit (used in graphic)
  • Font "Comic Sans" not approved (use Inter instead)
  • Logo too small (120px minimum required)

Suggestion: [Apply Brand Kit] to fix issues
```

**4. Team Sharing**:
- Share brand kit with team members
- Role-based access (view only, edit, admin)
- Track brand kit usage across team
- Ensure brand consistency across all creators

---

### 4. Content Series Templates

**Purpose**: Multi-part content with consistent structure

**Series Template Example**:
```
┌──────────────────────────────────────────────────┐
│ Content Series: "SaaS Startup Journey"           │
├──────────────────────────────────────────────────┤
│                                                   │
│ Series Structure:                                 │
│ • Episode 1: The Idea                            │
│ • Episode 2: Building MVP                        │
│ • Episode 3: First Customer                      │
│ • Episode 4: Scaling Challenges                  │
│ • Episode 5: Lessons Learned                     │
│                                                   │
│ Episode Template:                                 │
│ Title: "{series_name} - Ep {ep_number}: {topic}" │
│                                                   │
│ Intro: (Same across all episodes)                │
│ "Welcome to {series_name}! In this {ep_count}-   │
│ part series, I'm sharing my journey building     │
│ a SaaS from scratch."                            │
│                                                   │
│ Main Content: {episode_content}                  │
│                                                   │
│ Outro: (Same across all episodes)                │
│ "That's it for Episode {ep_number}! Next week,   │
│ we'll cover {next_topic}. Subscribe so you       │
│ don't miss it!"                                  │
│                                                   │
│ Cross-Promotion:                                  │
│ • End card: Links to previous episodes           │
│ • Playlist: Auto-add to series playlist          │
│ • Thumbnail: Consistent design with ep number    │
│                                                   │
│ Publishing Schedule:                              │
│ • Frequency: Weekly (Mondays at 10 AM)           │
│ • Duration: 5 episodes over 5 weeks              │
│ • Platforms: YouTube, Spotify, Blog              │
└──────────────────────────────────────────────────┘
```

**Series Features**:
- **Auto-numbering**: Episode numbers auto-increment
- **Navigation**: Auto-generate prev/next episode links
- **Binge-watch optimization**: Playlist creation, end screens
- **Progress tracking**: Track series completion rate
- **Reminder system**: Notify when next episode is due

---

## Technical Architecture

### Data Models

```typescript
// Template
interface Template {
  id: string;
  userId: string;
  teamId?: string;
  name: string;
  description?: string;
  type: 'script' | 'caption' | 'blog' | 'video' | 'series';
  category?: string; // 'podcast', 'youtube', 'blog', 'social'

  // Template content
  structure: TemplateSection[];
  variables: TemplateVariable[];
  metadata: TemplateMetadata;

  // Sharing
  visibility: 'private' | 'team' | 'public';
  usageCount: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
}

// Template Section
interface TemplateSection {
  id: string;
  name: string; // "Introduction", "Main Content", "Conclusion"
  order: number;
  content: string; // With {variables} in curly braces
  optional: boolean;
  repeatableFields?: string[]; // e.g., ["step_1", "step_2", ...]
  guidelines?: string; // Word count, tone, etc.
}

// Template Variable
interface TemplateVariable {
  name: string; // e.g., "topic", "guest_name"
  type: 'text' | 'number' | 'date' | 'select' | 'multiline';
  defaultValue?: string;
  required: boolean;
  placeholder?: string;
  options?: string[]; // For 'select' type
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string; // Regex
  };
}

// Template Metadata
interface TemplateMetadata {
  platforms?: Platform[];
  duration?: { min: number; max: number }; // seconds
  wordCount?: { min: number; max: number };
  tone?: string[];
  seoKeywords?: string[];
  optimalPostingTimes?: string[];
}

// Platform Preset
interface PlatformPreset {
  id: string;
  platform: Platform;
  contentType: 'video' | 'image' | 'text';

  // Video specs
  aspectRatio?: string; // "9:16", "16:9", "1:1", "4:5"
  resolution?: { width: number; height: number };
  duration?: { optimal: number; max: number }; // seconds
  fileFormat?: string[];
  maxFileSize?: number; // bytes

  // Image specs
  dimensions?: { width: number; height: number };
  imageFormat?: string[];

  // Text specs
  captionLength?: { optimal: number; max: number };
  hashtagCount?: { optimal: number; max: number };

  // Content guidelines
  captionStructure?: string;
  tone?: string;
  postingTimes?: string[];

  // System
  isCustom: boolean; // false for built-in presets
  userId?: string; // if custom preset
}

// Brand Kit
interface BrandKit {
  id: string;
  userId: string;
  teamId?: string;
  name: string;

  // Colors
  colors: {
    primary: string[];
    secondary: string[];
    neutral: string[];
  };

  // Typography
  fonts: {
    heading: { family: string; sizes: { h1: string; h2: string; h3: string } };
    body: { family: string; sizes: { body: string; small: string; caption: string } };
  };

  // Logos
  logos: {
    full: string; // URL
    icon: string;
    wordmark: string;
    white: string;
    usageRules: string;
  };

  // Video assets
  videoAssets?: {
    intro?: string; // URL
    outro?: string;
    lowerThird?: string;
    transition?: string;
  };

  // Audio
  audioAssets?: {
    music?: string; // URL
    introSfx?: string;
    outroSfx?: string;
  };

  // Brand voice
  brandVoice: {
    tone: string;
    dos: string[];
    donts: string[];
    examples?: string[];
  };

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Content Series
interface ContentSeries {
  id: string;
  userId: string;
  name: string;
  description?: string;

  // Series structure
  templateId: string; // Template used for all episodes
  episodeCount: number;
  episodes: SeriesEpisode[];

  // Publishing
  schedule: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    dayOfWeek?: number;
    time?: string;
  };
  platforms: Platform[];

  // Status
  status: 'planned' | 'active' | 'completed';
  currentEpisode: number;

  createdAt: Date;
  updatedAt: Date;
}

interface SeriesEpisode {
  number: number;
  title: string;
  description?: string;
  contentId?: string; // Link to actual content piece
  status: 'planned' | 'draft' | 'scheduled' | 'published';
  publishDate?: Date;
}
```

### API Endpoints

```typescript
// Templates
GET /api/templates
Query: { type?, category?, visibility? }
Response: Template[]

POST /api/templates
Body: Template
Response: Template

PUT /api/templates/:id
Body: Partial<Template>

DELETE /api/templates/:id

GET /api/templates/:id/apply
Query: { contentId }
Response: { contentId, appliedTemplate }

// Platform Presets
GET /api/presets/:platform/:contentType
Response: PlatformPreset

POST /api/presets/custom
Body: PlatformPreset

// Brand Kits
GET /api/brand-kits
Response: BrandKit[]

POST /api/brand-kits
Body: BrandKit

PUT /api/brand-kits/:id
Body: Partial<BrandKit>

POST /api/brand-kits/:id/apply
Body: { contentId }
Response: { contentId, appliedBrandKit }

// Content Series
GET /api/series
Response: ContentSeries[]

POST /api/series
Body: ContentSeries

PUT /api/series/:id/episodes/:episodeNumber
Body: Partial<SeriesEpisode>
```

---

## User Experience Flow

### Flow 1: Create Template from Existing Content

```
1. User Views Successful Content
   └─> "This format worked well, let's reuse it"

2. Click "Save as Template"
   └─> System analyzes content structure
   └─> Identifies repeatable sections
   └─> Suggests variables (dates, names, topics)

3. Customize Template
   └─> Name template: "Weekly Podcast"
   └─> Review detected variables
   └─> Add optional sections
   └─> Set guidelines (word count, tone)

4. Save & Share
   └─> Save for personal use
   └─> Or share with team
   └─> Template added to library

5. Apply to New Content
   └─> Create new content piece
   └─> Select "Use Template: Weekly Podcast"
   └─> Fill in variables
   └─> Content structure auto-populated
   └─> Edit and publish
```

### Flow 2: Setup Brand Kit

```
1. Navigate to Brand Kit
   └─> Settings → Brand Kit

2. Upload Brand Assets
   ├─> Colors: Add primary, secondary, neutral
   ├─> Logos: Upload full, icon, wordmark versions
   ├─> Fonts: Specify heading and body fonts
   └─> Optional: Video/audio assets

3. Define Brand Voice
   └─> Tone description
   └─> Do's and don'ts
   └─> Usage examples

4. Apply to Content
   └─> When creating graphics/videos
   └─> Click "Apply Brand Kit"
   └─> Assets automatically used
   └─> Brand compliance checked

5. Share with Team
   └─> Invite team members
   └─> Set permissions
   └─> Track usage
```

---

## Implementation Plan

### Week 1: Core Template System
- [ ] Design template data models
- [ ] Build template creation UI
- [ ] Implement variable system
- [ ] Create template library view
- [ ] Build template application logic

### Week 1-2: Platform Presets
- [ ] Research platform specifications
- [ ] Create preset database
- [ ] Build preset selection UI
- [ ] Implement auto-apply logic
- [ ] Add custom preset creation

### Week 2: Brand Kit
- [ ] Design brand kit data model
- [ ] Build asset upload system
- [ ] Create brand kit UI
- [ ] Implement one-click application
- [ ] Add brand compliance checking

### Week 2: Polish & Launch
- [ ] Series template support
- [ ] Template marketplace (future)
- [ ] Usage analytics
- [ ] Documentation
- [ ] User testing and feedback

---

## Success Criteria

### Launch
- [ ] 20+ built-in platform presets
- [ ] Template creation <5 minutes
- [ ] Template application <30 seconds
- [ ] Brand kit setup <10 minutes
- [ ] 95%+ template application success rate

### 30 Days Post-Launch
- [ ] 60%+ users create at least 1 template
- [ ] Average 3+ templates per user
- [ ] 70%+ content uses templates
- [ ] 40%+ time savings reported
- [ ] +10% retention increase

### 90 Days Post-Launch
- [ ] 80%+ template adoption
- [ ] 50%+ faster content creation
- [ ] #1 or #2 most-loved feature
- [ ] 100,000+ template applications
- [ ] Marketplace with 50+ community templates

---

## Future Enhancements

- **AI Template Generation**: Analyze user's content and auto-create templates
- **Template Marketplace**: Share/sell templates with community
- **Dynamic Templates**: Templates that adapt based on performance data
- **Multi-Language Templates**: Translate templates to other languages
- **Template Analytics**: Track which templates perform best
- **Template Versioning**: Update templates and apply changes to past content
- **Conditional Logic**: If-then rules in templates (e.g., if platform=Instagram, add hashtags)

---

**Document Owner**: Product Team
**Last Updated**: December 2024
**Status**: Ready for Development
