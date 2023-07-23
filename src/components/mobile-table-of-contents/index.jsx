import React from 'react'
import './index.scss'

export const MobileTableOfContents = ({ content }) => {
  return (
    <div
      className="mobile-table-of-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default MobileTableOfContents
