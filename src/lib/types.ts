export interface User {
  _id: string;
  sid: string;
  name: string;
  email: string;
  avatarurl?: string;
  interests: string[];
  xp: number;
  level: number;
  badges: string[];
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastUpdated: string | null;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkshopCourse {
  _id: string;
  title: string;
  description: string;
  isFeatured: boolean;
  whyCurated: string;
  cover?: string;
  tags: string[];
  numberOfResc: number;
  estimatedTime?: number;
  curatorName: string;
  curatorAvatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalCourses: number;
  curatedCourses: number;
  activeUsers: number;
}
export type UserCourse = {
  id: string;
  title: string;
  description: string;
  is_public: boolean;
  tags?: string[];
  createdAt: string;
};

export interface Resource {
  id: string;
  course_id: string;
  title: string;
  url: string;
  type_of_resource: "video" | "article" | "tutorial" | string;
  description: string;
  sort_order: number;
  estimated_minutes?: number;
}

