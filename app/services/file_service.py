from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile


UPLOAD_DIR = Path("uploads")

ALLOWED_EXTENSIONS = {
    ".mp3",
    ".wav",
    ".m4a",
    ".mp4",
    ".mov",
    ".mkv"
}


def save_uploaded_file(file: UploadFile) -> dict:
    """
    Validate and save an uploaded audio/video file.
    """

    if not file.filename:
        raise ValueError("Filename is missing")

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file type: {extension}"
        )

    UPLOAD_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    unique_filename = f"{uuid4()}{extension}"

    file_path = UPLOAD_DIR / unique_filename

    with open(file_path, "wb") as buffer:
        while chunk := file.file.read(1024 * 1024):
            buffer.write(chunk)

    return {
        "original_filename": file.filename,
        "saved_filename": unique_filename,
        "file_path": str(file_path),
        "file_type": extension
    }