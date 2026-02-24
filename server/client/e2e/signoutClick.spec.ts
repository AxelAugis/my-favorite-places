import { test, expect } from '@playwright/test'

test('signout click', async ({ page }) => {
    await page.route('**/api/users/me', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ 
                item: { id: '1', email: 'a@a.com', firstname: 'Test' } 
            }),
        });
    });

    // On intercepte la déconnexion
    await page.route('**/api/users/tokens', async (route) => {
        if (route.request().method() === 'DELETE') {
            await route.fulfill({ status: 204 });
        } else {
            await route.continue();
        }
    });

    await page.goto('http://localhost:3000/login');

    await page.getByTestId('input-email').fill('a@a.com');
    await page.getByTestId('input-password').fill('password');

    await page.getByTestId('login-button').click();

    const logoutBtn = page.getByTestId('logout-btn');
    
    await expect(logoutBtn).toBeVisible();
    
    await logoutBtn.click();

});