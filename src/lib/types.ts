export type Category =
  | "Finance & Business"
  | "AI Tools & News"
  | "System Design"
  | "Interview Prep"
  | "Other";

export type ArticleType = "article" | "video";

export interface Article {
  id: string;
  title: string;
  url: string;
  source: string;
  type: ArticleType;
  category: Category;
  read_time: string | null;
  tags: string[];
  summary: string;
  full_text: string | null;
  notes: string;
  is_read: boolean;
  is_follow_up: boolean;
  group_name: string | null;
  added_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  body: string;
  created_at: string;
  updated_at: string;
  linked_article_ids: string[];
}

export interface Share {
  id: string;
  token: string;
  mode: "anyone_with_link" | "invite_only";
  access_level: "view_only";
  created_at: string;
  revoked_at: string | null;
}

export type TimeBucket = "5" | "15" | "30" | "video";

export function bucketFor(article: Pick<Article, "read_time" | "type">): TimeBucket {
  if (article.type === "video") return "video";
  const match = article.read_time?.match(/(\d+)/);
  const minutes = match ? parseInt(match[1], 10) : 15;
  if (minutes <= 5) return "5";
  if (minutes <= 15) return "15";
  return "30";
}
