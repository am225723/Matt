
import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        await page.goto("http://localhost:5173", timeout=120000)

        # Wait for the main dashboard to load
        await page.wait_for_selector("div.grid.grid-cols-1.md\\:grid-cols-3", timeout=120000)

        # Verify Excuse Reframe
        await page.get_by_role("button", name="Excuse Reframing").click()
        await expect(page).to_have_url("http://localhost:5173/")
        await page.get_by_placeholder("e.g., I'm too tired to exercise...").fill("I'm too busy to meditate.")
        await page.get_by_role("button", name="Reframe with AI").click()
        await expect(page.get_by_text("Empowered Perspective:")).to_be_visible(timeout=20000)
        await page.screenshot(path="jules-scratch/verification/excuse-reframe.png")

        await browser.close()

asyncio.run(main())
