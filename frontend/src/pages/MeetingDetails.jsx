import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  ListChecks,
  Tags,
  ChevronDown,
} from "lucide-react";
import { getMeetingById } from "../services/api";

function MeetingDetails({ meetingId }) {
  const id = meetingId;

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const data = await getMeetingById(id);
        setMeeting(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load meeting.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [id]);

  if (loading) {
    return (
      <div className="meeting-details-state">
        <p>Loading meeting...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meeting-details-state error">
        <p>{error}</p>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="meeting-details-state">
        <p>Meeting not found.</p>
      </div>
    );
  }

  return (
    <div className="meeting-details-page">

      {/* BACK BUTTON */}
      <button
        type="button"
        className="back-button"
        onClick={() => {
            window.location.href = "/history";
        }}>
        <ArrowLeft size={17} />
         Back to History
      </button>


      {/* PAGE HEADER */}
      <header className="meeting-details-header">

        <div className="meeting-header-icon">
          <FileText size={30} />
        </div>

        <div>
          <p className="meeting-eyebrow">
            MEETING ANALYSIS
          </p>

          <h1>Meeting Notes</h1>

          <p className="meeting-subtitle">
            AI-generated insights from your conversation
          </p>
        </div>

      </header>


      {/* SUMMARY */}
      <section className="notes-card summary-card">

        <div className="card-heading">
          <div className="card-icon purple">
            <FileText size={19} />
          </div>

          <h2>Summary</h2>
        </div>

        <p className="summary-text">
          {meeting.summary}
        </p>

      </section>


      {/* DECISIONS + ACTION ITEMS */}
      <div className="notes-grid">

        {/* KEY DECISIONS */}
        <section className="notes-card">

          <div className="card-heading">
            <div className="card-icon green">
              <CheckCircle2 size={19} />
            </div>

            <h2>Key Decisions</h2>
          </div>

          <div className="decision-list">

            {meeting.decisions?.length > 0 ? (
              meeting.decisions.map((decision, index) => (
                <div className="decision-item" key={index}>
                  <span className="decision-check">
                    <CheckCircle2 size={16} />
                  </span>

                  <p>{decision}</p>
                </div>
              ))
            ) : (
              <p className="empty-text">
                No key decisions identified.
              </p>
            )}

          </div>

        </section>


        {/* ACTION ITEMS */}
        <section className="notes-card">

          <div className="card-heading">
            <div className="card-icon blue">
              <ListChecks size={19} />
            </div>

            <h2>Action Items</h2>
          </div>

          <div className="action-list">

            {meeting.action_items?.length > 0 ? (
              meeting.action_items.map((item, index) => {

                const task =
                  typeof item === "string"
                    ? item
                    : item.task;

                return (
                  <label
                    className="action-item"
                    key={index}
                  >
                    <input type="checkbox" />

                    <span>{task}</span>
                  </label>
                );
              })
            ) : (
              <p className="empty-text">
                No action items identified.
              </p>
            )}

          </div>

        </section>

      </div>


      {/* TOPICS */}
      <section className="notes-card topics-card">

        <div className="card-heading">
          <div className="card-icon orange">
            <Tags size={19} />
          </div>

          <h2>Topics</h2>
        </div>

        <div className="topic-list">

          {meeting.topics?.map((topic, index) => (
            <span
              className="topic-pill"
              key={index}
            >
              {topic}
            </span>
          ))}

        </div>

      </section>


      {/* TRANSCRIPT */}
      {meeting.transcript && (
        <section className="notes-card transcript-card">

          <button
            className="transcript-toggle"
            onClick={() =>
              setShowTranscript(!showTranscript)
            }
          >

            <div className="card-heading">
              <div className="card-icon purple">
                <FileText size={19} />
              </div>

              <h2>Transcript</h2>
            </div>

            <ChevronDown
              size={20}
              className={
                showTranscript
                  ? "rotate"
                  : ""
              }
            />

          </button>


          {showTranscript && (
            <div className="transcript-content">
              {meeting.transcript}
            </div>
          )}

        </section>
      )}

    </div>
  );
}

export default MeetingDetails;