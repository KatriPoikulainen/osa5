import { render, screen, cleanup } from '@testing-library/react'
import { test, expect, vi, afterEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


afterEach(() => {
  cleanup()
})

test('renders title and author', () => {
  const blog = {
    title: 'Testing React',
    author: 'Katri Virtanen'
  }

  render(<Blog blog={blog} likeBlog={() => {}} removeBlog={() => {}} user={{ username: 'katri' }} />)

  screen.getByText('Testing React Katri Virtanen')
})

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

test('if like button is clicked twice, event handler is called twice', async () => {
  const blog = {
    title: 'Testing React',
    author: 'Katri Virtanen',
    url: 'http://example.com',
    likes: 5,
    user: {
      name: 'Katri Virtanen'
    }
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} likeBlog={mockHandler} removeBlog={() => {}} user={{ username: 'katri' }} />)

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})