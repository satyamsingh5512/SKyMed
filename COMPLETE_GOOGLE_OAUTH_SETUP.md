# Complete Google OAuth Setup Guide

You've enabled Google OAuth in Supabase, but you need to configure the Google credentials. Here's the complete step-by-step guide:

## Current Status
✅ Google OAuth provider is **enabled** in Supabase  
❌ Google Client ID and Secret are **not configured**

## Step 1: Create Google Cloud Project

### 1.1 Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one

### 1.2 Enable Required APIs
1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API" and enable it
3. Search for "Google Identity" and enable it

## Step 2: Configure OAuth Consent Screen

### 2.1 Set up Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type (unless you have Google Workspace)
3. Fill in the required information:

```
App name: SkyMed Emergency Delivery
User support email: [your-email@domain.com]
App logo: [optional - upload SkyMed logo]
App domain: [your-domain.com or leave blank for development]
Developer contact information: [your-email@domain.com]
```

### 2.2 Add Scopes
1. Click **Add or Remove Scopes**
2. Add these scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
3. Save and continue

### 2.3 Add Test Users (for development)
1. Add your email and any test user emails
2. Save and continue

## Step 3: Create OAuth Credentials

### 3.1 Create OAuth 2.0 Client ID
1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**

### 3.2 Configure the Client
```
Name: SkyMed Web Client

Authorized JavaScript origins:
- http://localhost:5173 (for development)
- https://your-domain.com (for production)

Authorized redirect URIs:
- https://shalookoiycpttkatrlr.supabase.co/auth/v1/callback
```

### 3.3 Save and Copy Credentials
1. Click **Create**
2. **IMPORTANT**: Copy the **Client ID** and **Client Secret**
3. Keep these secure - you'll need them for Supabase

## Step 4: Configure Supabase

### 4.1 Add Google Credentials to Supabase
1. Go to your [Supabase Dashboard](https://shalookoiycpttkatrlr.supabase.co)
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list
4. Paste your credentials:
   - **Client ID**: [paste from Google Cloud Console]
   - **Client Secret**: [paste from Google Cloud Console]
5. Click **Save**

### 4.2 Verify Configuration
1. The Google provider should show as "Configured" ✅
2. Test the integration from your app

## Step 5: Test the Integration

### 5.1 Development Testing
1. Start your app: `npm run dev`
2. Go to `/login`
3. Click **Continue with Google**
4. Complete the OAuth flow
5. Verify user profile is created

### 5.2 Production Setup
When deploying to production:
1. Update **Authorized JavaScript origins** in Google Cloud Console
2. Update **Authorized redirect URIs** if needed
3. Update Supabase **Site URL** in Authentication settings

## Quick Setup Commands

If you want to skip Google OAuth for now and use email authentication:

1. **Disable Google OAuth temporarily**:
   - Go to Supabase → Authentication → Providers
   - Toggle Google **OFF**

2. **Use email authentication**:
   - All features work with email/password
   - Users can sign up at `/signup`
   - Medical professionals can use `/medical-login`

## Troubleshooting

### Common Errors

**"missing OAuth secret"**
- You enabled Google but didn't add Client ID/Secret
- Follow Step 4 above to add credentials

**"redirect_uri_mismatch"**
- Check redirect URI matches exactly: `https://shalookoiycpttkatrlr.supabase.co/auth/v1/callback`
- Make sure there are no extra spaces or characters

**"invalid_client"**
- Double-check Client ID and Secret are correct
- Ensure you copied them completely

**"access_denied"**
- User canceled the OAuth flow
- Check OAuth consent screen is properly configured

### Debug Steps
1. Check browser console for detailed error messages
2. Verify Google Cloud Console project has correct APIs enabled
3. Test with an incognito browser window
4. Check Supabase logs in the dashboard

## Security Best Practices

1. **Keep secrets secure**: Never expose Client Secret in frontend code
2. **Use HTTPS in production**: Required for OAuth
3. **Regularly rotate credentials**: Update OAuth credentials periodically
4. **Monitor usage**: Check Google Cloud Console for API usage
5. **Limit scopes**: Only request necessary permissions

## Alternative: Email Authentication

While setting up Google OAuth, users can still:
- Sign up with email/password at `/signup`
- Login with email at `/login`
- Use medical professional registration at `/medical-login`
- Access all SkyMed features normally

All features work perfectly with email authentication!