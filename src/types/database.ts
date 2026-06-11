export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Project
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
export type ProjectInsert = Omit<Project, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

// Blog Post
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  tags: string[];
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
export type BlogPostInsert = Omit<BlogPost, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

// Skill
export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: string | null;
  sort_order: number;
  created_at: string;
}
export type SkillInsert = Omit<Skill, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

// Experience
export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  is_current: boolean;
  sort_order: number;
  created_at: string;
}
export type ExperienceInsert = Omit<Experience, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

// Contact Message
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
export type ContactMessageInsert = Omit<ContactMessage, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

// Page View
export interface PageView {
  id: string;
  path: string;
  referrer: string | null;
  user_agent: string | null;
  viewed_at: string;
}
export type PageViewInsert = Omit<PageView, "id" | "viewed_at"> & {
  id?: string;
  viewed_at?: string;
};

// Service
export interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  revisions: string;
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
  cta_text: string;
  cta_link: string;
  created_at: string;
}
export type ServiceInsert = Omit<Service, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

// Re-export for Database type
export interface Database {
  public: {
    Tables: {
      projects: { Row: Project; Insert: ProjectInsert; Update: Partial<ProjectInsert> };
      blog_posts: { Row: BlogPost; Insert: BlogPostInsert; Update: Partial<BlogPostInsert> };
      skills: { Row: Skill; Insert: SkillInsert; Update: Partial<SkillInsert> };
      experiences: { Row: Experience; Insert: ExperienceInsert; Update: Partial<ExperienceInsert> };
      contact_messages: { Row: ContactMessage; Insert: ContactMessageInsert; Update: Partial<ContactMessageInsert> };
      page_views: { Row: PageView; Insert: PageViewInsert; Update: Partial<PageViewInsert> };
      services: { Row: Service; Insert: ServiceInsert; Update: Partial<ServiceInsert> };
    };
  };
}
