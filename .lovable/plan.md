

## Fix: Admin Panel Loading Spinner on Every Page Navigation

### Problem
Every time you click a sidebar link in the admin panel, a loading spinner appears because each admin page independently checks your admin permissions by querying the database. This means navigating from Dashboard to Orders to Reviews (etc.) triggers a new database call each time, showing a spinner while it completes.

### Solution
Move the admin authentication check to the `AdminLayout` component (the parent wrapper) so it only runs once. All child pages will inherit the result instantly -- no more spinners when switching between admin pages.

### Technical Details

**1. Create an AdminAuthContext** (`src/context/AdminAuthContext.tsx`)
- A new context that holds the admin auth state (isAdmin, loading, user)
- This will be provided at the AdminLayout level so all child routes share the same auth state

**2. Update AdminLayout** (`src/components/admin/AdminLayout.tsx`)
- Import and use `useAdminAuth` here once
- Wrap the `<Outlet />` with the new `AdminAuthContext.Provider`
- Show the loading spinner and access-denied states at this level only

**3. Update all admin pages** to use the shared context instead of calling `useAdminAuth()` individually:
- `AdminDashboard.tsx` - remove `useAdminAuth`, use context
- `AdminProducts.tsx` - remove `useAdminAuth`, use context
- `AdminOrders.tsx` - remove `useAdminAuth`, use context
- `AdminInventory.tsx` - remove `useAdminAuth`, use context
- `AdminReviews.tsx` - remove `useAdminAuth`, use context

Pages that don't use `useAdminAuth` (AdminCustomers, AdminMessages, AdminSettings, AdminPages, AdminPriceUpdate) need no changes.

**4. Cache the admin auth query** using React Query in `useAdminAuth` with a `staleTime` so even if the hook is called again, it returns cached results instantly instead of re-fetching.

### Result
- Admin auth is checked once when you first enter `/admin`
- Navigating between admin sidebar pages will be instant with zero loading spinners
- The sidebar and layout remain visible throughout navigation

