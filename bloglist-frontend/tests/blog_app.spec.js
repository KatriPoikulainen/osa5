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
    await page.getByRole('button', { name: 'create new blog' }).click()

    const inputs = page.getByRole('textbox')

    await inputs.nth(0).fill('Playwright testing')
    await inputs.nth(1).fill('Katri')
    await inputs.nth(2).fill('http://playwright.test')
    await page.getByRole('button', { name: 'create' }).click()
    await expect(page.getByText('Playwright testing Katri')).toBeVisible()
  })
})
})