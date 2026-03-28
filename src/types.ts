export interface Dish {
  id: string;
  name: string;
  intro: string;
  ingredients: string[];
  tags: string[];
  imageUrl?: string;
  spaceId: string;
  createdAt: string;
}

export interface Order {
  id: string;
  dishIds: string[];
  orderTime: string;
  notes: string;
  userName: string;
  spaceId: string;
  createdAt: string;
}

export interface Space {
  id: string;
  name: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  spaceId?: string;
  updatedAt: string;
}

export interface JoinRequest {
  id: string;
  uid: string;
  displayName: string;
  spaceId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
