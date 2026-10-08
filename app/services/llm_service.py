import os
import time 

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.schemas.meeting import MeetingAnalysis


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")


client = genai.Client(
    api_key=api_key,
    http_options=types.HttpOptions(
        timeout=30000,
        retry_options=types.HttpRetryOptions(
            attempts=2,
            initial_delay=1.0,
            max_delay=5.0,
        ),
    ),
)

def analyze_meeting(transcript: str) -> MeetingAnalysis:
    """
    Analyze a meeting transcript using Gemini
    and return a validated MeetingAnalysis object.
    """

    prompt = f"""
You are an AI Meeting Assistant.

Analyze the following meeting transcript.

Extract:

1. A concise meeting summary.
2. Important decisions made during the meeting.
3. Action items, including the responsible person and deadline.
4. Main discussion topics.
5. Risks or concerns mentioned.

Important rules:

- Do not invent information.
- If an owner is not mentioned, use "Unknown".
- If a deadline is not mentioned, use "Unknown".
- Keep the summary concise.
- Only extract information supported by the transcript.

Meeting transcript:

{transcript}
"""
    print("Transcript characters:", len(transcript))
    print("Transcript words:", len(transcript.split()))

    start_time = time.time()

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": MeetingAnalysis,
        },
    )
    print(
        f"Gemini API call: "
        f"{time.time() - start_time:.2f} seconds"
    )

    return MeetingAnalysis.model_validate_json(response.text)