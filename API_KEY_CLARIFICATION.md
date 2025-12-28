# API Key Configuration - Clarification

## The Confusion Explained

You were seeing a **mock/placeholder API key** (`sk-ant-...xxxx`) in the Settings page. This was **NOT** the ANTHROPIC_API_KEY configuration I mentioned earlier. They are two completely separate things.

## Two Different API Key Systems

### 1. Global ANTHROPIC_API_KEY (What You Need for AI Features)

**Location:** Supabase Edge Function Secrets
**Purpose:** Powers ALL AI features for ALL users
**Status:** ⚠️ **You need to configure this**

**How to Set:**
```bash
# Option 1: Supabase CLI
supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-actual-key-here

# Option 2: Supabase Dashboard
# Go to: Project Settings > Edge Functions > Secrets
# Add secret: ANTHROPIC_API_KEY with your Anthropic API key
```

**This is what makes these features work:**
- Generate Ideas
- Generate Hooks
- Generate Outlines
- Text Operations (expand, condense, improve, rephrase)
- Content Analysis

---

### 2. User BYOK (Settings Page - Optional)

**Location:** Settings page > API Keys tab
**Purpose:** Allows users to store their own API keys in the database
**Status:** ✅ **Now functional but not integrated with AI features yet**

**What Changed:**
- **Before:** Displayed fake/mock API key data
- **After:** Now connected to the real database
- Users can add/delete their own API keys
- Keys are encrypted and stored securely
- **Important:** These keys are NOT used by the AI features yet

**Why It's Not Active:**
Currently, all AI operations use the global ANTHROPIC_API_KEY from Supabase secrets. To use individual user keys would require:
1. Edge functions to check for user API keys in the database
2. Fallback logic (use user key if available, otherwise use global key)
3. Error handling for invalid/expired user keys
4. Usage tracking per user

This is a planned feature but not yet implemented.

---

## What You Need to Do

### For AI Features to Work:

**Set the global ANTHROPIC_API_KEY in Supabase:**

1. Get your Anthropic API key from: https://console.anthropic.com
2. Go to your Supabase Dashboard
3. Navigate to: Project Settings > Edge Functions > Secrets
4. Click "Add new secret"
5. Name: `ANTHROPIC_API_KEY`
6. Value: Your actual Anthropic API key (starts with `sk-ant-`)
7. Save

**That's it!** Once this is set, all AI features will work immediately.

---

### For User API Keys (Optional):

The Settings page now works properly:
- Users can add their own API keys
- Keys are stored encrypted in the `api_keys` database table
- You can view/delete keys
- **But:** These keys are not yet used by the AI features

This is useful for:
- Planning future BYOK implementation
- Storing keys securely for reference
- Preparing for when individual user keys are supported

---

## Testing After Configuration

### 1. Test Global API Key

After setting ANTHROPIC_API_KEY in Supabase:

```bash
# Test the edge function
curl -X POST https://[project-ref].supabase.co/functions/v1/generate-ideas \
  -H "Authorization: Bearer [anon-key]" \
  -H "Content-Type: application/json" \
  -d '{"businessDescription":"Test business","contentTypes":["blog"],"count":1}'
```

You should get AI-generated ideas back.

### 2. Test User BYOK Storage

1. Login to your application
2. Go to Settings > API Keys tab
3. Click "Add Key"
4. Select a provider (e.g., Anthropic)
5. Enter a name (e.g., "My Personal Key")
6. Enter an API key
7. Click "Add Key"
8. Verify it appears in the list
9. Try deleting it

The key is stored in the database but not used by AI features.

---

## What the Settings Page Shows Now

**Blue Info Box:**
```
Note: User API keys are not yet integrated with AI features

Currently, all AI features use the global ANTHROPIC_API_KEY configured
in Supabase Edge Function Secrets. The ability to use your own API keys
(BYOK) is planned for a future update. For now, you can store keys here
for reference.
```

This makes it clear that:
- User keys are stored but not active
- AI features use the global key
- BYOK is a future enhancement

---

## Summary

| Feature | Location | Status | Required? |
|---------|----------|--------|-----------|
| Global ANTHROPIC_API_KEY | Supabase Edge Function Secrets | ⚠️ Not set yet | ✅ YES - Required for AI features |
| User BYOK in Settings | Settings page UI + Database | ✅ Working | ❌ NO - Optional feature |

**Next Step:**
Set the ANTHROPIC_API_KEY in Supabase Edge Function Secrets, then all AI features will work!

---

## Future Enhancement: Full BYOK Implementation

When implementing full BYOK support, you'll need to:

1. **Update Edge Functions:**
   ```typescript
   // Check for user's API key first
   const userApiKey = await getUserApiKey(userId, 'anthropic');

   // Fallback to global key
   const apiKey = userApiKey || Deno.env.get('ANTHROPIC_API_KEY');

   // Use the key...
   ```

2. **Add Key Validation:**
   - Test keys when added
   - Mark as invalid if they fail
   - Show clear error messages

3. **Usage Tracking:**
   - Track API calls per key
   - Update `last_used_at` timestamp
   - Show usage stats to users

4. **Billing Integration:**
   - Users pay for their own API usage
   - Or rate limiting per user

5. **UI Updates:**
   - Remove the blue info box
   - Add "Currently Active" indicator
   - Show which key is being used
   - Display usage statistics

---

## Questions?

**Q: Why have two API key systems?**
A: The global key is simpler for getting started. BYOK allows users to control their own API costs and usage, which is important for production SaaS applications.

**Q: Can I use just user BYOK without the global key?**
A: Not yet. Currently the global key is required. BYOK is an add-on feature that needs implementation.

**Q: Is it secure to store API keys in the database?**
A: Yes, when done correctly:
- Keys are encrypted (currently base64, should upgrade to proper encryption)
- RLS policies prevent users from seeing each other's keys
- Only the user who added a key can see/delete it
- Consider using a more robust encryption method for production

**Q: What encryption does it use?**
A: Currently base64 encoding (NOT secure encryption). For production, upgrade to:
- AES-256 encryption with a master key
- Or use Supabase Vault for secure secret storage
- Or use a dedicated secrets management service

---

## Files Changed

- `src/pages/Settings.tsx` - Updated to use real database instead of mock data
- Added info box explaining BYOK status
- Connected to `apiKeyService`

**Build Status:** ✅ Successful (508KB bundle, gzip: 133KB)
