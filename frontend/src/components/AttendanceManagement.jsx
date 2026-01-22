import React, { useState, useEffect } from 'react'
import { getEmployees, getAttendance, createAttendance, getAttendanceByEmployee } from '../services/api'
import { getErrorMessage } from '../utils/errorHandler'
import Loading from './common/Loading'
import Alert from './common/Alert'
import EmptyState from './common/EmptyState'
import './AttendanceManagement.css'

function AttendanceManagement() {
  const [employees, setEmployees] = useState([]),
        [attendanceRecords, setAttendanceRecords] = useState([]),
        [loading, setLoading] = useState(true),
        [error, setError] = useState(null),
        [showForm, setShowForm] = useState(false),
        [selectedEmployee, setSelectedEmployee] = useState(null),
        [formData, setFormData] = useState({
          employee: '',
          date: new Date().toISOString().split('T')[0],
          status: 'Present',
        }),
        [formError, setFormError] = useState(null),
        [submitting, setSubmitting] = useState(false),
        [viewMode, setViewMode] = useState('all'), // 'all' or 'employee'
        [employeeAttendance, setEmployeeAttendance] = useState([]),
        [loadingEmployeeAttendance, setLoadingEmployeeAttendance] = useState(false)

  useEffect(() => {
    fetchEmployees()
    fetchAttendance()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees()
      setEmployees(response.data)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAttendance()
      setAttendanceRecords(response.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployeeAttendance = async (employeeId) => {
    try {
      setLoadingEmployeeAttendance(true)
      const response = await getAttendanceByEmployee(employeeId)
      setEmployeeAttendance(response.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoadingEmployeeAttendance(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setFormError(null)
  }

  const handleEmployeeSelect = (e) => {
    const employeeId = e.target.value
    setSelectedEmployee(employeeId)
    if (employeeId) {
      fetchEmployeeAttendance(employeeId)
      setViewMode('employee')
    } else {
      setViewMode('all')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      await createAttendance(formData)
      setFormData({
        employee: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
      })
      setShowForm(false)
      fetchAttendance()
      if (selectedEmployee) {
        fetchEmployeeAttendance(selectedEmployee)
      }
    } catch (err) {
      setFormError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Loading message="Loading attendance records..." />
  }

  const displayRecords = viewMode === 'employee' ? employeeAttendance : attendanceRecords

  return (
    <div className="attendance-management">
      <div className="page-header">
        <h2>Attendance Management</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Mark Attendance'}
        </button>
      </div>

      <Alert message={error} onClose={() => setError(null)} />

      {showForm && (
        <div className="form-container">
          <h3>Mark Attendance</h3>
          <form onSubmit={handleSubmit}>
            <Alert message={formError} />
            
            <div className="form-group">
              <label htmlFor="employee">Employee *</label>
              <select
                id="employee"
                name="employee"
                value={formData.employee}
                onChange={handleInputChange}
                required
              >
                <option value="">Select an employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employee_id} - {emp.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Mark Attendance'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false)
                  setFormError(null)
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="filter-section">
        <div className="form-group">
          <label htmlFor="filter-employee">Filter by Employee</label>
          <select
            id="filter-employee"
            value={selectedEmployee || ''}
            onChange={handleEmployeeSelect}
          >
            <option value="">All Employees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.employee_id}>
                {emp.employee_id} - {emp.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loadingEmployeeAttendance && viewMode === 'employee' ? (
        <Loading message="Loading attendance records..." />
      ) : displayRecords.length === 0 ? (
        <EmptyState
          message={
            viewMode === 'employee' 
              ? 'No attendance records found for this employee.' 
              : 'No attendance records found. Mark attendance to get started.'
          }
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.employee_id}</td>
                  <td>{record.employee_name}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AttendanceManagement
