import request from './api';

export interface LogEvent {
  id: number;
  user: string;
  action: string;
  type: string;
  timestamp: string;
}

export const logService = {
  async getLogs(): Promise<LogEvent[]> {
    const response = await request<LogEvent[]>('/admin/logs');
    return response.data || [];
  },
};

export default logService;
