import axios from "axios";
import { User, WorkshopCourse, AdminAnalytics, UserCourse, Resource } from "@/lib/types";

const API = axios.create({
  baseURL: "http://localhost:8000/", //  Change if deployed
});

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  const res = await API.get("/v1/users");
  return res.data;
};

// Fetch curated workshop courses
export const fetchCuratedCourses = async (): Promise<WorkshopCourse[]> => {
  const res = await API.get("/v1/workshop");
  return res.data.map((course: any) => ({
    ...course,
    id: course._id,
  }));
};
// Fetch admin analytics
export const fetchAdminAnalytics = async (): Promise<AdminAnalytics> => {
  const res = await API.get("/v1/admin/analytics");
  return res.data;
};
// Fetch user-submitted courses (not curated ones)
export const fetchUserCourses = async (): Promise<UserCourse[]> => {
  const res = await API.get("/v1/user-courses");
  return res.data.map((course: any) => ({
    id: course._id,
    title: course.title,
    description: course.description,
    is_public: course.is_public,
    tags: course.tags,
    createdAt: course.createdAt,
  }));
};

export const fetchCourseById = async (id: string): Promise<WorkshopCourse> => {
  const res = await API.get(`/v1/workshop/${id}`);
  return {
    ...res.data,
    id: res.data._id,
  };
};

export const fetchCourseResources = async (courseId: string): Promise<Resource[]> => {
  const res = await API.get(`/v1/workshop/${courseId}/resources`);
  return res.data.map((res: any) => ({
    id: res._id,
    title: res.title,
    url: res.url,
    type_of_resource: res.type_of_resource,
    description: res.description,
    sort_order: res.sort_order,
    estimated_minutes: res.estimated_minutes,
  }));
};