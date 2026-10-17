export type betterauthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  banExpires: string | null;
  banReason: string | null;
  banned: boolean;
  role: string;
  clientId?: string | null;
  userData?: {
    id: string;
    userId: string;
    name: string;
    email: string | null;
    avatarUrl: string | null;
    address: string | null;
    birthDate: string | null;
    birthPlace: string | null;
    gender: string | null;
    nik: string | null;
    nisn: string | null;
    employeeId: string | null;
    position: string | null;
    relation: string | null;
    parentPhone: string | null;
    branchId: string | null;
    roleId: string | null;
    status: string;
    isActive: boolean;
    clientId?: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    role: {
      id: string;
      name: string;
      description: string;
      permissions: string[];
      isActive: boolean;
    } | null;
  } | null;
};

export type permissionType = {
  permission: string;
  hasPermission: boolean;
};
