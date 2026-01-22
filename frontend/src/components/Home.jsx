import React from 'react'
import './Home.css'

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to HRMS Admin</h1>
        <p className="home-subtitle">
          Manage your employees and track attendance with ease
        </p>
        <div className="home-features">
          <div className="feature-card">
            <h3>Employee Management</h3>
            <p>Add, view, and manage employee records</p>
          </div>
          <div className="feature-card">
            <h3>Attendance Tracking</h3>
            <p>Mark and monitor daily attendance records</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
