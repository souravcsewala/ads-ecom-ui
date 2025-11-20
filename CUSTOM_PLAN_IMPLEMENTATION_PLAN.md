# Custom Plan & Meeting Integration Implementation Plan

## Overview
Add functionality for users to request custom plans (e.g., 45 ads/videos in one week) and schedule meetings via Google Calendar integration with admin email notifications.

---

## 1. CUSTOM PLAN FEATURE

### 1.1 UI Components to Add/Modify

#### A. PricingSection.jsx
- **Current State:** Has "Get Custom Quote" button that opens BuyFormModal
- **Changes Needed:**
  - Add a new section or modal option for "Custom Plan Request"
  - Add toggle/radio button: "Standard Plan" vs "Custom Plan"
  - When "Custom Plan" selected, show custom plan input fields

#### B. BuyFormModal.jsx
- **Current State:** 2-step form for standard plans
- **Changes Needed:**
  - Add Step 0 or separate flow for "Plan Type Selection"
  - Add new step for Custom Plan Details (if custom selected)
  - Custom Plan Fields:
    - Number of ads/videos needed (input field)
    - Delivery timeline (e.g., "1 week", "2 weeks", custom date)
    - Budget range (optional)
    - Special requirements (textarea)
    - Meeting preference checkbox: "I'd like to schedule a meeting"

### 1.2 Form Data Structure

```javascript
formData = {
  planType: 'standard' | 'custom', // NEW
  // Standard plan fields (existing)
  // ...
  
  // Custom plan fields (NEW)
  customPlan: {
    numberOfAds: null, // number
    adType: 'image' | 'video',
    deliveryTimeline: '', // e.g., "1 week", "2 weeks", "custom date"
    customDeliveryDate: null, // Date if custom timeline
    budgetRange: '', // optional
    specialRequirements: '',
    needsMeeting: false, // checkbox
  },
  
  // Meeting details (NEW)
  meeting: {
    preferredDate: null,
    preferredTime: null,
    timezone: '',
    meetingNotes: '',
  }
}
```

---

## 2. GOOGLE CALENDAR INTEGRATION

### 2.1 Integration Approach

#### Option A: Google Calendar API (Recommended)
- **Setup Required:**
  - Google Cloud Console project
  - OAuth 2.0 credentials
  - Google Calendar API enabled
  - Service account or OAuth flow

#### Option B: Google Calendar Link (Simpler)
- Generate Google Calendar event link with pre-filled details
- User clicks link to add to their calendar
- Admin receives email notification

#### Option C: Third-party Service
- Use services like Calendly, Cal.com, or similar
- Embed widget or redirect

### 2.2 Implementation Details (Option A - Full API)

**Backend Requirements:**
- Next.js API Route: `/api/calendar/create-event`
- Environment Variables:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_CALENDAR_ID` (admin's calendar)
  - `GOOGLE_REDIRECT_URI`

**Flow:**
1. User fills custom plan form
2. Checks "Schedule Meeting" checkbox
3. Selects preferred date/time
4. On form submit:
   - Create calendar event via Google Calendar API
   - Send email to admin with meeting details
   - Send confirmation email to user

**Calendar Event Details:**
- Title: "Custom Plan Meeting - [Company Name]"
- Description: Includes custom plan details, user info
- Attendees: User email + Admin email
- Duration: 30-60 minutes (configurable)
- Location: Video call link (Google Meet/Zoom)

---

## 3. EMAIL NOTIFICATION SYSTEM

### 3.1 Email Service Options

#### Option A: SendGrid
- **Setup:** API key, verified sender
- **Pros:** Reliable, good deliverability
- **Cons:** Requires account setup

#### Option B: Resend
- **Setup:** API key
- **Pros:** Modern, developer-friendly
- **Cons:** Newer service

#### Option C: Nodemailer with SMTP
- **Setup:** SMTP credentials (Gmail, etc.)
- **Pros:** Free, simple
- **Cons:** Rate limits, less reliable

#### Option D: Next.js API Route + Email Service
- Use serverless function
- Integrate with email service

### 3.2 Email Templates Needed

#### A. Admin Notification Email
**Subject:** New Custom Plan Request - [Company Name]

**Content:**
- User details (name, email, contact, company)
- Custom plan details:
  - Number of ads/videos
  - Delivery timeline
  - Budget range
  - Special requirements
- Meeting details (if scheduled):
  - Date & time
  - Calendar link
  - Meeting notes
- Action buttons:
  - View in dashboard (if admin panel exists)
  - Accept/Reject meeting

#### B. User Confirmation Email
**Subject:** Custom Plan Request Received - BuyEcomAds

**Content:**
- Thank you message
- Summary of custom plan request
- Meeting confirmation (if scheduled):
  - Date & time
  - Calendar link
  - Meeting details
- Next steps
- Contact information

---

## 4. BACKEND API ROUTES NEEDED

### 4.1 File Structure
```
app/
  api/
    custom-plan/
      route.js          # POST: Handle custom plan submission
    calendar/
      create-event/
        route.js        # POST: Create Google Calendar event
      auth/
        route.js        # GET: OAuth callback
    email/
      send/
        route.js        # POST: Send email notifications
```

### 4.2 API Endpoints

#### POST `/api/custom-plan`
**Request Body:**
```json
{
  "planType": "custom",
  "customPlan": {
    "numberOfAds": 45,
    "adType": "image",
    "deliveryTimeline": "1 week",
    "budgetRange": "₹50,000 - ₹75,000",
    "specialRequirements": "..."
  },
  "userInfo": {
    "name": "...",
    "email": "...",
    "contact": "...",
    "company": "..."
  },
  "needsMeeting": true,
  "meeting": {
    "preferredDate": "2024-01-15",
    "preferredTime": "14:00",
    "timezone": "IST",
    "meetingNotes": "..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "planId": "plan_123",
  "meetingId": "meet_456",
  "calendarLink": "https://calendar.google.com/..."
}
```

#### POST `/api/calendar/create-event`
**Request Body:**
```json
{
  "title": "Custom Plan Meeting",
  "description": "...",
  "startTime": "2024-01-15T14:00:00",
  "endTime": "2024-01-15T15:00:00",
  "attendees": ["user@email.com", "admin@buyecomads.com"],
  "timezone": "Asia/Kolkata"
}
```

#### POST `/api/email/send`
**Request Body:**
```json
{
  "to": "admin@buyecomads.com",
  "subject": "New Custom Plan Request",
  "template": "admin-notification",
  "data": { /* template data */ }
}
```

---

## 5. DATABASE CONSIDERATIONS (Optional)

### 5.1 If Adding Database

**Tables Needed:**
- `custom_plans`
  - id, user_id, plan_type, number_of_ads, ad_type, delivery_timeline, budget_range, special_requirements, status, created_at
- `meetings`
  - id, custom_plan_id, scheduled_date, scheduled_time, timezone, meeting_link, status, created_at
- `users` (if not using external auth)
  - id, name, email, contact, company, created_at

### 5.2 Database Options
- **Vercel Postgres** (if deploying on Vercel)
- **Supabase** (free tier available)
- **MongoDB Atlas** (NoSQL option)
- **PlanetScale** (MySQL, serverless)

---

## 6. UI/UX FLOW

### 6.1 User Journey

1. **User clicks "Get Custom Quote" or "Custom Plan"**
   - Opens BuyFormModal with plan type selection

2. **Plan Type Selection Screen**
   - Radio buttons: "Standard Plan" | "Custom Plan"
   - If Custom Plan selected → Show custom plan form

3. **Custom Plan Form (New Step)**
   - Number of ads/videos (number input)
   - Delivery timeline (dropdown: "1 week", "2 weeks", "Custom date")
   - If "Custom date" → Date picker appears
   - Budget range (optional text input)
   - Special requirements (textarea)
   - Checkbox: "Schedule a meeting to discuss details"

4. **Meeting Details (Conditional - if checkbox checked)**
   - Preferred date (date picker)
   - Preferred time (time picker)
   - Timezone (dropdown)
   - Meeting notes (textarea)

5. **Contact Information (Existing Step 2)**
   - Name, Email, Contact, Company, Notes

6. **Submit**
   - Show loading state
   - Create calendar event (if meeting requested)
   - Send emails (admin + user)
   - Show success message with meeting link

---

## 7. ENVIRONMENT VARIABLES NEEDED

```env
# Google Calendar
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALENDAR_ID=admin_calendar_id
GOOGLE_REDIRECT_URI=http://localhost:3000/api/calendar/auth/callback

# Email Service (example: Resend)
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=admin@buyecomads.com

# Optional: Database
DATABASE_URL=your_database_url
```

---

## 8. DEPENDENCIES TO ADD

```json
{
  "dependencies": {
    "googleapis": "^latest",           // Google Calendar API
    "resend": "^latest",                // Email service (or alternative)
    "date-fns": "^latest",              // Date manipulation
    "react-datepicker": "^latest",     // Date picker component
    "zod": "^latest"                    // Form validation (optional)
  }
}
```

---

## 9. IMPLEMENTATION PHASES

### Phase 1: Custom Plan Form UI
- Add plan type selection
- Add custom plan input fields
- Update form state management
- Add validation

### Phase 2: Meeting Scheduling UI
- Add meeting checkbox
- Add date/time pickers
- Add timezone selector
- Update form submission

### Phase 3: Backend API Setup
- Create API routes
- Set up Google Calendar API
- Set up email service
- Add environment variables

### Phase 4: Integration
- Connect frontend to backend
- Test calendar event creation
- Test email notifications
- Error handling

### Phase 5: Testing & Polish
- Test all flows
- Add loading states
- Add error messages
- Add success confirmations

---

## 10. SECURITY CONSIDERATIONS

1. **API Route Protection**
   - Rate limiting on form submissions
   - Input validation and sanitization
   - CSRF protection

2. **Google Calendar API**
   - Secure credential storage
   - Token refresh handling
   - Scope limitations

3. **Email**
   - Email validation
   - Spam prevention
   - Rate limiting

---

## 11. ERROR HANDLING

### Scenarios to Handle:
- Google Calendar API failure → Fallback to email-only
- Email service failure → Log error, show user message
- Invalid date/time → Validation errors
- Network errors → Retry mechanism
- Form validation errors → Inline error messages

---

## 12. SUCCESS METRICS

- Custom plan requests received
- Meeting scheduling success rate
- Email delivery rate
- User completion rate

---

## NEXT STEPS

1. Review and approve this plan
2. Choose email service provider
3. Set up Google Cloud Console project
4. Create API routes structure
5. Implement UI components
6. Test integration
7. Deploy and monitor

---

**Note:** This plan assumes no database initially. If database is needed, add Phase 0 for database setup.

