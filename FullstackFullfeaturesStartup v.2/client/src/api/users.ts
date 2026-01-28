import api from "./axios";
import { User } from "../context/AuthContext";

export const fetchUsers = async (role?: string): Promise<User[]> => {
  const res = await api.get<User[]>("/users", {
    params: role ? { role } : {},
    withCredentials: true,
  });
  return res.data;
};

export const fetchUserById = async (id: string): Promise<User> => {
  const res = await api.get<User>(`/users/${id}`, { withCredentials: true });
  return res.data;
};

export const updateUserById = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  const res = await api.put<User>(`/users/${id}`, data, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
