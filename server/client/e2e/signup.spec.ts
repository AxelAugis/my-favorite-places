import { test, expect } from '@playwright/test'

test('signup flow', async ({ page }) => {
    await page.route('**/api/users/me', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ 
                item: { id: '2', email: 'newuser@test.com', firstname: 'John' } 
            }),
        });
    });

    await page.route('**/api/users', async (route) => {
        if (route.request().method() === 'POST') {
            await route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'User created successfully' }),
            });
        } else {
            await route.continue();
        }
    });

    await page.goto('http://localhost:3000/signup');

    await page.getByTestId('input-email').fill('newuser@test.com');
    await page.getByTestId('input-password').fill('Password123!');
    await page.getByTestId('input-confirm-password').fill('Password123!');

    await page.getByTestId('submit-btn').click();

    const logoutBtn = page.getByTestId('logout-btn');
    await expect(logoutBtn).toBeVisible({ timeout: 5000 });

    await page.goto('http://localhost:3000');

    await expect(page).not.toHaveURL(/\/signup/);
    await expect(logoutBtn).toBeVisible({ timeout: 5000 });
});