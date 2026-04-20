const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  await page.goto('http://localhost:8080/');

  // Wait for the game to load
  await page.waitForTimeout(2000);
  console.log('Game loaded');

  // Take a screenshot of the start menu
  await page.screenshot({ path: 'screenshot_menu.png' });

  // Play Game button should be there, it's drawn via Phaser so we'll simulate a click in the center
  await page.mouse.click(400, 300); // Click "Play Game"
  await page.waitForTimeout(1000);

  console.log('Clicked Play Game');
  await page.screenshot({ path: 'screenshot_level1.png' });

  // Click first bottle (x: ~320, y: ~400)
  await page.mouse.click(320, 400);
  await page.waitForTimeout(500);

  // Click empty bottle (last bottle) (x: ~480, y: ~400) - wait... bottleWidth = 60, spacing = 20, 4 bottles
  // totalWidth = 4*60 + 3*20 = 240 + 60 = 300
  // startX = (800 - 300)/2 + 30 = 250 + 30 = 280
  // bottle 0: 280
  // bottle 1: 360
  // bottle 2: 440
  // bottle 3: 520 (empty)

  // click bottle 0
  await page.mouse.click(280, 400);
  await page.waitForTimeout(500);

  // click bottle 3
  await page.mouse.click(520, 400);
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'screenshot_pour.png' });

  console.log('Test completed.');
  await browser.close();
})();
