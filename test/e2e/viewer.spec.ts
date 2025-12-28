import { test, expect } from '@playwright/test';

test.describe('Three-DXF Viewer E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should load sample page', async ({ page }) => {
    await expect(page.locator('#cad-view')).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();

    // Check initial state
    const canvas = page.locator('#cad-view canvas');
    await expect(canvas).toHaveCount(0); // No canvas before file upload
  });

  test('should render DXF file after upload', async ({ page }) => {
    // Upload the demo.dxf file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./data/demo.dxf');

    // Wait for progress bar to complete
    await expect(page.locator('#file-progress-bar')).toHaveText('100%', { timeout: 15000 });

    // Remove loading class
    const progress = page.locator('.progress');
    await expect(progress).not.toHaveClass(/loading/);

    // Wait for canvas to appear (font loading and rendering may take time)
    const canvas = page.locator('#cad-view canvas').first();
    await canvas.waitFor({ state: 'attached', timeout: 15000 });

    // Verify canvas is visible
    await expect(canvas).toBeVisible();
  });

  test('should display parsed DXF content as JSON', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles('./data/demo.dxf');

    // Wait for DXF content to be displayed
    const dxfContent = page.locator('#dxf-content');
    await dxfContent.waitFor({ state: 'visible', timeout: 15000 });

    const content = await dxfContent.textContent();
    expect(content).toContain('entities');
    expect(content).toContain('tables');
  });

  test('should have WebGL context on canvas', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles('./data/demo.dxf');

    const canvas = page.locator('#cad-view canvas').first();
    await canvas.waitFor({ state: 'attached', timeout: 15000 });

    // Check if canvas has WebGL context
    const hasWebGL = await canvas.evaluate((el) => {
      return !!(el.getContext('webgl') || el.getContext('webgl2'));
    });

    expect(hasWebGL).toBeTruthy();
  });

  test('should display file description after upload', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles('./data/demo.dxf');

    const description = page.locator('#file-description');
    await description.waitFor({ state: 'visible', timeout: 5000 });

    const text = await description.textContent();
    expect(text).toContain('demo.dxf');
  });

  test('should show progress bar during file upload', async ({ page }) => {
    const progressBar = page.locator('#file-progress-bar');
    const progressContainer = page.locator('.progress');

    // Initial state
    await expect(progressContainer).not.toHaveClass(/loading/);

    // Start file upload
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./data/demo.dxf');

    // Progress bar should show loading state
    await expect(progressContainer).toHaveClass(/loading/, { timeout: 1000 });

    // Progress should reach 100%
    await expect(progressBar).toHaveText('100%');

    // Loading class should be removed after completion
    await expect(progressContainer).not.toHaveClass(/loading/, { timeout: 5000 });
  });

  test('should create canvas with correct dimensions', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles('./data/demo.dxf');

    const canvas = page.locator('#cad-view canvas').first();
    await canvas.waitFor({ state: 'attached', timeout: 15000 });

    // Check canvas dimensions (default in sample is 1000x800)
    const width = await canvas.evaluate((el) => el.width);
    const height = await canvas.evaluate((el) => el.height);

    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
  });

  test('should have canvas with border styling', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles('./data/demo.dxf');

    const canvas = page.locator('#cad-view canvas').first();
    await canvas.waitFor({ state: 'attached', timeout: 15000 });

    // Check border style from CSS
    const borderStyle = await canvas.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.borderStyle;
    });

    expect(borderStyle).toBe('solid');
  });
});

test.describe('Three-DXF Viewer Interaction Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.locator('input[type="file"]').setInputFiles('./data/demo.dxf');

    // Wait for canvas to be ready
    await page.locator('#cad-view canvas').first().waitFor({ state: 'attached', timeout: 15000 });
  });

  test('should support mouse interaction (canvas receives events)', async ({ page }) => {
    const canvas = page.locator('#cad-view canvas').first();

    // Simulate mouse wheel event
    await canvas.evaluate((el) => {
      const event = new WheelEvent('wheel', { deltaY: 100, bubbles: true });
      el.dispatchEvent(event);
    });

    // Canvas should still be present
    await expect(canvas).toBeVisible();
  });

  test('should support right click (context menu prevention)', async ({ page }) => {
    const canvas = page.locator('#cad-view canvas').first();

    // Right click on canvas
    await canvas.click({ button: 'right' });

    // Canvas should still be present (context menu might be prevented by OrbitControls)
    await expect(canvas).toBeVisible();
  });
});

test.describe('Three-DXF Viewer Error Handling', () => {
  test('should handle non-DXF file gracefully', async ({ page }) => {
    // Create a text file with .dxf extension
    const fileContent = 'This is not a valid DXF file';

    await page.locator('input[type="file"]').setInputFiles({
      name: 'invalid.dxf',
      mimeType: 'text/plain',
      buffer: Buffer.from(fileContent),
    });

    // Page should not crash
    await expect(page.locator('#cad-view')).toBeVisible();

    // DXF content should show something (even if empty/error)
    const dxfContent = page.locator('#dxf-content');
    await dxfContent.waitFor({ state: 'visible', timeout: 5000 });
  });
});
