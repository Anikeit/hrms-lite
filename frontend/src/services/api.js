import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Employee APIs
export const getEmployees = () => api.get('/employees/')
export const createEmployee = (data) => api.post('/employees/', data)
export const deleteEmployee = (id) => api.delete(`/employees/${id}/`)

// Attendance APIs
export const getAttendance = () => api.get('/attendance/')
export const createAttendance = (data) => api.post('/attendance/', data)
export const getAttendanceByEmployee = (employeeId) => 
  api.get(`/attendance/employee/${employeeId}/`)

export default api
