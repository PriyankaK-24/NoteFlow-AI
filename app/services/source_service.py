import uuid
from pathlib import Path
from urllib.parse import urlparse

import gdown
import requests
import yt_dlp


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def detect_source(url: str) -> str:
    """
    Detect the type of URL internally.
    The user does not need to specify the source.
    """

    parsed_url = urlparse(url)
    domain = parsed_url.netloc.lower()

    if "youtube.com" in domain or "youtu.be" in domain:
        return "youtube"

    if "drive.google.com" in domain:
        return "google_drive"

    return "direct"


def download_from_url(url: str) -> str:
    """
    Download media from a supported URL and
    return the local file path.
    """

    source_type = detect_source(url)

    output_id = str(uuid.uuid4())

    if source_type == "youtube":
        return download_youtube(url, output_id)

    elif source_type == "google_drive":
        return download_google_drive(url, output_id)

    elif source_type == "direct":
        return download_direct(url, output_id)

    raise ValueError("Unsupported URL source.")


def download_youtube(url: str, output_id: str) -> str:

    output_template = str(
        UPLOAD_DIR / f"{output_id}.%(ext)s"
    )

    options = {
        "format": "bestaudio/best",
        "outtmpl": str(output_template),
        "quiet": False,
        "noplaylist": True,
    }

    with yt_dlp.YoutubeDL(options) as ydl:
        ydl.download([url])

    downloaded_files = list(
        UPLOAD_DIR.glob(f"{output_id}.*")
    )

    if not downloaded_files:
        raise RuntimeError(
            "Unable to download YouTube media."
        )

    return str(downloaded_files[0])


def download_google_drive(url: str, output_id: str):

    import time

    output_path = UPLOAD_DIR / f"{output_id}.mp4"

    print("🔵 Starting Google Drive download...")
    start_time = time.perf_counter()

    downloaded = gdown.download(
        url,
        str(output_path),
        quiet=False
    )

    download_time = time.perf_counter() - start_time

    print(
        f"🔵 Google Drive download took: "
        f"{download_time:.2f} seconds"
    )

    if not downloaded or not output_path.exists():
        raise RuntimeError(
            "Unable to download the Google Drive file. "
            "Make sure the file is publicly accessible."
        )

    print(
        f"🔵 Downloaded file size: "
        f"{output_path.stat().st_size / (1024 * 1024):.2f} MB"
    )

    return str(output_path)

def download_direct(url: str, output_id: str) -> str:

    response = requests.get(
        url,
        stream=True,
        timeout=60
    )

    response.raise_for_status()

    content_type = response.headers.get(
        "content-type",
        ""
    ).lower()

    allowed_types = [
        "audio/",
        "video/"
    ]

    if not any(
        content_type.startswith(item)
        for item in allowed_types
    ):
        raise ValueError(
            "The provided URL does not appear to point "
            "directly to an audio or video file."
        )

    extension = get_extension_from_content_type(
        content_type
    )

    output_path = (
        UPLOAD_DIR /
        f"{output_id}{extension}"
    )

    with open(output_path, "wb") as file:

        for chunk in response.iter_content(
            chunk_size=8192
        ):

            if chunk:
                file.write(chunk)

    return str(output_path)


def get_extension_from_content_type(
    content_type: str
) -> str:

    extensions = {
        "audio/mpeg": ".mp3",
        "audio/mp4": ".m4a",
        "audio/wav": ".wav",
        "audio/x-wav": ".wav",
        "video/mp4": ".mp4",
        "video/webm": ".webm",
        "video/quicktime": ".mov",
    }

    return extensions.get(
        content_type.split(";")[0],
        ".media"
    )