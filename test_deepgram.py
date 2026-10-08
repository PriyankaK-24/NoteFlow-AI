import time

from app.services.deepgram_services import transcribe_with_deepgram

file_path = "uploads/test_audio.wav"

start = time.perf_counter()

transcript = transcribe_with_deepgram(file_path)

elapsed = time.perf_counter() - start

print(f"Deepgram transcription: {elapsed:.2f} seconds")
print("Transcript characters:", len(transcript))
print("Transcript words:", len(transcript.split()))

print("\n--- TRANSCRIPT ---")
print(transcript)