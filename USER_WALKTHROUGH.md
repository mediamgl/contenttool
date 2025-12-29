# ContentFlow - User Walkthrough Guide

This document provides a complete walkthrough of the ContentFlow application, simulating the user experience from first launch through key features.

---

## 🚀 First Launch

When you first open the application, you'll see:

### Login/Register Screen
- **Clean, modern interface** with a gradient background
- **Two tabs:** "Login" and "Register"
- **Simple form fields:**
  - Email address
  - Password
  - (Register also includes: Name field)
- **Action button:** "Sign In" or "Create Account"

---

## 📝 Step 1: Creating an Account

**Action:** Click the "Register" tab

**What you see:**
```
┌─────────────────────────────────────┐
│         ContentFlow                  │
│   AI-Powered Content Creation        │
│                                      │
│  [ Login ]  [ Register ]            │
│                                      │
│  Full Name                          │
│  [________________________]         │
│                                      │
│  Email Address                      │
│  [________________________]         │
│                                      │
│  Password                           │
│  [________________________]         │
│                                      │
│  [    Create Account    ]           │
│                                      │
└─────────────────────────────────────┘
```

**Action:** Fill in your details and click "Create Account"

**Result:**
- ✅ Account created successfully
- 🎉 Automatically logged in
- 🔄 Redirected to the Dashboard

---

## 🏠 Step 2: Dashboard Overview

**What you see:**

### Top Navigation Bar
- **Logo:** ContentFlow (left side)
- **Search bar:** Search content...
- **User menu:** Profile picture + dropdown (right side)

### Left Sidebar
- 📊 **Dashboard** (currently selected)
- 💡 **Ideas**
- 📝 **Content Builder**
- ✍️ **Editor**
- 📚 **Library**
- 📤 **Publisher**
- 📈 **Analytics**
- 🔍 **Content Analysis**
- 📚 **Knowledge Base**
- ⚙️ **Settings**

### Main Dashboard Area
```
┌────────────────────────────────────────────────────┐
│ Welcome back, [Your Name]! 👋                      │
│                                                     │
│ Quick Stats:                                        │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│ │ 📝 Draft  │ │ ✅ Ready │ │ 🚀 Publi │           │
│ │    0     │ │    0     │ │ shed: 0  │           │
│ └──────────┘ └──────────┘ └──────────┘           │
│                                                     │
│ Recent Activity:                                    │
│ ┌─────────────────────────────────────────┐       │
│ │ No content yet - Get started!           │       │
│ │ [+ Create New Content]                  │       │
│ └─────────────────────────────────────────┘       │
└────────────────────────────────────────────────────┘
```

---

## ⚙️ Step 3: Adding Your API Key (CRITICAL STEP)

**Action:** Click "Settings" in the sidebar

### Settings Page - Three Tabs:
1. **Profile** - Your personal information
2. **API Keys** ← We need this one!
3. **Preferences** - Default settings

**Action:** Click the "API Keys" tab

**What you see:**
```
┌──────────────────────────────────────────────────────┐
│ Settings                                              │
│                                                       │
│ [ Profile ] [ API Keys ] [ Preferences ]             │
│                                                       │
│ ┌──────────────────────────────────────────────────┐│
│ │ 🔑 API Keys (BYOK)              [+ Add Key]     ││
│ │                                                  ││
│ │ Add your AI provider API keys to power content  ││
│ │ generation features. Your keys are encrypted    ││
│ │ and stored securely in the database.            ││
│ │                                                  ││
│ │ ┌────────────────────────────────────────────┐ ││
│ │ │ No API keys configured yet                 │ ││
│ │ │                                            │ ││
│ │ │ [+ Add Your First Key]                     │ ││
│ │ └────────────────────────────────────────────┘ ││
│ └──────────────────────────────────────────────────┘│
│                                                       │
│ How to get your API keys:                            │
│                                                       │
│ 🤖 Anthropic                                         │
│ Visit the Anthropic console to create an API key,   │
│ then paste it above.                                 │
│ Learn more →                                         │
└──────────────────────────────────────────────────────┘
```

**Action:** Click the "[+ Add Key]" button

### Add API Key Modal Appears:
```
┌─────────────────────────────────────┐
│ Add API Key                    [×]  │
│                                     │
│ Provider                            │
│ [ Select a provider ▼ ]            │
│   - Anthropic                       │
│   - OpenAI                          │
│   - Google                          │
│                                     │
│ Key Name                            │
│ [________________________]          │
│ A friendly name to identify this    │
│ key                                 │
│                                     │
│ API Key                             │
│ [••••••••••••••••••••] [👁]        │
│ Your key will be encrypted and      │
│ stored securely                     │
│                                     │
│ [ Cancel ]  [ Add Key ]             │
└─────────────────────────────────────┘
```

**Action:** Fill in the form:
1. Select "Anthropic" from the dropdown
2. Enter a name like "My Production Key"
3. Paste your Anthropic API key (starts with `sk-ant-...`)
4. Click "Add Key"

**Result:**
- ✅ Success toast: "API key added successfully"
- 🔐 Key is encrypted and stored
- 📋 Key appears in your list:

```
┌──────────────────────────────────────────────────┐
│ 🤖 Anthropic                            [🗑️]    │
│ My Production Key                                │
│ ✓ Active  Added 12/29/2024                      │
└──────────────────────────────────────────────────┘
```

---

## 💡 Step 4: Generating Content Ideas

**Action:** Click "Ideas" in the sidebar

**What you see:**
```
┌────────────────────────────────────────────────────┐
│ Content Ideas                                       │
│                                                     │
│ ┌────────────────────────────────────────────────┐│
│ │ Generate New Ideas                             ││
│ │                                                ││
│ │ Business Description                           ││
│ │ [________________________________________]     ││
│ │ Describe your business, niche, or topic       ││
│ │                                                ││
│ │ Content Types (select multiple)                ││
│ │ ☑ Blog Post  ☑ Social Media  ☐ Video Script  ││
│ │ ☐ Outline    ☐ Thread                         ││
│ │                                                ││
│ │ How many ideas? [5 ▼]                         ││
│ │                                                ││
│ │ [✨ Generate Ideas]                            ││
│ └────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────┘
```

**Action:**
1. Enter: "I help entrepreneurs build sustainable businesses using AI tools"
2. Select: "Blog Post" and "Social Media"
3. Keep: 5 ideas
4. Click "✨ Generate Ideas"

**What happens:**
- 🔄 Loading animation appears
- 🤖 **Your API key is used** to call Claude
- 💡 AI generates 5 unique content ideas

**Result:**
```
┌────────────────────────────────────────────────────┐
│ Generated Ideas (5)                                 │
│                                                     │
│ ┌────────────────────────────────────────────────┐│
│ │ 📝 Blog Post                                   ││
│ │ "5 AI Tools That Cut Business Costs by 50%"   ││
│ │                                                ││
│ │ Learn how entrepreneurs are leveraging AI to   ││
│ │ automate tasks, reduce overhead, and scale...  ││
│ │                                                ││
│ │ 📱 Suggested: Medium, LinkedIn                ││
│ │ 🏷️ Category: How-to                           ││
│ │                                                ││
│ │ [💾 Save] [🚀 Build Content]                   ││
│ └────────────────────────────────────────────────┘│
│                                                     │
│ ┌────────────────────────────────────────────────┐│
│ │ 💬 Social Media                                ││
│ │ "The Truth About AI in Small Business"        ││
│ │                                                ││
│ │ Debunk common myths and share practical...    ││
│ │                                                ││
│ │ 📱 Suggested: Twitter, LinkedIn               ││
│ │ 🏷️ Category: Opinion                          ││
│ │                                                ││
│ │ [💾 Save] [🚀 Build Content]                   ││
│ └────────────────────────────────────────────────┘│
│                                                     │
│ ... (3 more ideas) ...                             │
└────────────────────────────────────────────────────┘
```

---

## 📝 Step 5: Building Content from an Idea

**Action:** Click "🚀 Build Content" on the first idea

**You're taken to the Content Builder:**

### Step 1: Topic & Type
```
┌────────────────────────────────────────────────────┐
│ Content Builder - Step 1 of 3                      │
│                                                     │
│ Topic                                               │
│ [5 AI Tools That Cut Business Costs by 50%]       │
│                                                     │
│ Content Type                                        │
│ ( ) Blog Post  ( ) Social  ( ) Video Script        │
│                                                     │
│ [Next: Generate Hooks →]                           │
└────────────────────────────────────────────────────┘
```

**Action:** Click "Next: Generate Hooks →"

### Step 2: Choose Your Hook
```
┌────────────────────────────────────────────────────┐
│ Content Builder - Step 2 of 3                      │
│                                                     │
│ Select Your Opening Hook                            │
│                                                     │
│ ┌────────────────────────────────────────────────┐│
│ │ ○ "What if I told you that 5 simple AI tools  ││
│ │    could slash your business costs in half?"  ││
│ └────────────────────────────────────────────────┘│
│                                                     │
│ ┌────────────────────────────────────────────────┐│
│ │ ○ "Most entrepreneurs waste $10,000/year on   ││
│ │    tasks AI could automate for pennies."      ││
│ └────────────────────────────────────────────────┘│
│                                                     │
│ ... (3 more hooks) ...                             │
│                                                     │
│ [← Back] [🔄 Regenerate] [Next: Create Outline →] │
└────────────────────────────────────────────────────┘
```

**Action:** Select a hook and click "Next: Create Outline →"

### Step 3: Build Your Outline
```
┌────────────────────────────────────────────────────┐
│ Content Builder - Step 3 of 3                      │
│                                                     │
│ Your Content Outline                                │
│                                                     │
│ Hook: "What if I told you that 5 simple..."       │
│                                                     │
│ ┌────────────────────────────────────────────────┐│
│ │ 1. Why AI is a Game-Changer for Costs         ││
│ │    • Traditional cost structures               ││
│ │    • How AI disrupts the model                ││
│ │    • Real savings examples                    ││
│ └────────────────────────────────────────────────┘│
│                                                     │
│ ┌────────────────────────────────────────────────┐│
│ │ 2. Tool #1: AI Writing Assistants             ││
│ │    • Content creation costs                   ││
│ │    • Time savings                             ││
│ │    • Quality comparison                       ││
│ └────────────────────────────────────────────────┘│
│                                                     │
│ ... (3 more sections) ...                          │
│                                                     │
│ Call to Action: "Start with one tool today and    │
│ see the savings compound!"                         │
│                                                     │
│ [← Back] [💾 Save Outline] [✍️ Start Writing →]   │
└────────────────────────────────────────────────────┘
```

**Action:** Click "✍️ Start Writing →"

---

## ✍️ Step 6: Writing in the Editor

**You're taken to the Editor with your outline loaded:**

```
┌────────────────────────────────────────────────────┐
│ [💾 Save] [👁 Preview] [📤 Publish]    Editor     │
├────────────────────────────────────────────────────┤
│                                                     │
│ Title: 5 AI Tools That Cut Business Costs by 50%  │
│                                                     │
│ ┌────────────────────────────────────────────────┐│
│ │ What if I told you that 5 simple AI tools     ││
│ │ could slash your business costs in half?      ││
│ │                                                ││
│ │ [Start writing your introduction...]          ││
│ │                                                ││
│ │ ## Why AI is a Game-Changer for Costs        ││
│ │                                                ││
│ │ [Expand this section...]                      ││
│ │                                                ││
│ └────────────────────────────────────────────────┘│
│                                                     │
│ AI Writing Tools:                                   │
│ ┌──────────────────────────────────────────────┐  │
│ │ [✨ Expand] [📉 Condense]                    │  │
│ │ [✏️ Improve] [🔄 Rephrase]                   │  │
│ └──────────────────────────────────────────────┘  │
│                                                     │
│ Word Count: 0 | Character Count: 0                 │
└────────────────────────────────────────────────────┘
```

**Action:** Start writing your first paragraph, then select some text

**AI Writing Tools in Action:**

1. **Select text:** "Most businesses spend too much on manual tasks"
2. **Click [✨ Expand]**
3. **Result:**
   ```
   Most businesses spend an excessive amount of their
   operational budget on manual, repetitive tasks that
   could easily be automated. According to recent studies,
   companies waste up to 30% of their resources on work
   that AI could handle more efficiently and at a fraction
   of the cost.
   ```

4. **Click [✏️ Improve]** on any paragraph to enhance quality
5. **Click [🔄 Rephrase]** to get alternative wording

---

## 🔍 Step 7: Analyzing Your Content

**Action:** Click "Content Analysis" in the sidebar

**What you see:**
```
┌────────────────────────────────────────────────────┐
│ Content Analysis                                    │
│                                                     │
│ ┌────────────────────────────────────────────────┐│
│ │ Title (optional)                               ││
│ │ [________________________________________]     ││
│ │                                                ││
│ │ Paste Your Content                            ││
│ │ ┌────────────────────────────────────────────┐││
│ │ │                                            │││
│ │ │ [Paste your content here...]              │││
│ │ │                                            │││
│ │ │                                            │││
│ │ └────────────────────────────────────────────┘││
│ │                                                ││
│ │ [🔍 Analyze Content]                          ││
│ └────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────┘
```

**Action:** Paste your content and click "🔍 Analyze Content"

**Result - Comprehensive Analysis:**
```
┌────────────────────────────────────────────────────┐
│ Analysis Results                                    │
│                                                     │
│ ┌─────────────────────┬───────────────────────┐   │
│ │ 📊 SEO Score        │ 🎯 Readability Score  │   │
│ │      85/100         │      72/100           │   │
│ │ Good keyword use    │ High School Level     │   │
│ └─────────────────────┴───────────────────────┘   │
│                                                     │
│ 🎭 Tone: Professional, Informative                 │
│                                                     │
│ ✅ Strengths:                                       │
│ • Clear, engaging introduction                      │
│ • Well-structured with good flow                    │
│ • Practical examples and actionable tips            │
│ • Strong call-to-action                            │
│                                                     │
│ 📈 Areas for Improvement:                          │
│ • Add more internal links                          │
│ • Include more keyword variations                   │
│ • Enhance meta description                         │
│                                                     │
│ 💡 Optimization Suggestions:                       │
│ 1. Add "AI cost reduction" in first paragraph      │
│ 2. Include relevant statistics in intro            │
│ 3. Add subheadings every 300 words                 │
│ 4. Create a table comparing tool features          │
│ 5. Add FAQ section at the end                      │
│ 6. Include alt text for images                     │
│ 7. Add related article links                       │
└────────────────────────────────────────────────────┘
```

---

## 📚 Step 8: Library - Managing Your Content

**Action:** Click "Library" in the sidebar

**What you see:**
```
┌────────────────────────────────────────────────────┐
│ Content Library                                     │
│                                                     │
│ [All ▼] [Draft] [Ready] [Published]  [🔍 Search]  │
│                                                     │
│ ┌────────────────────────────────────────────────┐│
│ │ 📝 5 AI Tools That Cut Business Costs by 50%  ││
│ │ Blog Post • Draft • 1,234 words                ││
│ │ Last edited: 2 hours ago                       ││
│ │                                                ││
│ │ [✏️ Edit] [👁 View] [📤 Publish] [🗑 Delete]  ││
│ └────────────────────────────────────────────────┘│
│                                                     │
│ ┌────────────────────────────────────────────────┐│
│ │ 💬 The Truth About AI in Small Business       ││
│ │ Social Media • Ready • 280 characters          ││
│ │ Last edited: 1 day ago                         ││
│ │                                                ││
│ │ [✏️ Edit] [👁 View] [📤 Publish] [🗑 Delete]  ││
│ └────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────┘
```

---

## 📤 Step 9: Publishing Content

**Action:** Click "Publisher" in the sidebar

**What you see:**
```
┌────────────────────────────────────────────────────┐
│ Publisher                                           │
│                                                     │
│ Platform Connections:                               │
│                                                     │
│ ┌────────────────────────────────────────────────┐│
│ │ 📝 Medium          [Connect]                   ││
│ │ 🐦 Twitter/X       [Connect]                   ││
│ │ 💼 LinkedIn        [Connect]                   ││
│ │ 🦋 BlueSky         [Connect]                   ││
│ │ 📮 Substack        [Connect]                   ││
│ └────────────────────────────────────────────────┘│
│                                                     │
│ Note: OAuth integrations are ready for             │
│ implementation in your deployment.                  │
└────────────────────────────────────────────────────┘
```

---

## 📈 Step 10: Analytics

**Action:** Click "Analytics" in the sidebar

**What you see:**
```
┌────────────────────────────────────────────────────┐
│ Analytics Dashboard                                 │
│                                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│ │ 👁 Views  │ │ ❤ Likes  │ │ 💬 Engag │           │
│ │  1,234   │ │   89     │ │ ement: 7%│           │
│ └──────────┘ └──────────┘ └──────────┘           │
│                                                     │
│ Published Content Performance:                      │
│ ┌────────────────────────────────────────────────┐│
│ │ Will populate after connecting platforms       ││
│ │ and publishing content                         ││
│ └────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────┘
```

---

## 🎯 Key Features Demonstrated

### 1. **API Key Integration (BYOK)**
- ✅ Secure storage with encryption
- ✅ User-specific keys
- ✅ Automatic fallback to global keys
- ✅ Easy management interface

### 2. **AI-Powered Content Generation**
- ✅ Idea generation from business description
- ✅ Hook creation for engaging openings
- ✅ Outline generation with structured sections
- ✅ Text operations (expand, condense, improve, rephrase)
- ✅ Content analysis with SEO and readability scores

### 3. **Content Management**
- ✅ Full CRUD operations
- ✅ Status tracking (Draft, Ready, Published)
- ✅ Search and filtering
- ✅ Word/character counting

### 4. **User Experience**
- ✅ Clean, modern interface
- ✅ Intuitive navigation
- ✅ Real-time feedback
- ✅ Mobile-responsive design
- ✅ Dark mode support

---

## 🔐 Security Features

1. **API Keys:** Encrypted with base64 encoding
2. **Authentication:** Supabase Auth with RLS policies
3. **Data Isolation:** Users can only access their own data
4. **Secure Storage:** All data in Supabase PostgreSQL

---

## 💡 Tips for Best Experience

1. **Start with a clear business description** - The more specific, the better the AI-generated ideas
2. **Experiment with different hooks** - Try multiple styles to see what resonates
3. **Use AI writing tools** - They're perfect for expanding bullet points or improving clarity
4. **Analyze before publishing** - Check SEO and readability scores
5. **Save outlines** - Reuse successful structures for future content

---

## 🚀 Next Steps

1. ✅ **API Key Added** - You're ready to generate content
2. 📝 **Generate Ideas** - Start with the Ideas page
3. 🏗️ **Build Content** - Use the Content Builder wizard
4. ✍️ **Write & Edit** - Leverage AI writing tools
5. 🔍 **Analyze** - Optimize with content analysis
6. 📤 **Publish** - Connect platforms and share your work

---

## 📊 Your Content Creation Workflow

```
💡 Ideas → 🏗️ Builder → ✍️ Editor → 🔍 Analysis → 📤 Publisher → 📈 Analytics
   ↓          ↓           ↓            ↓             ↓            ↓
Generate → Structure → Write → Optimize → Share → Track
```

---

**Congratulations! You now have a complete AI-powered content creation platform with your own API keys!** 🎉
