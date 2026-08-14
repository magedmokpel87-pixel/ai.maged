export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: "all-in-one-marketing",
    name: "All-in-One Marketing",
    slug: "all-in-one-marketing",
    description: "Complete marketing platforms that combine landing pages, email, funnels, and automation in one tool. Perfect for entrepreneurs who want simplicity.",
    icon: "🚀",
    productCount: 1,
  },
  {
    id: "crm-automation",
    name: "CRM & Marketing Automation",
    slug: "crm-automation",
    description: "Customer relationship management and marketing automation tools for businesses serious about scaling their sales and marketing operations.",
    icon: "⚙️",
    productCount: 1,
  },
  {
    id: "learning-platforms",
    name: "Learning & Courses",
    slug: "learning-platforms",
    description: "Online learning platforms offering courses, certifications, and skill development from world-class universities and industry leaders.",
    icon: "📚",
    productCount: 1,
  },
  {
    id: "ai-writing",
    name: "AI Writing Tools",
    slug: "ai-writing",
    description: "AI-powered content creation tools that help you write blog posts, ads, emails, and marketing copy faster and better.",
    icon: "✍️",
    productCount: 1,
  },
  {
    id: "productivity",
    name: "Productivity & Organization",
    slug: "productivity",
    description: "Workspace and productivity tools that help teams and individuals organize their work, manage projects, and collaborate effectively.",
    icon: "📋",
    productCount: 1,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getAllCategorySlugs(): string[] {
  return categories.map(c => c.slug);
}
