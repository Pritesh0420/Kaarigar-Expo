import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/events", "/events/", "/kaarigars", "/about", "/contact"],
        disallow: ["/admin/", "/visitor/", "/kaarigar/", "/api/", "/login", "/register"],
      },
    ],
    sitemap: "https://kaarigarexpo.in/sitemap.xml",
  };
}
