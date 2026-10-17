import { type RoleDataTypes } from "./rolesTypes";

export type UserDataTypes = {
  id: string;
  userId?: string | null;
  academicYearId?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  birthDate?: Date | string | null;
  birthPlace?: string | null;
  classId?: string | null;
  employeeId?: string | null;
  endDate?: Date | string | null;
  enrollmentDate?: Date | string | null;
  gender?: string | null;
  graduationDate?: Date | string | null;
  branchId?: string | null;
  nik?: string | null;
  nisn?: string | null;
  parentPhone?: string | null;
  position?: string | null;
  relation?: string | null;
  roleId?: string | null;
  startDate?: Date | string | null;
  status?: string;
  studentIds?: string[];
  email?: string | null;
  name: string;
  isActive?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  tahfidzGroupId?: string | null;
  clientId?: string | null;
  user?: UserTypes | null;
  branch?: BranchTypes | null;
  role?: RoleDataTypes | null;
};

export interface UserTypes {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  banExpires?: Date | string | null;
  banReason?: string | null;
  banned?: boolean | null;
  role?: string | null;
  clientId?: string | null;
  userData?: UserDataTypes | null;
}

export interface BranchTypes {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  address?: string | null;
  phone?: string | null;
  adminName?: string | null;
  signatureUrl?: string | null;
  clientId?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
