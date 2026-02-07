import apiClient from './api';

// Auth
export const getOAuthUrl = async () => {
  const response = await apiClient.get('/auth/login');
  return response.data;
};

export const handleOAuthCallback = async (code: string, state: string) => {
  const response = await apiClient.get('/auth/callback', {
    params: { code, state },
  });
  return response.data;
};

export const logout = async () => {
  await apiClient.post('/auth/logout');
};

// Users
export const getCurrentUser = async () => {
  const response = await apiClient.get('/users/me');
  return response.data;
};

export const updateUserProfile = async (data: any) => {
  const response = await apiClient.put('/users/me', data);
  return response.data;
};

export const getPublicProfile = async (username: string) => {
  const response = await apiClient.get(`/users/${username}`);
  return response.data;
};

// Experience
export const addExperience = async (data: any) => {
  const response = await apiClient.post('/users/me/experience', data);
  return response.data;
};

export const getExperiences = async () => {
  const response = await apiClient.get('/users/me/experience');
  return response.data;
};

export const updateExperience = async (id: number, data: any) => {
  const response = await apiClient.put(`/users/me/experience/${id}`, data);
  return response.data;
};

export const deleteExperience = async (id: number) => {
  await apiClient.delete(`/users/me/experience/${id}`);
};

// Education
export const addEducation = async (data: any) => {
  const response = await apiClient.post('/users/me/education', data);
  return response.data;
};

export const getEducation = async () => {
  const response = await apiClient.get('/users/me/education');
  return response.data;
};

export const updateEducation = async (id: number, data: any) => {
  const response = await apiClient.put(`/users/me/education/${id}`, data);
  return response.data;
};

export const deleteEducation = async (id: number) => {
  await apiClient.delete(`/users/me/education/${id}`);
};

// Skills
export const addSkill = async (data: any) => {
  const response = await apiClient.post('/users/me/skills', data);
  return response.data;
};

export const getSkills = async () => {
  const response = await apiClient.get('/users/me/skills');
  return response.data;
};

export const updateSkill = async (id: number, data: any) => {
  const response = await apiClient.put(`/users/me/skills/${id}`, data);
  return response.data;
};

export const deleteSkill = async (id: number) => {
  await apiClient.delete(`/users/me/skills/${id}`);
};

// Projects
export const syncProjects = async () => {
  const response = await apiClient.post('/projects/sync');
  return response.data;
};

export const getProjects = async (skip: number = 0, limit: number = 20, status?: string) => {
  const params: any = { skip, limit };
  if (status) params.status_filter = status;
  const response = await apiClient.get('/projects', { params });
  return Array.isArray(response.data?.items) ? response.data.items : response.data;
};

export const getProject = async (id: number) => {
  const response = await apiClient.get(`/projects/${id}`);
  return response.data;
};

export const updateProject = async (id: number, data: any) => {
  const response = await apiClient.put(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: number) => {
  await apiClient.delete(`/projects/${id}`);
};

// Resume
export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getResume = async () => {
  const response = await apiClient.get('/resume/text');
  return response.data;
};

// Portfolio (Public)
export const getPublicPortfolio = async (username: string) => {
  const response = await apiClient.get(`/portfolio/${username}`);
  return response.data;
};

// Media
export const getUserMedia = async () => {
  const response = await apiClient.get('/media');
  return response.data;
};

export const createMedia = async (
  data: { title: string; url?: string; media_type: string },
  file?: File
) => {
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', data.title);
    formData.append('media_type', data.media_type);
    if (data.url) {
      formData.append('url', data.url);
    }
    const response = await apiClient.post('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  const response = await apiClient.post('/media', data);
  return response.data;
};

export const deleteMedia = async (id: number) => {
  await apiClient.delete(`/media/${id}`);
};
