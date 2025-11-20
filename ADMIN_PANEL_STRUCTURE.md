# Admin Panel Structure & Pages

## Overview
Complete admin panel structure to manage all orders, custom plans, meetings, users, and analytics for BuyEcomAds platform.

---

## ADMIN PANEL ROUTE STRUCTURE

```
/admin
├── /dashboard              # Main dashboard (overview)
├── /orders                # All orders management
│   ├── /standard          # Standard plan orders
│   ├── /custom            # Custom plan requests
│   └── /[orderId]         # Individual order details
├── /meetings              # Meeting management
│   ├── /upcoming          # Upcoming meetings
│   ├── /past              # Past meetings
│   └── /[meetingId]       # Meeting details
├── /customers             # Customer management
│   ├── /[customerId]      # Customer profile
│   └── /[customerId]/orders  # Customer's orders
├── /ads                   # Ad delivery management
│   ├── /pending           # Pending deliveries
│   ├── /in-progress       # In progress
│   ├── /completed         # Completed deliveries
│   └── /[adId]            # Individual ad details
├── /analytics             # Analytics & reports
│   ├── /overview          # Overview stats
│   ├── /revenue           # Revenue reports
│   └── /performance       # Performance metrics
├── /settings              # Admin settings
│   ├── /profile           # Admin profile
│   ├── /calendar          # Calendar settings
│   └── /email             # Email templates
└── /login                 # Admin login
```

---

## PAGE 1: DASHBOARD (/admin/dashboard)

### Purpose
Main overview page showing key metrics and recent activity.

### Data to Display

#### 1. Key Metrics Cards
- **Total Orders** (this month)
  - Standard orders count
  - Custom plan requests count
- **Revenue** (this month)
  - Total revenue
  - Revenue growth % vs last month
- **Pending Deliveries**
  - Count of ads pending delivery
  - Overdue count (if any)
- **Upcoming Meetings** (next 7 days)
  - Count of scheduled meetings
  - Today's meetings count

#### 2. Recent Activity Feed
- Latest orders (last 10)
  - Order ID, Customer name, Plan type, Status, Date
- Recent custom plan requests (last 5)
  - Request ID, Customer name, Number of ads, Status, Date
- Upcoming meetings (next 5)
  - Meeting date/time, Customer name, Meeting type, Status

#### 3. Charts/Graphs
- **Orders Over Time** (line chart)
  - Last 30 days order volume
  - Standard vs Custom breakdown
- **Revenue Trend** (line chart)
  - Last 30 days revenue
- **Order Status Distribution** (pie chart)
  - Pending, In Progress, Completed, Cancelled
- **Ad Type Distribution** (bar chart)
  - Image ads vs Video ads

#### 4. Quick Actions
- Create new order manually
- Schedule meeting
- View all pending deliveries
- Export reports

---

## PAGE 2: STANDARD ORDERS (/admin/orders/standard)

### Purpose
Manage all standard plan orders (5, 10, 20 ads packages).

### Data to Display

#### Table Columns
- **Order ID** (clickable to view details)
- **Customer Name**
- **Email**
- **Company**
- **Plan Type** (e.g., "5 Image Ads", "10 Video Ads")
- **Ad Type** (Image/Video)
- **Price**
- **Status** (Pending, In Progress, Completed, Cancelled)
- **Order Date**
- **Delivery Deadline**
- **Actions** (View, Edit, Update Status, Delete)

#### Filters
- Status filter (All, Pending, In Progress, Completed, Cancelled)
- Ad Type filter (All, Image, Video)
- Date range filter
- Search by customer name/email/order ID

#### Order Details (when clicked)
- **Customer Information**
  - Full name, Email, Contact, Company
- **Order Information**
  - Order ID, Plan name, Price, Status, Order date
  - Delivery deadline, Days remaining
- **Ad Requirements**
  - Image dimensions (if image)
  - Brand assets link
  - General instructions
  - Number of ads requested
- **Individual Ad Details** (for each ad in order)
  - Ad #1, #2, #3, etc.
  - Reference image/video URL
  - Product page URL
  - Specific instructions for this ad
  - Status (Not Started, In Progress, Completed, Delivered)
- **Delivery Information**
  - Delivered ads count / Total ads
  - Delivery links/files
  - Delivery date
- **Notes & Comments**
  - Internal admin notes
  - Customer communication history
- **Actions**
  - Update order status
  - Mark ads as completed
  - Upload delivery files
  - Send email to customer
  - Add internal notes

---

## PAGE 3: CUSTOM PLAN REQUESTS (/admin/orders/custom)

### Purpose
Manage custom plan requests (e.g., 45 ads in 1 week).

### Data to Display

#### Table Columns
- **Request ID** (clickable)
- **Customer Name**
- **Email**
- **Company**
- **Number of Ads** (e.g., 45)
- **Ad Type** (Image/Video)
- **Delivery Timeline** (e.g., "1 week")
- **Budget Range**
- **Status** (New, Under Review, Approved, Rejected, In Progress, Completed)
- **Request Date**
- **Actions** (View, Approve, Reject, Start Work)

#### Filters
- Status filter
- Ad Type filter
- Date range filter
- Search functionality

#### Custom Plan Details (when clicked)
- **Customer Information**
  - Full name, Email, Contact, Company
- **Custom Plan Details**
  - Request ID, Number of ads/videos
  - Ad type (Image/Video)
  - Delivery timeline
  - Custom delivery date (if specified)
  - Budget range
  - Special requirements
- **Meeting Information** (if meeting scheduled)
  - Meeting date & time
  - Timezone
  - Meeting link (Google Meet/Zoom)
  - Meeting status (Scheduled, Completed, Cancelled)
  - Meeting notes
- **Order Status**
  - Current status
  - Approval/rejection reason
  - Assigned team member
- **Ad Requirements** (if approved)
  - Brand assets link
  - General instructions
  - Special requirements
- **Delivery Progress**
  - Completed ads / Total ads
  - Delivery files/links
- **Actions**
  - Approve request
  - Reject request (with reason)
  - Convert to order
  - Schedule/reschedule meeting
  - Update status
  - Upload delivery files
  - Add notes

---

## PAGE 4: MEETINGS (/admin/meetings)

### Purpose
Manage all scheduled meetings with customers.

### Sub-pages:
- **Upcoming** (/admin/meetings/upcoming)
- **Past** (/admin/meetings/past)
- **All** (/admin/meetings)

### Data to Display

#### Table Columns (Upcoming)
- **Meeting ID**
- **Customer Name**
- **Email**
- **Company**
- **Meeting Date & Time**
- **Timezone**
- **Meeting Type** (Custom Plan Discussion, Follow-up, etc.)
- **Status** (Scheduled, Confirmed, Rescheduled, Cancelled)
- **Calendar Link**
- **Actions** (View, Reschedule, Cancel, Join Meeting)

#### Table Columns (Past)
- Same as above plus:
- **Meeting Duration**
- **Meeting Notes**
- **Follow-up Required** (Yes/No)

#### Meeting Details (when clicked)
- **Customer Information**
  - Name, Email, Contact, Company
- **Meeting Information**
  - Meeting ID, Date & time, Timezone
  - Meeting type, Status
  - Calendar event link
  - Video call link (Google Meet/Zoom)
- **Related Order/Request**
  - Linked order ID or custom plan request ID
  - Quick link to order details
- **Meeting Notes**
  - Pre-meeting notes
  - Post-meeting notes
  - Action items
  - Next steps
- **Attendees**
  - Customer email
  - Admin/team member emails
- **Actions**
  - Reschedule meeting
  - Cancel meeting
  - Send reminder email
  - Add meeting notes
  - Create follow-up meeting
  - Mark as completed

#### Calendar View (Optional)
- Monthly/weekly calendar view
- Color-coded by meeting type
- Click to view meeting details

---

## PAGE 5: CUSTOMERS (/admin/customers)

### Purpose
Manage all customers and their order history.

### Data to Display

#### Table Columns
- **Customer ID**
- **Name**
- **Email**
- **Contact Number**
- **Company**
- **Total Orders**
- **Total Spent**
- **Last Order Date**
- **Status** (Active, Inactive)
- **Actions** (View Profile, View Orders, Contact)

#### Filters
- Search by name/email/company
- Filter by status
- Sort by total spent, last order date

#### Customer Profile (when clicked)
- **Personal Information**
  - Full name, Email, Contact, Company
  - Registration date
  - Customer since
- **Order History**
  - List of all orders (standard + custom)
  - Order ID, Date, Plan type, Status, Amount
  - Click to view order details
- **Meeting History**
  - Past meetings
  - Upcoming meetings
- **Statistics**
  - Total orders count
  - Total revenue from customer
  - Average order value
  - Preferred ad type (Image/Video)
- **Notes**
  - Internal notes about customer
  - Communication history
- **Actions**
  - Create new order for customer
  - Schedule meeting
  - Send email
  - Add notes
  - View all orders

---

## PAGE 6: AD DELIVERY MANAGEMENT (/admin/ads)

### Purpose
Track and manage ad creation and delivery status.

### Sub-pages:
- **Pending** (/admin/ads/pending)
- **In Progress** (/admin/ads/in-progress)
- **Completed** (/admin/ads/completed)
- **All** (/admin/ads)

### Data to Display

#### Table Columns
- **Ad ID**
- **Order ID** (link to order)
- **Customer Name**
- **Ad Type** (Image/Video)
- **Ad Number** (e.g., Ad #1 of 10)
- **Status** (Pending, In Progress, Review, Completed, Delivered)
- **Assigned To** (Team member)
- **Due Date**
- **Completion Date**
- **Actions** (View, Update Status, Upload, Deliver)

#### Filters
- Status filter
- Ad type filter
- Assigned to filter
- Date range filter
- Search by order ID/customer

#### Ad Details (when clicked)
- **Order Information**
  - Order ID, Customer name, Plan type
- **Ad Information**
  - Ad ID, Ad number (e.g., #3 of 10)
  - Ad type, Status
  - Reference image/video URL
  - Product page URL
  - Specific instructions
- **Delivery Information**
  - Delivery file/link
  - Delivery date
  - Delivery method
- **Work Progress**
  - Assigned team member
  - Work started date
  - Estimated completion
  - Actual completion date
- **Review & Approval**
  - Review status
  - Reviewer notes
  - Approval status
- **Actions**
  - Update status
  - Assign to team member
  - Upload work file
  - Mark as completed
  - Deliver to customer
  - Add notes

---

## PAGE 7: ANALYTICS (/admin/analytics)

### Purpose
View business analytics, reports, and insights.

### Sub-pages:
- **Overview** (/admin/analytics/overview)
- **Revenue** (/admin/analytics/revenue)
- **Performance** (/admin/analytics/performance)

### Overview Page Data

#### 1. Key Performance Indicators
- **Total Revenue** (all time, this month, this year)
- **Total Orders** (all time, this month)
- **Average Order Value**
- **Customer Count**
- **Completion Rate** (% of orders completed on time)
- **Customer Satisfaction** (if ratings collected)

#### 2. Revenue Charts
- **Revenue Over Time** (line chart)
  - Daily, Weekly, Monthly views
  - Last 30 days, 3 months, 1 year
- **Revenue by Plan Type** (bar chart)
  - Standard plans breakdown
  - Custom plans
- **Revenue by Ad Type** (pie chart)
  - Image ads revenue
  - Video ads revenue

#### 3. Order Analytics
- **Orders Over Time** (line chart)
- **Orders by Status** (pie chart)
- **Orders by Plan Type** (bar chart)
- **Average Delivery Time** (metric)

#### 4. Customer Analytics
- **New Customers Over Time** (line chart)
- **Customer Lifetime Value** (metric)
- **Repeat Customer Rate** (percentage)
- **Top Customers** (table)
  - Customer name, Total orders, Total spent

#### 5. Team Performance (if multiple team members)
- **Ads Completed by Team Member** (bar chart)
- **Average Completion Time by Team Member**
- **Workload Distribution**

### Revenue Page Data
- Detailed revenue breakdown
- Export revenue reports (CSV, PDF)
- Revenue by date range
- Revenue forecasts

### Performance Page Data
- Delivery time metrics
- On-time delivery rate
- Quality metrics
- Customer feedback analysis

---

## PAGE 8: SETTINGS (/admin/settings)

### Purpose
Admin account settings and system configuration.

### Sub-pages:

#### A. Profile (/admin/settings/profile)
- Admin name, email, password
- Profile picture
- Notification preferences

#### B. Calendar (/admin/settings/calendar)
- Google Calendar integration
- Default meeting duration
- Available time slots
- Timezone settings
- Calendar sync settings

#### C. Email Templates (/admin/settings/email)
- View/edit email templates:
  - Order confirmation
  - Custom plan request received
  - Meeting scheduled
  - Delivery notification
  - Follow-up emails
- Preview templates
- Test email sending

#### D. Pricing (/admin/settings/pricing)
- Manage standard plan prices
- Update pricing for:
  - Image ads (5, 10, 20)
  - Video ads (1, 10, 20)
- Set custom plan base rates

#### E. Team Management (/admin/settings/team)
- Add/edit team members
- Assign roles/permissions
- View team workload

#### F. General Settings (/admin/settings/general)
- Company information
- Business hours
- Default delivery timelines
- System preferences

---

## PAGE 9: ADMIN LOGIN (/admin/login)

### Purpose
Secure admin authentication.

### Features
- Email/password login
- Remember me option
- Forgot password
- Two-factor authentication (optional)
- Session management

---

## DATABASE SCHEMA FOR ADMIN PANEL

### Tables Needed

```sql
-- Orders (Standard Plans)
orders (
  id, customer_id, plan_type, plan_name, plan_price,
  ad_type, number_of_ads, image_dimensions,
  brand_assets_link, general_instructions,
  status, order_date, delivery_deadline, completed_date,
  created_at, updated_at
)

-- Order Items (Individual Ads)
order_items (
  id, order_id, ad_number, reference_url, product_page_url,
  specific_instructions, status, assigned_to,
  delivery_file, delivery_date, created_at, updated_at
)

-- Custom Plan Requests
custom_plans (
  id, customer_id, number_of_ads, ad_type,
  delivery_timeline, custom_delivery_date, budget_range,
  special_requirements, status, approval_date, rejection_reason,
  created_at, updated_at
)

-- Meetings
meetings (
  id, customer_id, order_id, custom_plan_id,
  scheduled_date, scheduled_time, timezone,
  meeting_type, status, calendar_event_id,
  meeting_link, meeting_notes, created_at, updated_at
)

-- Customers
customers (
  id, name, email, contact, company,
  total_orders, total_spent, status,
  created_at, updated_at
)

-- Ad Deliveries
ad_deliveries (
  id, order_item_id, delivery_file_url,
  delivery_method, delivery_date, status,
  created_at
)

-- Admin Users
admin_users (
  id, name, email, password_hash, role,
  permissions, last_login, created_at
)

-- Internal Notes
notes (
  id, entity_type, entity_id, admin_user_id,
  note_text, created_at
)

-- Email Logs
email_logs (
  id, recipient, subject, template, sent_at,
  status, error_message
)
```

---

## ADMIN PANEL FEATURES SUMMARY

### Core Features
1. ✅ View all orders (standard + custom)
2. ✅ Manage order status
3. ✅ Track ad delivery progress
4. ✅ Manage meetings
5. ✅ View customer profiles
6. ✅ Analytics and reports
7. ✅ Email notifications
8. ✅ Calendar integration

### Advanced Features
1. ✅ Bulk actions (update multiple orders)
2. ✅ Export data (CSV, PDF)
3. ✅ Search and filters
4. ✅ Real-time notifications
5. ✅ File upload/download
6. ✅ Internal notes system
7. ✅ Team assignment
8. ✅ Role-based permissions

---

## IMPLEMENTATION PRIORITY

### Phase 1 (Essential)
1. Admin login
2. Dashboard
3. Standard orders management
4. Custom plan requests
5. Basic customer view

### Phase 2 (Important)
1. Meetings management
2. Ad delivery tracking
3. Email notifications
4. Calendar integration

### Phase 3 (Enhancement)
1. Analytics dashboard
2. Advanced reporting
3. Team management
4. Settings pages

---

## TECHNOLOGY STACK SUGGESTIONS

### Frontend
- Next.js App Router (same as main site)
- React components
- Tailwind CSS (consistent styling)
- React Query / SWR (data fetching)
- Recharts / Chart.js (analytics charts)
- React Table (data tables)
- React Date Picker (date selection)

### Backend
- Next.js API Routes
- Database (PostgreSQL/Supabase)
- Authentication (NextAuth.js / Clerk)
- File storage (AWS S3 / Cloudinary)
- Email service (Resend / SendGrid)

### Additional
- Admin UI library (shadcn/ui / Ant Design)
- Form handling (React Hook Form)
- Validation (Zod)
- State management (Zustand / Context API)

---

This admin panel structure provides complete management capabilities for all aspects of the BuyEcomAds platform.

