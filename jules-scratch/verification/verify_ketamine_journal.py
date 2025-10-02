import re
from playwright.sync_api import Page, expect

def test_ketamine_journal_flow(page: Page):
    # 1. Arrange: Go to the application's homepage.
    page.goto("http://localhost:5173")

    # 2. Act: Navigate to the Ketamine Journal.
    page.get_by_role("button", name="Ketamine Journal").click()

    # 3. Assert: Check that the Ketamine Journal page is loaded.
    expect(page.get_by_role("heading", name="Ketamine Journal")).to_be_visible()

    # 4. Act: Start and stop recording.
    page.get_by_role("button", name="Start Recording").click()
    page.wait_for_timeout(2000)  # Record for 2 seconds
    page.get_by_role("button", name="Stop Recording").click()

    # 5. Assert: Check that the transcription is displayed.
    # The transcription is not deterministic, so we check that the text area is not empty.
    expect(page.get_by_placeholder("Your transcribed response will appear here...")).not_to_be_empty()

    # 6. Act: Generate a follow-up question.
    page.get_by_role("button", name="Generate Follow-up").click()

    # 7. Assert: Check that the AI response and "Speak" button are visible.
    expect(page.get_by_text("Speak")).to_be_visible()

    # 8. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/ketamine_journal_verification.png")