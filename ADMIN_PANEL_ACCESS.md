# How to Access Admin Panel

## Step-by-Step Guide

### 1. **Start Your Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Make sure your backend is running on `http://localhost:7050`

### 2. **Start Your Frontend Server**
   ```bash
   cd ui
   npm run dev
   ```
   Your frontend will run on `http://localhost:3000` (or next available port)

### 3. **Access Admin Login Page**
   Open your browser and go to:
   ```
   http://localhost:3000/admin/login
   ```

### 4. **Login with Admin Credentials**
   You need to have an admin user created in your database. If you don't have one:
   
   **Option A: Create Admin via Backend API**
   ```bash
   # Using curl or Postman
   POST http://localhost:7050/sisyphus/project5/api/admin/create
   Headers: 
     x-auth-token: <existing-admin-token>
     Content-Type: application/json
   Body:
   {
     "fullname": "Admin User",
     "email": "admin@example.com",
     "password": "yourpassword",
     "role": "admin"
   }
   ```

   **Option B: Create Admin via MongoDB directly**
   - Connect to your MongoDB database
   - Insert a user document with `role: "admin"` in the users collection

### 5. **Login Credentials**
   - **Email**: The email of your admin user
   - **Password**: The password you set for the admin user

### 6. **After Login**
   Once logged in, you'll be redirected to:
   ```
   http://localhost:3000/admin
   ```
   This is the admin dashboard.

## Available Admin Pages

After logging in, you can access:

1. **Dashboard**: `/admin`
2. **Plans Management**: `/admin/plans`
3. **Demo Content**: `/admin/demo-content` (to be created)
4. **Team Management**: `/admin/team` (to be created)
5. **Orders**: `/admin/orders` (to be created)
6. **Meetings**: `/admin/meetings` (to be created)

## Troubleshooting

### Issue: "Login failed" or "Unauthorized"
- **Check**: Make sure your backend server is running
- **Check**: Verify the API URL in `ui/global/server.js` matches your backend
- **Check**: Ensure the user has `role: "admin"` in the database

### Issue: Redirected to login page after login
- **Check**: Check browser console for errors
- **Check**: Verify the token is being stored in localStorage
- **Check**: Make sure the backend `/admin/profile` endpoint is working

### Issue: Cannot access admin pages
- **Check**: Make sure you're logged in as an admin (not a regular user)
- **Check**: Verify the token in localStorage has admin role

## Quick Test

1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Check localStorage for `authToken`
4. If token exists, you're logged in
5. If not, go to `/admin/login` and login

---

**Note**: Make sure your backend routes are properly registered and the admin authentication middleware is working correctly.

