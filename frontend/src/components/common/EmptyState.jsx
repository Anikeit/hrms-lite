import React from 'react'
import './EmptyState.css'

function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <p>{message}</p>
    </div>
  )
}

export default EmptyState
