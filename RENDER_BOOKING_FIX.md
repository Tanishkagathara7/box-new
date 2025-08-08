# 🔧 Booking Issue Fix - Render Backend

## 🔍 **Problem Identified**

Your booking works locally with `npm run dev` but fails when using the Render backend because:

1. **Local Development**: Uses `VITE_API_URL=http://localhost:3001/api` (both frontend & backend local)
2. **Render Backend**: Your local frontend still tries to connect to `localhost:3001` instead of Render

## ✅ **Solutions**

### **Option 1: Quick Test (Frontend with Render Backend)**

Run this command to test your frontend locally with the Render backend:

```bash
npm run test:with-render
```

This will:
- ✅ Start your frontend on `http://localhost:8080`
- ✅ Connect to Render backend at `https://box-new.onrender.com`
- ✅ Test the full booking flow including payments

### **Option 2: Manual Environment Switch**

1. **Edit your `.env.local` file** (already created) to use Render backend:
```bash
VITE_API_URL=https://box-new.onrender.com/api
```

2. **Start frontend only**:
```bash
npm run dev:render
```

### **Option 3: Direct Render Connection**

Temporarily modify your `.env` file:

```bash
# Comment out local API URL
# VITE_API_URL=http://localhost:3001/api

# Use Render backend
VITE_API_URL=https://box-new.onrender.com/api
```

Then run:
```bash
npm run dev:frontend
```

## 🧪 **Testing Steps**

### **1. Verify Backend is Running**
```bash
# Test health endpoint
curl https://box-new.onrender.com/api/health

# Test Cashfree connection
curl https://box-new.onrender.com/api/payments/test-cashfree
```

### **2. Test Booking Flow**

1. **Start Frontend**: `npm run test:with-render`
2. **Open**: `http://localhost:8080`
3. **Register/Login**: Create account or login
4. **Browse Grounds**: Select a ground
5. **Create Booking**: Fill in details and submit
6. **Make Payment**: Click "Pay Now" and complete Cashfree payment
7. **Verify**: Check booking confirmation

## 🔍 **Debugging Checklist**

### **Frontend Issues**
- [ ] Check browser console for API errors
- [ ] Verify `VITE_API_URL` is pointing to Render
- [ ] Check Network tab for failed requests
- [ ] Ensure CORS is working (no CORS errors)

### **Backend Issues**
- [ ] Backend health: `https://box-new.onrender.com/api/health`
- [ ] Cashfree test: `https://box-new.onrender.com/api/payments/test-cashfree`
- [ ] Database connection (MongoDB Atlas)
- [ ] Environment variables on Render

### **Payment Issues**
- [ ] Cashfree credentials are set on Render
- [ ] Payment gateway is in correct mode (sandbox/production)
- [ ] Frontend can create payment orders
- [ ] Cashfree SDK loads properly

## 🚨 **Common Issues & Fixes**

### **1. CORS Errors**
```
Access to XMLHttpRequest at 'https://box-new.onrender.com/api/...' from origin 'http://localhost:8080' has been blocked by CORS
```

**Fix**: Your Render backend already has CORS configured for localhost:8080, so this shouldn't happen. If it does, check the server logs.

### **2. API Connection Timeout**
```
Error: Network Error / Timeout
```

**Fix**: 
- Render free tier may have cold starts (first request takes ~30s)
- Wait for backend to wake up
- Check Render service status

### **3. Payment Gateway Errors**
```
Cashfree credentials not configured
```

**Fix**: 
- Verify environment variables on Render
- Check Cashfree dashboard
- Use production credentials for production mode

### **4. Database Connection Errors**
```
MongoDB connection failed
```

**Fix**:
- Check MongoDB Atlas whitelist (should allow 0.0.0.0/0)
- Verify connection string
- Check database user permissions

## 📋 **Environment Configuration**

### **Local Development (Both Local)**
```bash
# .env file
VITE_API_URL=http://localhost:3001/api
```
```bash
npm run dev
```

### **Local Frontend + Render Backend**
```bash
# .env.local file (already created)
VITE_API_URL=https://box-new.onrender.com/api
```
```bash
npm run test:with-render
```

### **Full Production (Netlify + Render)**
```bash
# .env.production file (already configured)
VITE_API_URL=https://box-new.onrender.com/api
FRONTEND_URL=https://boxcric.netlify.app
```

## 🎯 **Next Steps**

1. **Test Now**: Run `npm run test:with-render`
2. **Complete Booking**: Try the full booking + payment flow
3. **Debug Issues**: Use browser dev tools if issues arise
4. **Deploy Frontend**: Once working, deploy frontend to Netlify
5. **Production Test**: Test the full production setup

## 📞 **If You Still Have Issues**

1. **Check Render Logs**: Go to your Render dashboard and check server logs
2. **Browser Console**: Check for JavaScript errors
3. **Network Tab**: Look for failed API calls
4. **API Health**: Test `https://box-new.onrender.com/api/health`

## ✅ **Expected Results**

After running `npm run test:with-render`, you should be able to:
- ✅ Browse grounds
- ✅ Create bookings
- ✅ Process payments through Cashfree
- ✅ Receive booking confirmations
- ✅ See real-time updates

The booking functionality should work exactly the same as when running `npm run dev` locally, but now using your deployed Render backend!
