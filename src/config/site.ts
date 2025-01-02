type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export const siteConfig: SiteConfig = {
  name: "Takeout Threads",
  description:
    "Takeout Threads is a platform for screen printers and apparel providers to allow for full customization of their products, automated order processing, and order management.",
  url: baseUrl,
  ogImage: `${baseUrl}/open-graph.png`,
  links: {
    twitter: "https://twitter.com/treyhulse",
    github: "https://github.com/treyhulse",
  },
};
