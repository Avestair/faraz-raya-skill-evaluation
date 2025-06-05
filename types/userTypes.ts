import { z } from "zod";

export type UserProfile = {
  id?: string;
  created_at: string;
  email: string;
  username: string;
  full_name: string;
  job_title: string;
  company?: string | null;
  department?: string | null;
  bio?: string | null;
  last_sign_in_at?: string | null;
};

export type NewUser = {
  id: string;
  created_at: string;
  email: string;
  password_hash: string;
  username: string;
  full_name: string;
  job_title: string;
  company: string | null;
  department?: string | null;
  bio?: string | null;
};

export type UpdateUser = {
  email?: string;
  password_hash?: string;
  username: string;
  full_name: string;
  job_title: string;
  company: string | null;
  department?: string | null;
  bio?: string | null;
  last_sign_in_at?: string | null;
};

export const userSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  email: z.string(),
  username: z.string(),
  full_name: z.string(),
  job_title: z.string(),
  company: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  last_sign_in_at: z.string().nullable().optional(),
});
