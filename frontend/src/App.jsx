import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './components/Home'
import EmployeeManagement from './components/EmployeeManagement'
import AttendanceManagement from './components/AttendanceManagement'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/employees" element={<EmployeeManagement />} />
            <Route path="/attendance" element={<AttendanceManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title"><Link to="/" className="sidebar-title-link">HRMS Lite</Link></h1>
      </div>
      <nav className="sidebar-nav">
        <Link 
          to="/employees" 
          className={`sidebar-link ${location.pathname === '/employees' ? 'active' : ''}`}
        >
          Employee Management
        </Link>
        <Link 
          to="/attendance" 
          className={`sidebar-link ${location.pathname === '/attendance' ? 'active' : ''}`}
        >
          Attendance
        </Link>
      </nav>
    </aside>
  )
}

export default App
