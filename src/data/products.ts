export interface Product {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  tagline: string;
  description: string;
  commission: string;
  commissionType: string;
  buyerIntent: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  cta: string;
  affiliateLink: string;
  features: string[];
}

export const products: Product[] = [
  {
    id: "systeme-io",
    name: "Systeme.io",
    category: "all-in-one-marketing",
    categoryName: "All-in-One Marketing",
    tagline: "All-in-one marketing platform for building landing pages, sales funnels, email automation, and courses.",
    description: "Systeme.io gives you every essential marketing tool in one place — landing pages, sales funnels, email marketing, course hosting, and automation. It offers a generous free plan and is designed for entrepreneurs who want simplicity without sacrificing power.",
    commission: "Up to 60%",
    commissionType: "Recurring (lifetime)",
    buyerIntent: "High",
    pros: [
      "Real free plan to start with no credit card",
      "Drag-and-drop funnel builder",
      "Built-in email marketing & automation",
      "Host and sell online courses",
      "Simpler interface than enterprise competitors",
      "Lifetime recurring affiliate commission"
    ],
    cons: [
      "Fewer advanced features than HubSpot for large teams",
      "Limited template design customization"
    ],
    bestFor: "Solo entrepreneurs and marketers wanting one affordable tool that does everything.",
    cta: "Start building your marketing funnels for free — upgrade when you're ready.",
    affiliateLink: "#",
    features: ["Landing Pages", "Sales Funnels", "Email Marketing", "Course Hosting", "Automation", "Blogging"]
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "crm-automation",
    categoryName: "CRM & Marketing Automation",
    tagline: "CRM and marketing automation platform for serious businesses ready to scale.",
    description: "HubSpot is a comprehensive CRM and marketing automation platform trusted by over 200,000 businesses worldwide. It combines sales, marketing, and customer service tools into one powerful ecosystem with deep analytics and hundreds of integrations.",
    commission: "Up to 30%",
    commissionType: "Recurring (up to 1 year)",
    buyerIntent: "High",
    pros: [
      "Powerful free CRM with no time limit",
      "Advanced marketing and sales automation",
      "Deep analytics and custom reporting",
      "Integrates with 1,000+ tools",
      "Massive trusted ecosystem and community"
    ],
    cons: [
      "Gets expensive quickly on paid tiers",
      "Steeper learning curve for beginners"
    ],
    bestFor: "Small to medium businesses wanting a professional, integrated growth system.",
    cta: "Get started with HubSpot's free CRM and scale when you need more power.",
    affiliateLink: "#",
    features: ["CRM", "Marketing Automation", "Sales Pipeline", "Analytics", "Integrations", "Customer Service"]
  },
  {
    id: "coursera",
    name: "Coursera",
    category: "learning-platforms",
    categoryName: "Learning & Courses",
    tagline: "World-class courses and certifications from top universities and companies.",
    description: "Coursera partners with over 300 universities and companies including Google, IBM, Stanford, and MIT to offer courses, professional certificates, and degree programs. It's one of the most recognized online learning platforms globally.",
    commission: "Up to 45%",
    commissionType: "Per sale",
    buyerIntent: "Medium-High",
    pros: [
      "Courses from MIT, Google, Stanford, IBM",
      "Professional certificates with real career value",
      "Affordable subscription model (Coursera Plus)",
      "Wide range of topics from tech to business",
      "Flexible self-paced learning"
    ],
    cons: [
      "Some courses lack depth for advanced learners",
      "Certificate recognition varies by employer"
    ],
    bestFor: "Students and professionals learning digital marketing, AI, data science, or business skills.",
    cta: "Explore top-rated courses from world-class universities — start learning today.",
    affiliateLink: "#",
    features: ["University Courses", "Professional Certificates", "Degree Programs", "Career Skills", "Flexible Schedule"]
  },
  {
    id: "jasper-ai",
    name: "Jasper AI",
    category: "ai-writing",
    categoryName: "AI Writing Tools",
    tagline: "AI-powered content writing for blogs, ads, emails, and marketing copy at scale.",
    description: "Jasper AI is a leading AI content generation platform designed specifically for marketing teams. It helps create blog posts, ad copy, emails, social media content, and more — with brand voice consistency and team collaboration built in.",
    commission: "~25-30%",
    commissionType: "Recurring",
    buyerIntent: "High",
    pros: [
      "High-quality AI content generation",
      "50+ templates for different content types",
      "Brand voice customization and memory",
      "Team collaboration and workflows",
      "Integrates with Surfer SEO and Grammarly"
    ],
    cons: [
      "Pricier than some AI writing alternatives",
      "Output still needs human review for accuracy"
    ],
    bestFor: "Content marketers and agencies needing AI-assisted copy at scale.",
    cta: "Write better content faster with AI — try Jasper and see the difference.",
    affiliateLink: "#",
    features: ["Blog Posts", "Ad Copy", "Email Writing", "Brand Voice", "Templates", "Team Collaboration"]
  },
  {
    id: "notion",
    name: "Notion",
    category: "productivity",
    categoryName: "Productivity & Organization",
    tagline: "All-in-one workspace for notes, projects, wikis, and databases.",
    description: "Notion is a flexible workspace that combines notes, project management, wikis, and databases into one tool. Used by teams at companies like Figma, Pixar, and Nike, it adapts to any workflow with its powerful building-block approach.",
    commission: "~50%",
    commissionType: "Per sale (paid plans)",
    buyerIntent: "Medium",
    pros: [
      "Incredibly flexible — adapts to any workflow",
      "Beautiful, clean, minimal interface",
      "Generous free plan for personal use",
      "Strong template ecosystem (thousands available)",
      "Notion AI assistant built-in"
    ],
    cons: [
      "Can feel overwhelming for very simple tasks",
      "Offline mode is limited",
      "Mobile app less powerful than desktop"
    ],
    bestFor: "Teams and individuals wanting one tool for notes, projects, and knowledge management.",
    cta: "Organize your work and life in one beautiful workspace — start free.",
    affiliateLink: "#",
    features: ["Notes", "Project Management", "Wikis", "Databases", "Templates", "AI Assistant"]
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category);
}

export function getAllProductIds(): string[] {
  return products.map(p => p.id);
}
