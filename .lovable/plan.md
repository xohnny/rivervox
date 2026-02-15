

# Full CMS: Edit All Website Content from Admin Panel

This is a large project that will turn your admin panel into a WordPress-like CMS where you can edit every piece of content on your website without touching code. We'll build this in phases, starting with the most impactful sections.

---

## How It Works

All website content (text, images, links) is currently hardcoded in the code. We'll move it into the database so the admin panel can read and update it. Every frontend page will then fetch its content from the database instead of using hardcoded values.

---

## Phase 1 -- Homepage Content Manager

A new **"Pages"** section in the admin sidebar where you can edit:

- **Hero Section**: Title, subtitle, badge text (e.g. "New Collection 2026"), button labels, button links, and background image (upload)
- **Features Bar**: The 4 feature items (icon selection, title, description)
- **Categories Section**: Section title, subtitle, and each category's name, description, and image (upload)
- **Testimonials Section**: Section title, subtitle (reviews are already database-driven)

---

## Phase 2 -- Footer and Header Content

- **Footer**: Brand description, social media links (Instagram, Facebook, Twitter, YouTube, Telegram), contact info (address, phone, email), quick links, and copyright text
- **Header**: Logo text/image, navigation links

---

## Phase 3 -- Static Pages Content

Editable content for all informational pages:
- **Contact Page**: Address, phone, email, heading text, description
- **FAQ Page**: Add/edit/delete FAQ categories and questions
- **Shipping Policy**: Full rich-text content
- **Returns & Exchanges**: Full rich-text content
- **Privacy Policy**: Full rich-text content
- **Terms of Service**: Full rich-text content
- **Size Guide**: Full content

---

## Phase 4 -- SEO Settings per Page

- Edit meta title, meta description, and keywords for every page from the admin panel
- Open Graph image upload per page

---

## Technical Details

### Database Changes

A new `site_content` table to store all editable content:

```text
site_content
-----------
id          (uuid, primary key)
page        (text)          -- e.g. 'home', 'footer', 'contact', 'faq'
section     (text)          -- e.g. 'hero', 'features', 'categories'
content     (jsonb)         -- flexible JSON for any content structure
updated_at  (timestamptz)
updated_by  (uuid, nullable)
```

RLS: Admins can read/update. Public can read (since frontend pages need the content).

### Admin UI

- New **"Pages"** link in admin sidebar with sub-sections for each page
- Each section gets a form with the right input types (text fields, image uploaders, link pickers, rich text for policy pages)
- Live preview button to see changes before saving

### Frontend Changes

- A `useSiteContent(page, section)` hook that fetches content from the database with caching
- Each component (Hero, Footer, Categories, etc.) will use this hook instead of hardcoded values
- Fallback to current hardcoded defaults if no database content exists (so nothing breaks)

### Implementation Order

1. Create `site_content` table + RLS policies + seed with current hardcoded content
2. Build the `useSiteContent` hook with React Query caching
3. Build admin "Pages" editor UI (starting with Homepage sections)
4. Update frontend components to use database content
5. Repeat for Footer, Header, Contact, FAQ, and all static pages
6. Add SEO settings editor

---

## Important Notes

- This is a **very large feature** -- I recommend we build it **one phase at a time** so we can test each part properly
- All existing content will be seeded as defaults, so nothing changes visually until you edit it in the admin panel
- Image uploads will use the existing `store-assets` storage bucket
- Shall I start with **Phase 1 (Homepage Content Manager)**?

