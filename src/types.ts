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
