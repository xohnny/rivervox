
## Fix: Icon placement in order status dropdown

**Problem:** The `SelectTrigger` component applies `[&>span]:line-clamp-1` to all direct child `<span>` elements. The `line-clamp-1` utility sets `display: -webkit-box` and `-webkit-box-orient: vertical`, which overrides your `inline-flex` and causes the icon to stack above the text.

**Solution:** Wrap the icon and label inside a `<div>` instead of a `<span>`, so it won't be affected by the `[&>span]:line-clamp-1` selector. The `<div>` will use `flex items-center gap-1.5` to keep the icon to the left of the text.

### Changes

**File: `src/pages/admin/AdminOrders.tsx`**

In the orders table status column (around line 161-166), change the inner `<span>` wrapper to a `<div>`:

```tsx
// Before
<SelectTrigger className={cn('w-[140px] h-8', statusConfig.triggerColor)}>
  <span className="inline-flex items-center gap-1.5 text-xs font-medium">
    <statusConfig.icon className="w-3 h-3 flex-shrink-0" />
    <span>{statusConfig.label}</span>
  </span>
</SelectTrigger>

// After
<SelectTrigger className={cn('w-[140px] h-8', statusConfig.triggerColor)}>
  <div className="inline-flex items-center gap-1.5 text-xs font-medium">
    <statusConfig.icon className="w-3 h-3 flex-shrink-0" />
    <span>{statusConfig.label}</span>
  </div>
</SelectTrigger>
```

This single-line change (replacing `<span>` with `<div>`) prevents the `line-clamp-1` style from interfering with the flex layout, placing the icon correctly to the left.
