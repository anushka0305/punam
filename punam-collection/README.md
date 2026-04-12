# Punam's Collection 🪷
Indian Heritage Saree E-commerce — Built Free

## ✅ Tech Stack (All Free)
| Service | Purpose | Cost |
|---|---|---|
| Vercel | Frontend hosting | Free |
| Supabase | Database + Auth + Storage | Free |
| Razorpay | Payments | Free (2% per txn) |
| WhatsApp | Order notifications | Free |

---

## 🚀 Setup Guide

### Step 1: Supabase Setup
1. Go to [supabase.com](https://supabase.com) → Create account → New Project
2. Wait for project to be ready (~2 mins)
3. Go to **SQL Editor** → paste the entire `supabase-setup.sql` file → Run
4. Go to **Storage** → Create new bucket → Name it `product-images` → Make it **Public**
5. Get your credentials: **Settings → API**
   - Copy `Project URL` → this is your `VITE_SUPABASE_URL`
   - Copy `anon/public` key → this is your `VITE_SUPABASE_ANON_KEY`

### Step 2: Create Admin User in Supabase
1. Go to **Authentication → Users → Add User**
2. Email: `admin@punam.com` (or your preferred admin email)
3. Password: set a strong password
4. This will be your admin login

### Step 3: Razorpay Setup (optional, for online payments)
1. Go to [razorpay.com](https://razorpay.com) → Create free account
2. Complete KYC (required for live payments)
3. Dashboard → Settings → API Keys → Generate Test Key
4. Copy the **Key ID** (starts with `rzp_test_...`)
5. If you skip this, orders will be placed as Cash on Delivery

### Step 4: Deploy on Vercel
1. Push this project to GitHub (new repo)
2. Go to [vercel.com](https://vercel.com) → Add New Project → Import repo
3. **Root Directory**: leave empty (project is at root)
4. **Framework**: Vite
5. Add these **Environment Variables**:
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key
   VITE_RAZORPAY_KEY_ID = rzp_test_xxxx (optional)
   VITE_WHATSAPP_NUMBER = 917588544136 (your number with country code)
   VITE_ADMIN_EMAIL = admin@punam.com
   ```
6. Click **Deploy** ✅

---

## 📱 Features
- ✅ Beautiful Indian heritage UI (maroon, gold, cream)
- ✅ Shop with saree type filters
- ✅ Cart with slide-over panel
- ✅ Wishlist
- ✅ User signup/login (name, phone, address)
- ✅ My Orders page
- ✅ Admin dashboard (add/edit/delete products)
- ✅ Admin order management with status updates
- ✅ Custom saree categories
- ✅ Product image upload
- ✅ Discount support
- ✅ Featured products on home page
- ✅ Razorpay payment / COD fallback
- ✅ WhatsApp floating button
- ✅ WhatsApp order notification to owner
- ✅ Customer reviews page

## 🔑 Admin Access
- URL: `yoursite.vercel.app/admin`
- Email: `admin@punam.com` (set in Supabase)
- Password: what you set in Supabase Auth

## 📦 How to Add Products
1. Login to `/admin` with your admin credentials
2. Click **Add Product**
3. Upload image, fill name, type, price, discount
4. Toggle **Featured** to show on homepage
5. Click Save ✅

## 💳 Payment Flow
1. Customer fills delivery address
2. If Razorpay key is set → Razorpay popup opens → customer pays online
3. If no Razorpay key → order placed as COD
4. After order → WhatsApp opens with order details pre-filled
5. Owner receives the order info on WhatsApp

## 🔧 Local Development
```bash
npm install
cp .env.example .env.local
# Fill in your Supabase keys in .env.local
npm run dev
```
