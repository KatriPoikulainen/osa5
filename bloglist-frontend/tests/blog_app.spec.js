import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
  data: {
    name: 'Toinen Käyttäjä',
    username: 'toinen',
    password: 'salasana'
  }
})

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const inputs = page.getByRole('textbox')

      await inputs.nth(0).fill('mluukkai')
      await inputs.nth(1).fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      const inputs = page.getByRole('textbox')

      await inputs.nth(0).fill('mluukkai')
      await inputs.nth(1).fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      const inputs = page.getByRole('textbox')

      await inputs.nth(0).fill('mluukkai')
      await inputs.nth(1).fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      const title = `Playwright testing ${Date.now()}`
      await page.getByRole('button', { name: 'create new blog' }).click()

      const inputs = page.getByRole('textbox')
      await inputs.nth(0).fill(title)
      await inputs.nth(1).fill('Katri')
      await inputs.nth(2).fill('http://playwright.test')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.locator('.blog').filter({ hasText: `${title} Katri` }).first()).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      const title = `Blog to like ${Date.now()}`
      await page.getByRole('button', { name: 'create new blog' }).click()

      const inputs = page.getByRole('textbox')
      await inputs.nth(0).fill(title)
      await inputs.nth(1).fill('Katri')
      await inputs.nth(2).fill('http://like.test')
      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.locator('.blog').filter({ hasText: `${title} Katri` }).first()
      await expect(blog).toBeVisible()
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByText('likes 0')).toBeVisible()
      await blog.getByRole('button', { name: 'like' }).click()
      await expect(blog.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be removed by the user who added it', async ({ page }) => {
  const title = `Blog to remove ${Date.now()}`
  await page.getByRole('button', { name: 'create new blog' }).click()

  const inputs = page.getByRole('textbox')
  await inputs.nth(0).fill(title)
  await inputs.nth(1).fill('Katri')
  await inputs.nth(2).fill('http://remove.test')
  await page.getByRole('button', { name: 'create' }).click()

  const blog = page.locator('.blog').filter({ hasText: `${title} Katri` }).first()
  await expect(blog).toBeVisible()
  await blog.getByRole('button', { name: 'view' }).click()

  page.once('dialog', async dialog => {
    await dialog.accept()
  })

  await blog.getByRole('button', { name: 'remove' }).click()
  await expect(page.locator('.blog').filter({ hasText: `${title} Katri` })).toHaveCount(0)
})

test('only the user who added the blog sees the remove button', async ({ page }) => {
  const title = `Blog owned by Matti ${Date.now()}`
  await page.getByRole('button', { name: 'create new blog' }).click()

  const inputs = page.getByRole('textbox')
  await inputs.nth(0).fill(title)
  await inputs.nth(1).fill('Katri')
  await inputs.nth(2).fill('http://owner.test')
  await page.getByRole('button', { name: 'create' }).click()

  const blog = page.locator('.blog').filter({ hasText: `${title} Katri` }).first()
  await expect(blog).toBeVisible()
  await blog.getByRole('button', { name: 'view' }).click()
  await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()
  await page.getByRole('button', { name: 'logout' }).click()

  const loginInputs = page.getByRole('textbox')
  await loginInputs.nth(0).fill('toinen')
  await loginInputs.nth(1).fill('salasana')
  await page.getByRole('button', { name: 'login' }).click()
  await expect(page.getByText('Toinen Käyttäjä logged in')).toBeVisible()

  const sameBlog = page.locator('.blog').filter({ hasText: `${title} Katri` }).first()
  await expect(sameBlog).toBeVisible()
  await sameBlog.getByRole('button', { name: 'view' }).click()
  await expect(sameBlog.getByRole('button', { name: 'remove' })).toHaveCount(0)
})

test('blogs are ordered by likes, highest first', async ({ page }) => {
  const first = `First ${Date.now()}`
  const second = `Second ${Date.now()}`
  const third = `Third ${Date.now()}`

  const createBlog = async (title, author, url) => {
    await page.getByRole('button', { name: 'create new blog' }).click()

    const inputs = page.getByRole('textbox')
    await inputs.nth(0).fill(title)
    await inputs.nth(1).fill(author)
    await inputs.nth(2).fill(url)
    await page.getByRole('button', { name: 'create' }).click()
    await expect(
      page.locator('.blog').filter({ hasText: `${title} ${author}` }).first()
    ).toBeVisible()
  }

  const likeBlog = async (title, times) => {
    const blog = page.locator('.blog').filter({ hasText: `${title} Katri` }).first()
    await blog.getByRole('button', { name: 'view' }).click()

    for (let i = 1; i <= times; i++) {
      await blog.getByRole('button', { name: 'like' }).click()
      await expect(blog.getByText(`likes ${i}`)).toBeVisible()
    }
  }

  await createBlog(first, 'Katri', 'http://first.test')
  await createBlog(second, 'Katri', 'http://second.test')
  await createBlog(third, 'Katri', 'http://third.test')
  await likeBlog(first, 1)
  await likeBlog(second, 3)
  await likeBlog(third, 2)
  await page.reload()
  await expect(page.locator('.blog').filter({ hasText: first }).first()).toBeVisible()
  await expect(page.locator('.blog').filter({ hasText: second }).first()).toBeVisible()
  await expect(page.locator('.blog').filter({ hasText: third }).first()).toBeVisible()

  const blogTexts = await page.locator('.blog').allTextContents()
  const firstIndex = blogTexts.findIndex(text => text.includes(first))
  const secondIndex = blogTexts.findIndex(text => text.includes(second))
  const thirdIndex = blogTexts.findIndex(text => text.includes(third))

  expect(firstIndex).toBeGreaterThanOrEqual(0)
  expect(secondIndex).toBeGreaterThanOrEqual(0)
  expect(thirdIndex).toBeGreaterThanOrEqual(0)
  expect(secondIndex).toBeLessThan(thirdIndex)
  expect(thirdIndex).toBeLessThan(firstIndex)
})
  })
})