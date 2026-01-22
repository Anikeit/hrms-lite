import React from 'react'
import './Alert.css'

function Alert({ message, type = 'error', onClose }) {
  if (!message) return null

  return (
    <div className={`alert alert-${type}`}>
      {message}
      {onClose && (
        <button onClick={onClose} className="alert-close">×</button>
      )}
    </div>
  )
}

export default Alert
