import plainApi from "./plainAxios";

export interface TeamMember {
  id: string;
  full_name: string;
  title?: string;
  // description?: string;
  picture?: string;
}

export const fetchManagers = async () => {
  const res = await plainApi.get<TeamMember[]>("/profile/public");
  return res.data;
};
