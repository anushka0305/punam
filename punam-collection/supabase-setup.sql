-- ============================================
-- PUNAM'S COLLECTION - Supabase Setup Script
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. PROFILES (extends Supabase auth users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  address text,
  city text,
  pincode text,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 2. PRODUCTS
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null,
  price numeric(10,2) not null,
  discount integer default 0,
  description text,
  image_url text,
  in_stock boolean default true,
  featured boolean default false,
  created_at timestamptz default now()
);

-- 3. CATEGORIES (custom saree types)
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamptz default now()
);

-- 4. CART ITEMS
create table if not exists cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references products on delete cascade not null,
  quantity integer default 1,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- 5. WISHLIST ITEMS
create table if not exists wishlist_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references products on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- 6. ORDERS
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  items jsonb not null default '[]',
  total numeric(10,2) not null,
  status text default 'pending',
  payment_id text,
  shipping_address jsonb,
  created_at timestamptz default now()
);

-- 7. REVIEWS
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  comment text not null,
  rating integer default 5,
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table products enable row level security;
alter table categories enable row level security;
alter table cart_items enable row level security;
alter table wishlist_items enable row level security;
alter table orders enable row level security;
alter table reviews enable row level security;

-- PROFILES: users can read/edit own profile
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- PRODUCTS: anyone can read, only admin can write
create policy "Anyone can view products" on products for select using (true);
create policy "Admin can manage products" on products for all using (
  auth.email() = current_setting('app.admin_email', true)
);

-- CATEGORIES: anyone can read, admin can write
create policy "Anyone can view categories" on categories for select using (true);
create policy "Admin can manage categories" on categories for all using (
  auth.email() = current_setting('app.admin_email', true)
);

-- CART: users manage own cart
create policy "Users manage own cart" on cart_items for all using (auth.uid() = user_id);

-- WISHLIST: users manage own wishlist
create policy "Users manage own wishlist" on wishlist_items for all using (auth.uid() = user_id);

-- ORDERS: users see own orders, admin sees all
create policy "Users view own orders" on orders for select using (auth.uid() = user_id);
create policy "Users create orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admin view all orders" on orders for select using (
  auth.email() = current_setting('app.admin_email', true)
);
create policy "Admin update orders" on orders for update using (
  auth.email() = current_setting('app.admin_email', true)
);

-- REVIEWS: anyone can read and insert
create policy "Anyone can view reviews" on reviews for select using (true);
create policy "Anyone can add reviews" on reviews for insert with check (true);

-- ============================================
-- STORAGE BUCKET FOR PRODUCT IMAGES
-- ============================================
-- Run this in Supabase Dashboard → Storage → Create bucket named "product-images"
-- Set it as PUBLIC bucket

-- ============================================
-- SAMPLE DATA (optional - delete if not needed)
-- ============================================
insert into products (name, type, price, discount, description, featured, in_stock) values
  ('Kanchipuram Pure Silk - Red Gold', 'Kanchipuram Silk', 8500, 10, 'Traditional Kanchipuram pure silk saree with gold zari work. Perfect for weddings and festive occasions.', true, true),
  ('Maheshwari Cotton Silk - Ivory', 'Maheshwari', 3200, 0, 'Lightweight Maheshwari cotton silk with subtle checks. Ideal for daily wear and office.', true, true),
  ('Pochampally Ikat - Teal Blue', 'Pochampally Pure Silk', 5500, 15, 'Authentic Pochampally ikat with traditional geometric patterns in vibrant teal.', true, true),
  ('Chanderi Pure Silk - Blush Pink', 'Chanderi Silk', 4200, 0, 'Sheer Chanderi pure silk with delicate bootis. Perfect for summer occasions.', true, true)
on conflict do nothing;
