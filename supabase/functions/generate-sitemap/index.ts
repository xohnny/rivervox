import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = "https://rivervox.lovable.app";

// Fallback page config if DB has no sitemap settings
const fallbackPages = [
  { key: "home", path: "/", priority: "1.0", changefreq: "weekly", enabled: true },
  { key: "shop", path: "/shop", priority: "0.9", changefreq: "daily", enabled: true },
  { key: "contact", path: "/contact", priority: "0.7", changefreq: "monthly", enabled: true },
  { key: "faq", path: "/faq", priority: "0.6", changefreq: "monthly", enabled: true },
  { key: "shipping-policy", path: "/shipping-policy", priority: "0.5", changefreq: "monthly", enabled: true },
  { key: "returns-exchanges", path: "/returns-exchanges", priority: "0.5", changefreq: "monthly", enabled: true },
  { key: "privacy-policy", path: "/privacy-policy", priority: "0.3", changefreq: "yearly", enabled: true },
  { key: "terms-of-service", path: "/terms-of-service", priority: "0.3", changefreq: "yearly", enabled: true },
  { key: "size-guide", path: "/size-guide", priority: "0.5", changefreq: "monthly", enabled: true },
  { key: "tracking", path: "/tracking", priority: "0.5", changefreq: "monthly", enabled: true },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch sitemap config from DB
    const { data: sitemapData } = await supabase
      .from("site_content")
      .select("content")
      .eq("page", "config")
      .eq("section", "sitemap")
      .maybeSingle();

    const config = sitemapData?.content as {
      includeProducts?: boolean;
      productPriority?: string;
      productChangefreq?: string;
      pages?: typeof fallbackPages;
    } | null;

    const pages = config?.pages || fallbackPages;
    const includeProducts = config?.includeProducts !== false;
    const productPriority = config?.productPriority || "0.8";
    const productChangefreq = config?.productChangefreq || "weekly";

    // Fetch SEO entry timestamps for lastmod
    const { data: seoEntries } = await supabase
      .from("site_content")
      .select("section, updated_at")
      .eq("page", "seo");

    const now = new Date().toISOString().split("T")[0];

    // Build page URLs (only enabled pages)
    const pageUrls = pages
      .filter((p) => p.enabled)
      .map((p) => {
        const entry = seoEntries?.find((e) => e.section === p.key);
        const lastmod = entry?.updated_at
          ? new Date(entry.updated_at).toISOString().split("T")[0]
          : now;
        return `  <url>
    <loc>${BASE_URL}${p.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`;
      });

    // Add product detail pages
    let productUrls: string[] = [];
    if (includeProducts) {
      const { data: products } = await supabase
        .from("products")
        .select("id, updated_at")
        .eq("is_active", true);

      productUrls = (products || []).map((p) => {
        const lastmod = new Date(p.updated_at).toISOString().split("T")[0];
        return `  <url>
    <loc>${BASE_URL}/product/${p.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${productChangefreq}</changefreq>
    <priority>${productPriority}</priority>
  </url>`;
      });
    }

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
