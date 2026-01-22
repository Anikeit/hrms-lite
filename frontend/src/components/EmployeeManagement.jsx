import React, { useState, useEffect } from 'react'
import { getEmployees, createEmployee, deleteEmployee } from '../services/api'
import { getErrorMessage } from '../utils/errorHandler'
import Loading from './common/Loading'
import Alert from './common/Alert'
import EmptyState from './common/EmptyState'
import Modal from './common/Modal'
import './EmployeeManagement.css'

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]),
        [loading, setLoading] = useState(true),
        [error, setError] = useState(null),
        [showForm, setShowForm] = useState(false),
        [formData, setFormData] = useState({
          employee_id: '',
          full_name: '',
          email: '',
          department: '',
        }),
        [formError, setFormError] = useState(null),
        [submitting, setSubmitting] = useState(false),
        [showDeleteModal, setShowDeleteModal] = useState(false),
        [employeeToDelete, setEmployeeToDelete] = useState(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getEmployees()
      setEmployees(response.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      await createEmployee(formData)
      setFormData({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
      })
      setShowForm(false)
      fetchEmployees()
    } catch (err) {
      setFormError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return

    try {
      await deleteEmployee(employeeToDelete.id)
      setShowDeleteModal(false)
      setEmployeeToDelete(null)
      fetchEmployees()
    } catch (err) {
      setError(getErrorMessage(err))
      setShowDeleteModal(false)
      setEmployeeToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setEmployeeToDelete(null)
  }

  if (loading) {
    return <Loading message="Loading employees..." />
  }

  return (
    <div className="employee-management">
      <div className="page-header">
        <h2>Employee Management</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Employee'}
        </button>
      </div>

      <Alert message={error} onClose={() => setError(null)} />

      {showForm && (
        <div className="form-container">
          <h3>Add New Employee</h3>
          <form onSubmit={handleSubmit}>
            <Alert message={formError} />
            
            <div className="form-group">
              <label htmlFor="employee_id">Employee ID *</label>
              <input
                type="text"
                id="employee_id"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleInputChange}
                required
                placeholder="e.g., EMP001"
              />
            </div>

            <div className="form-group">
              <label htmlFor="full_name">Full Name *</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                placeholder="e.g., John Doe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="e.g., john.doe@company.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                placeholder="e.g., Engineering"
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add Employee'}
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

      {employees.length === 0 ? (
        <EmptyState message="No employees found. Add your first employee to get started." />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.employee_id}</td>
                  <td>{employee.full_name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(employee)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="Delete Employee"
        actions={
          <>
            <button
              className="btn btn-danger"
              onClick={handleDeleteConfirm}
            >
              Delete
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleDeleteCancel}
            >
              Cancel
            </button>
          </>
        }
      >
        {employeeToDelete && (
          <>
            <p>
              Are you sure you want to delete <strong>{employeeToDelete.full_name}</strong> ({employeeToDelete.employee_id})?
            </p>
            <div className="modal-warning">
              <strong>⚠️ Warning:</strong> This action cannot be reverted. All associated attendance records will also be deleted.
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

export default EmployeeManagement
