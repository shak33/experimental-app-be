export const API_BASE_URL = '/api/v1';
export const API_ROUTE_AUTH = `${API_BASE_URL}/auth`;
export const API_ROUTE_ATTENDANCE = `${API_BASE_URL}/attendance`;

export const authRoutes = {
  register: '/register',
  login: '/login',
} as const;

export const attendanceRoutes = {
  checkIn: '/check-in',
} as const;
