

# Phase 2: Footer and Header Content Management

Make the Footer and Header fully editable from the admin panel, following the same patterns established in Phase 1.

---

## What You'll Be Able to Edit

### Footer
- **Brand section**: Store name, brand description
- **Social media links**: Instagram, Facebook, Twitter, YouTube, Telegram URLs
- **Quick Links**: Add/edit/remove links (label + URL)
- **Customer Service Links**: Add/edit/remove links (label + URL)
- **Contact Info**: Address, phone number, email
- **Copyright text**

### Header
- **Logo text** (or logo image if uploaded in store settings)
- **Navigation links**: Add/edit/reorder links (label + URL)

---

## Technical Details

### 1. Seed Default Content into Database

Insert the current hardcoded Footer and Header content into the `site_content` table so edits can begin immediately:
- `page: 'layout', section: 'footer'` -- all footer content as JSON
- `page: 'layout', section: 'header'` -- navigation links and logo text as JSON

### 2. New Admin Editor Components

**FooterEditor** (`src/components/admin/cms/FooterEditor.tsx`)
- Brand name and description text fields
- Social media URL inputs (Instagram, Facebook, Twitter, YouTube, Telegram)
- Dynamic list editors for Quick Links and Customer Service Links (add/remove rows with label + path fields)
- Contact info fields (address, phone, email)
- Copyright text field

**HeaderEditor** (`src/components/admin/cms/HeaderEditor.tsx`)
- Logo text input
- Dynamic list editor for navigation links (add/remove/reorder rows with label + path)

### 3. Update AdminPages

Add two new tabs -- "Footer" and "Header" -- to the existing Pages editor at `/admin/pages`.

### 4. Update Frontend Components

**Footer.tsx**
- Use `useSiteContent('layout', 'footer', defaultFooter)` to fetch content
- Render all text, links, and social icons from database content
- Fall back to current hardcoded values if no database content exists

**Header.tsx**
- Use `useSiteContent('layout', 'header', defaultHeader)` to fetch navigation links and logo
- Render navigation dynamically from database content
- Fall back to current hardcoded values if no database content exists

### 5. Files Changed

| File | Action |
|------|--------|
| `src/components/admin/cms/FooterEditor.tsx` | Create |
| `src/components/admin/cms/HeaderEditor.tsx` | Create |
| `src/pages/admin/AdminPages.tsx` | Edit -- add Footer and Header tabs |
| `src/components/layout/Footer.tsx` | Edit -- use `useSiteContent` hook |
| `src/components/layout/Header.tsx` | Edit -- use `useSiteContent` hook |

No database schema changes needed -- the existing `site_content` table supports this. Content will be seeded via an insert operation.

