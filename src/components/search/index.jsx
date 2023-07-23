import React, { useEffect } from 'react'
import './index.scss'

export const Search = ({ posts }) => {
  const [query, setQuery] = React.useState('')
  const [result, setResult] = React.useState([])

  useEffect(() => {
    if (query === '') {
      setResult([])
      return
    }
    const result = posts.filter(post => {
      const headings = post.node.headings.map(({ value }) => value).join(',')
      const category = post.node.frontmatter.category
      const excerpt = post.node.excerpt
      const { title } = post.node.frontmatter
      const target = title + headings + category + excerpt

      return target.toLowerCase().includes(query.toLowerCase())
    })

    setResult(result)
  }, [query])

  return (
    <div>
      <div className="search-wrapper">
        <div className="search">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder=" search"
          />
        </div>
        <ul className="search-ul">
          {result.map(({ node }) => {
            return (
              <a href={node.fields.slug}>
                <li key={node.fields.slug}>
                  <div className="category">{node.frontmatter.category}</div>
                  {node.frontmatter.title}
                </li>
              </a>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
