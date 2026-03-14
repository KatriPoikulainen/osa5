import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import Blog from './Blog'

test('renders title and author', () => {
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

  const element = screen.getByText('Testing React Katri Virtanen')
  expect(element).toBeDefined()
})