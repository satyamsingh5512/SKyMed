# Google OAuth Setup for SkyMed

This guide will help you set up Google OAuth authentication for your SkyMed application.

## 1. Configure Google OAuth in Supabase

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project: https://shalookoiycpttkatrlr.supabase.co
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list of providers

### Step 2: Enable Google Provider
1. Toggle **Enable sign in with Google** to ON
2. You'll need to configure the Google OAuth credentials

## 2. Set up Google Cloud Console

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** for your project

### Step 2: Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - **App name**: SkyMed Emergency Delivery
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Save and continue

### Step 3: Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Configure:
   - **Name**: SkyMed Web Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:5173` (for development)
     - Your production domain
   - **Authorized redirect URIs**:
     - `https://shalookoiycpttkatrlr.supabase.co/auth/v1/callback`
5. Save and copy the **Client ID** and **Client Secret**

## 3. Configure Supabase with Google Credentials

### Step 1: Add Google Credentials to Supabase
1. Back in Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Paste your **Client ID** and **Client Secret**
3. Save the configuration

### Step 2: Update Site URL (if needed)
1. Go to **Authentication** → **Settings**
2. Update **Site URL** to your production domain
3. Add redirect URLs if needed

## 4. Test the Integration

### Development Testing
1. Start your development server: `npm run dev`
2. Go to `/login`
3. Click **Continue with Google**
4. Complete the OAuth flow
5. Verify user profile is created in your `users` table

### Production Testing
1. Deploy your application
2. Update Google Cloud Console with production URLs
3. Test the complete OAuth flow

## 5. Troubleshooting

### Common Issues

**Error: "redirect_uri_mismatch"**
- Check that your redirect URI in Google Cloud Console matches exactly: `https://shalookoiycpttkatrlr.supabase.co/auth/v1/callback`

**Error: "invalid_client"**
- Verify Client ID and Client Secret are correct in Supabase
- Make sure the Google Cloud project has the correct APIs enabled

**User profile not created**
- Check browser console for errors
- Verify the `users` table exists and has correct permissions
- Check that RLS policies allow user insertion

### Debug Steps
1. Check browser network tab for failed requests
2. Look at Supabase logs in the dashboard
3. Verify database permissions and RLS policies
4. Test with a fresh incognito browser session

## 6. Security Considerations

- Keep your Client Secret secure and never expose it in frontend code
- Use HTTPS in production
- Regularly rotate your OAuth credentials
- Monitor authentication logs for suspicious activity
- Set up proper CORS policies

## 7. Medical Professional Verification

The medical login system creates unverified accounts that require manual approval:

1. Medical professionals register with credentials
2. Accounts are created with `is_verified: false`
3. Admin reviews and verifies medical credentials
4. Update `is_verified: true` for approved accounts
5. Send login credentials to verified professionals

This ensures only legitimate medical professionals get priority access to emergency delivery services.