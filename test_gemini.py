from app.services.llm_service import analyze_meeting
import time

transcript = """
Today we discussed the project website and the tasks for the team.
The team decided to update the LinkedIn integration and improve the
project documentation. John will complete the integration by Friday.
Sarah will prepare the documentation. We also discussed future podcast
and research features.
"""

start = time.perf_counter()

result = analyze_meeting(transcript)

print(f"Total Gemini test time: {time.perf_counter() - start:.2f} seconds")
print(result)