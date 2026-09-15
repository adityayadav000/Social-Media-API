export interface User {
  _id: string;
  fullName?: string;
  fullname?: string;
  username: string;
  email?: string;
  profilePicture?: string;
  followers?: (User | string)[];
  following?: (User | string)[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  _id: string;
  owner: User;
  content: string;
  likes: string[];
  commentsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Reel {
  _id: string;
  owner: User;
  videoUrl: string;
  caption?: string;
  likes: string[];
  viewsCount?: number;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Comment {
  _id: string;
  post?: string;
  reel?: string;
  owner?: User;
  user?: User;
  content: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
