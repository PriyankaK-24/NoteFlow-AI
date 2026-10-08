from pathlib import Path
import json
import time
import asyncio

from fastapi import APIRouter, File, UploadFile, HTTPException

from app.services.file_service import save_uploaded_file
from app.services.whisper_service import transcribe_audio
from app.services.llm_service import analyze_meeting
from app.services.deepgram_services import transcribe_with_deepgram

from app.database.database import SessionLocal
from app.database.models import Meeting, ActionItem

from app.schemas.meeting import MeetingURLRequest
from app.services.source_service import download_from_url


router = APIRouter(
    prefix="/meetings",
    tags=["Meetings"]
)


@router.post("/upload")
async def upload_meeting(
    file: UploadFile = File(...)
):
    try:
        file_info = save_uploaded_file(file)

        return {
            "message": "File uploaded successfully",
            "file": file_info
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.post("/{filename}/transcribe")
async def transcribe_meeting(filename: str):

    file_path = Path("uploads") / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    try:
        transcript = transcribe_audio(str(file_path))

        return {
            "message": "Transcription completed successfully",
            "filename": filename,
            "transcript": transcript
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed: {str(error)}"
        )


@router.post("/{filename}/process")
async def process_meeting(filename: str):

    file_path = Path("uploads") / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    db = SessionLocal()

    try:
        # Step 1: Transcribing the meeting
        print("🔥 ABOUT TO START WHISPER")
        start_time = time.time()

        transcript = transcribe_audio(str(file_path))

        transcription_time = time.time() - start_time

        print(
            f"⏱️ Transcription completed in {transcription_time:.2f} seconds"
        )

        # Step 2: Analyzing the transcript using Gemini
        start_time = time.time()

        analysis = analyze_meeting(transcript)

        llm_time = time.time() - start_time

        print(
            f"⏱️ LLM analysis completed in {llm_time:.2f} seconds"
        )

        # Step 3: Creating the meeting record
        meeting = Meeting(
            filename=filename,
            transcript=transcript,
            summary=analysis.summary,
            key_decisions=json.dumps(analysis.key_decisions),
            topics=json.dumps(analysis.topics),
            risks=json.dumps(analysis.risks)
        )

        db.add(meeting)
        db.commit()
        db.refresh(meeting)

        # Step 4: Saving action items
        for item in analysis.action_items:

            action_item = ActionItem(
                meeting_id=meeting.id,
                task=item.task,
                owner=item.owner,
                deadline=item.deadline,
                status="Pending"
            )

            db.add(action_item)

        db.commit()

        return {
            "message": "Meeting processed and saved successfully",
            "meeting_id": meeting.id,
            "filename": filename,
            "transcript": transcript,
            "analysis": analysis.model_dump()
        }

    except Exception as error:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Meeting processing failed: {str(error)}"
        )

    finally:
        db.close()

@router.get("/")
async def get_meetings():

    db = SessionLocal()

    try:
        meetings = db.query(Meeting).order_by(
            Meeting.created_at.desc()
        ).all()

        result = []

        for meeting in meetings:

            result.append({
                "id": meeting.id,
                "filename": meeting.filename,
                "summary": meeting.summary,
                "key_decisions": json.loads(
                    meeting.key_decisions
                ) if meeting.key_decisions else [],
                "topics": json.loads(
                    meeting.topics
                ) if meeting.topics else [],
                "risks": json.loads(
                    meeting.risks
                ) if meeting.risks else [],
                "created_at": meeting.created_at,
                "action_items": [
                    {
                        "id": item.id,
                        "task": item.task,
                        "owner": item.owner,
                        "deadline": item.deadline,
                        "status": item.status
                    }
                    for item in meeting.action_items
                ]
            })

        return result

    finally:
        db.close()

@router.post("/process-url")
async def process_meeting_url(request: MeetingURLRequest):

    db = SessionLocal()

    try:
        # Step 1: Retrieving media from URL
        start_time = time.time()

        file_path = download_from_url(request.url)

        print(
            f"⏱️ Step 1 - Media retrieval: "
            f"{time.time() - start_time:.2f} seconds"
        )

        filename = Path(file_path).name

        # Step 2: Transcribing with Whisper
        step2_start = time.perf_counter()

        transcript = transcribe_audio(file_path)

        step2_time = time.perf_counter() - step2_start

        print("Whisper words:", len(transcript.split()))
        print(
            f"⏱️ Step 2 - Transcription: "
            f"{step2_time:.2f} seconds"
        )
        
        # Step 3: Analyzing with Gemini
        start_time = time.time()

        analysis = analyze_meeting(transcript)

        print(
            f"⏱️ Step 3 - Gemini analysis: "
            f"{time.time() - start_time:.2f} seconds"
        )


        # Step 4: Saving meeting
        start_time = time.time()

        meeting = Meeting(
            filename=filename,
            transcript=transcript,
            summary=analysis.summary,
            key_decisions=json.dumps(
                analysis.key_decisions
            ),
            topics=json.dumps(
                analysis.topics
            ),
            risks=json.dumps(
                analysis.risks
            )
        )

        db.add(meeting)
        db.commit()
        db.refresh(meeting)

        print(
            f"⏱️ Step 4 - Save meeting: "
            f"{time.time() - start_time:.2f} seconds"
        )


        # Step 5: Save action items
        start_time = time.time()

        for item in analysis.action_items:

            action_item = ActionItem(
                meeting_id=meeting.id,
                task=item.task,
                owner=item.owner,
                deadline=item.deadline,
                status="Pending"
            )

            db.add(action_item)

        db.commit()

        print(
            f"⏱️ Step 5 - Save action items: "
            f"{time.time() - start_time:.2f} seconds"
        )


        return {
            "message": "Meeting URL processed and saved successfully",
            "meeting_id": meeting.id,
            "filename": filename,
            "source_url": request.url,
            "transcript": transcript,
            "analysis": analysis.model_dump()
        }

    except ValueError as error:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"URL processing failed: {str(error)}"
        )

    finally:
        db.close()

@router.patch("/action-items/{action_item_id}")
async def update_action_item(
    action_item_id: int,
    status: str
):

    db = SessionLocal()

    try:
        action_item = db.query(ActionItem).filter(
            ActionItem.id == action_item_id
        ).first()

        if not action_item:
            raise HTTPException(
                status_code=404,
                detail="Action item not found"
            )

        allowed_statuses = ["Pending", "In Progress", "Completed"]

        if status not in allowed_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Choose from: {allowed_statuses}"
            )

        action_item.status = status

        db.commit()
        db.refresh(action_item)

        return {
            "message": "Action item updated successfully",
            "action_item": {
                "id": action_item.id,
                "meeting_id": action_item.meeting_id,
                "task": action_item.task,
                "owner": action_item.owner,
                "deadline": action_item.deadline,
                "status": action_item.status
            }
        }

    finally:
        db.close()   

@router.delete("/{meeting_id}")
async def delete_meeting(meeting_id: int):

    db = SessionLocal()

    try:
        meeting = db.query(Meeting).filter(
            Meeting.id == meeting_id
        ).first()

        if not meeting:
            raise HTTPException(
                status_code=404,
                detail="Meeting not found"
            )

        db.delete(meeting)
        db.commit()

        return {
            "message": "Meeting deleted successfully",
            "meeting_id": meeting_id
        }

    except Exception as error:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete meeting: {str(error)}"
        )

    finally:
        db.close()  

