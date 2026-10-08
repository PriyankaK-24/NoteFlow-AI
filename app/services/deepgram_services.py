import os
from dotenv import load_dotenv
from deepgram import DeepgramClient

load_dotenv()

api_key = os.getenv("DEEPGRAM_API_KEY")

if not api_key:
    raise ValueError("DEEPGRAM_API_KEY not found in .env")

client = DeepgramClient(api_key=api_key)

def transcribe_with_deepgram(file_path: str) -> str:
    """
    Transcribe an audio/video file using Deepgram Nova-3.
    """

    with open(file_path, "rb") as audio:
        payload = audio.read()

    response = client.listen.v1.media.transcribe_file(
        request=payload,
        model="nova-3",
        language="en",
        smart_format=True,
        punctuate=True,
        utterances=True,
    )

    return response.results.channels[0].alternatives[0].transcript