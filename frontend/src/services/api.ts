import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Health Check
export const checkHealth = async (): Promise<boolean> => {
  try {
    const res = await api.get('/health');
    return res.data?.status === 'ok';
  } catch {
    return false;
  }
};

// Auth Services
export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post('/users/login', { email, password });
    return res.data;
  },
  register: async (data: { fullName: string; username: string; email: string; password: string }) => {
    const res = await api.post('/users/register', data);
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data;
  },
  getUserProfile: async (userId: string) => {
    const res = await api.get(`/users/${userId}/profile`);
    return res.data;
  },
  searchUsers: async (username: string) => {
    const res = await api.get(`/users/search?username=${encodeURIComponent(username)}`);
    return res.data;
  },
  followUser: async (userId: string) => {
    const res = await api.post(`/users/${userId}/follow`);
    return res.data;
  },
  unfollowUser: async (userId: string) => {
    const res = await api.delete(`/users/${userId}/follow`);
    return res.data;
  },
};

// Post Services
export const postService = {
  getAllPosts: async () => {
    const res = await api.get('/posts');
    return res.data;
  },
  getFeed: async (page = 1, limit = 10) => {
    const res = await api.get(`/users/feed?page=${page}&limit=${limit}`);
    return res.data;
  },
  createPost: async (content: string) => {
    const res = await api.post('/posts/create', { content });
    return res.data;
  },
  updatePost: async (postId: string, content: string) => {
    const res = await api.put(`/posts/${postId}`, { content });
    return res.data;
  },
  deletePost: async (postId: string) => {
    const res = await api.delete(`/posts/${postId}`);
    return res.data;
  },
  likePost: async (postId: string) => {
    const res = await api.post(`/posts/${postId}/like`);
    return res.data;
  },
  unlikePost: async (postId: string) => {
    const res = await api.delete(`/posts/${postId}/like`);
    return res.data;
  },
  getComments: async (postId: string) => {
    const res = await api.get(`/posts/${postId}/comments`);
    return res.data;
  },
  createComment: async (postId: string, content: string) => {
    const res = await api.post(`/posts/${postId}/comments`, { content });
    return res.data;
  },
  deleteComment: async (commentId: string) => {
    const res = await api.delete(`/posts/comments/${commentId}`);
    return res.data;
  },
};

// Reel Services
export const reelService = {
  getReels: async () => {
    const res = await api.get('/api/reels');
    return res.data;
  },
  getReelFeed: async () => {
    const res = await api.get('/api/reels/feed');
    return res.data;
  },
  createReel: async (formData: FormData) => {
    const res = await api.post('/api/reels', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  likeReel: async (reelId: string) => {
    const res = await api.post(`/api/reels/${reelId}/like`);
    return res.data;
  },
  unlikeReel: async (reelId: string) => {
    const res = await api.post(`/api/reels/${reelId}/unlike`);
    return res.data;
  },
  viewReel: async (reelId: string) => {
    const res = await api.post(`/api/reels/${reelId}/view`);
    return res.data;
  },
  getReelComments: async (reelId: string) => {
    const res = await api.get(`/api/reels/${reelId}/comments`);
    return res.data;
  },
  createReelComment: async (reelId: string, content: string) => {
    const res = await api.post(`/api/reels/${reelId}/comment`, { content });
    return res.data;
  },
  deleteReelComment: async (commentId: string) => {
    const res = await api.delete(`/api/reels/comments/${commentId}`);
    return res.data;
  },
};

export default api;
