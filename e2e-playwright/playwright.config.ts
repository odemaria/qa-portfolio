import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // Firefox en Windows se pone inestable con muchos procesos en paralelo
  workers: isCI ? 2 : 4,
  reporter: isCI ? [['list'], ['html', { open: 'never' }], ['github']] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://www.saucedemo.com',
    // SauceDemo marca sus elementos con data-test: getByTestId los usa directo
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
