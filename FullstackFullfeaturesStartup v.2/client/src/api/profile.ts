import api from "./axios";
import { User } from "../context/AuthContext";

/* =========================
   TYPES
========================= */

export interface PublicProfile {
  id: string;
  full_name: string;
  title?: string | null;
  description?: string | null;
  picture?: string | null;
  promo_number?: string | null;
}

/* =========================
   AUTHENTICATED PROFILE
========================= */

export const updateProfile = async (data: {
  full_name?: string;
  title?: string;
  description?: string;
  phone?: string;
  picture?: string;
}) => {
  const res = await api.put<User>("/profile", data);
  return res.data;
};

// Team page
export const fetchPublicTeam = async (): Promise<PublicProfile[]> => {
  const res = await api.get<PublicProfile[]>("/profile/public");
  return res.data;
};

// Team profile page
export const fetchPublicProfile = async (id: string): Promise<PublicProfile> => {
  const res = await api.get<PublicProfile>(`/profile/public/${id}`);
  return res.data;
};


