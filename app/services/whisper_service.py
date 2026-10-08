from faster_whisper import WhisperModel

MODEL_NAME = "small"

model = WhisperModel(
    MODEL_NAME,
    device="cpu",
    compute_type="int8"
)

def transcribe_audio(file_path: str) -> str:
    """
    Transcribe an audio or video file using faster-whisper.
    """

    segments, info = model.transcribe ( 
        file_path,
        language="en",
        beam_size=1, 
        initial_prompt=(
            "This is a technical meeting about software development, "
            "AI, APIs, backend development, Python, FastAPI, "
            "PostgreSQL, databases, Gemini, Whisper, "
            "meeting notes, action items, and project development."
        )
    )
    print("Audio duration:", info.duration, "seconds")

    transcript = " ".join(
        segment.text.strip()
        for segment in segments
    )

    return transcript.strip()