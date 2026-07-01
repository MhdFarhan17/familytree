export type Role = "admin" | "contributor";

export interface User {
  id: string;
  email: string;
  role: Role;
}

export type Gender = "male" | "female";

export interface FamilyMember {
  id: string;
  full_name: string;
  nickname: string;
  death_date?: string | null; // YYYY-MM-DD (optional)
  is_deceased?: boolean;
  gender: Gender;
  photo_url: string;
  father_id: string | null;
  mother_id: string | null;
  spouse_id: string | null;
}

export type EditRequestStatus = "pending" | "approved" | "rejected";

export interface EditRequest {
  id: string;
  member_id: string;
  submitted_by: string; // user id
  proposed_data: Partial<FamilyMember>;
  status: EditRequestStatus;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  is_banned: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: "ADD" | "EDIT" | "DELETE";
  target_member_id: string | null;
  target_member_name: string;
  details: string | null;
  created_at: string;
  // relations
  profiles?: Profile;
}
