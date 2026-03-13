import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {!showDetails ? (
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setShowDetails(true)}>view</button>
        </div>
      ) : (
        <div>
          <div>
            {blog.title} {blog.author}
            <button onClick={() => setShowDetails(false)}>hide</button>
          </div>

          <div>{blog.url}</div>

          <div>
            likes {blog.likes}
            <button>like</button>
          </div>

          <div>{blog.user?.name}</div>
        </div>
      )}
    </div>
  )
}

export default Blog