export type ExperiencePhoto = { url: string; path: string };
export type SectionItem = { title: string; body: string; tag?: string; photos?: ExperiencePhoto[] };

export type Profile = {
  id: number;
  name: string;
  tagline: string;
  bio: string;
  roles: string[];
  profile_pic_url: string | null;
  resume_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  accent_color: string;
};

export type SectionLayout = "text" | "two-col" | "cards" | "tags";

export type Section = {
  id: string;
  title: string;
  layout: SectionLayout;
  content: {
    body?: string;
    items?: SectionItem[];
    tags?: string[]; // used by the "tags" layout (e.g. a Skills chip grid)
  };
  position: number;
  visible: boolean;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string | null;
  link_url: string | null; // "visit website" — live demo / deployed app
  repo_url: string | null; // "view repository" — source code
  position: number;
  visible: boolean;
};
