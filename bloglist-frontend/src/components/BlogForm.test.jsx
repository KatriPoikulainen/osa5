import { render, screen } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'


test('<BlogForm /> calls createBlog with correct details', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />) 


  const inputs = screen.getAllByRole('textbox')
  const createButton = screen.getByText('create')


await user.type(inputs[0], 'Testing React')
await user.type(inputs[1], 'Katri Virtanen')
await user.type(inputs[2], 'http://example.com')
await user.click(createButton)


expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing React')
  expect(createBlog.mock.calls[0][0].author).toBe('Katri Virtanen')
  expect(createBlog.mock.calls[0][0].url).toBe('http://example.com')
})