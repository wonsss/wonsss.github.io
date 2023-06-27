import React from 'react'
import './index.scss'

export const TableOfContents = ({ content }) => {
  return (
    <div
      className="table-of-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default TableOfContents
