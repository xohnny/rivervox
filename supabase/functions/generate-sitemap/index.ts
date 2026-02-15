import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = "https://rivervox.lovable.app";

// Map SEO page keys to URL paths, priorities, and change frequencies
const pageConfig: Record<string, { path: string; priority: string; changefreq: string }> = {
  home: { path: "/", priority: "1.0", changefreq: "weekly" },
  shop: { path: "/shop", priority: "0.9", changefreq: "daily" },
  contact: { path: "/contact", priority: "0.7", changefreq: "monthly" },
  faq: { path: "/faq", priority: "0.6", changefreq: "monthly" },
  "shipping-policy": { path: "/shipping-policy", priority: "0.5", changefreq: "monthly" },
  "returns-exchanges": { path: "/returns-exchanges", priority: "0.5", changefreq: "monthly" },
  "privacy-policy": { path: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
  "terms-of-service": { path: "/terms-of-service", priority: "0.3", changefreq: "yearly" },
  "size-guide": { path: "/size-guide", priority: "0.5", changefreq: "monthly" },
  tracking: { path: "/tracking", priority: "0.5", changefreq: "monthly" },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all SEO entries and their last updated times
    const { data: seoEntries } = await supabase
      .from("site_content")
      .select("section, updated_at")
      .eq("page", "seo");

    // Fetch active products for product pages
    const { data: products } = await supabase
      .from("products")
      .select("id, name, updated_at")
      .eq("is_active", true);

    const now = new Date().toISOString().split("T")[0];

    // Build page URLs from SEO entries
    const pageUrls = Object.entries(pageConfig).map(([key, config]) => {
      const entry = seoEntries?.find((e) => e.section === key);
      const lastmod = entry?.updated_at
        ? new Date(entry.updated_at).toISOString().split("T")[0]
        : now;
      return `  <url>
    <loc>${BASE_URL}${config.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>`;
    });

    // Add product detail pages
    const productUrls = (products || []).map((p) => {
      const lastmod = new Date(p.updated_at).toISOString().split("T")[0];
      return `  <url>
    <loc>${BASE_URL}/product/${p.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...pageUrls, ...productUrls].join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response(`Error generating sitemap: ${error.message}`, {
      status: 500,
      headers: corsHeaders,
    });
  }
});
