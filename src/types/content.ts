export type Locale = 'en' | 'es';
export type Localized = Record<Locale, string>;

export type Experience = {
  id: number;
  position: number;
  company: string;
  job_title: Localized;
  description: Localized;
  start_date: string;          // ISO yyyy-mm-dd
  end_date: string | null;
  location: string;
  company_url: string | null;
  technologies: string[];
};

export type Project = {
  id: number;
  title: Localized;
  description: Localized;
  technologies: string[];
  github_url: string | null;
  live_url: string | null;
  app_store_url: string | null;
  play_store_url: string | null;
  image_url: string;
  published: boolean;
  featured: boolean;
  position: number;
};

export type Category = {
  id: number;
  name: Localized;
  slug: string;
};

export type SkillGroup = 'backend' | 'frontend' | 'devops' | 'database';

export type Skill = {
  name: string;
  level: number;            // 0..100
  group: SkillGroup;
  color: string;
};
