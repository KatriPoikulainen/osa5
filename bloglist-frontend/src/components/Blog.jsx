import { useState } from 'react'

const Blog = ({ blog, likeBlog, removeBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const blogUserId = blog.user?.id || blog.user?._id || blog.user
  const loggedUserId = user?.id || user?._id
  const canRemove =
  blogUserId === loggedUserId || blog.user?.username === user?.username

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
            <button onClick={() => likeBlog(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>

          {canRemove && (
            <button onClick={() => removeBlog(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog