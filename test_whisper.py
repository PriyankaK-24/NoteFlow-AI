import time

from app.services.whisper_service import transcribe_audio


file_path = "uploads/d4b71bd3-ed75-468f-a25f-792bd53405ee.webm"

start = time.perf_counter()

transcript = transcribe_audio(file_path)

print("\n--- TRANSCRIPT ---")
print(transcript)

elapsed = time.perf_counter() - start

print(f"Whisper transcription: {elapsed:.2f} seconds")
print("Transcript characters:", len(transcript))
print("Transcript words:", len(transcript.split()))