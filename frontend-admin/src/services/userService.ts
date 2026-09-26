import request from './api';
import { UserItem } from '../components/organisms/UserTable';

export const userService = {
  async getUsers(): Promise<UserItem[]> {
    const response = await request<UserItem[]>('/usuarios');
    return response.data || [];
  },

  async createUser(data: Partial<UserItem>): Promise<UserItem> {
    const response = await request<UserItem>('/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data as UserItem;
  },

  async updateUser(id: number | string, data: Partial<UserItem>): Promise<UserItem> {
    const response = await request<UserItem>(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data as UserItem;
  },

  async deleteUser(id: number | string): Promise<void> {
    await request(`/usuarios/${id}`, {
      method: 'DELETE',
    });
  },
};

export default userService;
