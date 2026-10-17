export interface PlanTypes {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  interval: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  _count?: {
    memberships: number;
  };
}

export interface MembershipTypes {
  id: string;
  userId: string;
  planId: string;
  status: string;
  startDate: Date | string;
  endDate: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  plan?: PlanTypes | null;
}

export interface PlanInputData {
  slug: string;
  name: string;
  description?: string | null;
  price: number;
  interval: string;
  features: string[];
  isPopular?: boolean;
  isActive?: boolean;
}
