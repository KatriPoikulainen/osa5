import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('url, likes and user are shown when view button is clicked', async () => {
  const blog = {
    title: 'Testing React',
    author: 'Katri Virtanen',
    url: 'http://example.com',
    likes: 5,
    user: {
      name: 'Katri Virtanen'
    }
  }


  render(<Blog blog={blog} likeBlog={() => {}} removeBlog={() => {}} user={{ username: 'katri' }} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  screen.getByText('http://example.com')
  screen.getByText('likes 5')
  screen.getByText('Katri Virtanen')
})