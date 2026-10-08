import { useEffect, useState } from "react";
import {
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ListChecks,
} from "lucide-react";
import { getMeetings } from "../services/api";

function History() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const data = await getMeetings();
        setMeetings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMeetings();
  }, []);

  return (
    <section className="history-page">

      {/* BACK BUTTON */}

      <button
        type="button"
        className="back-button"
        onClick={() => {
          window.location.href = "/meetings";
        }}
      >
        <ArrowLeft size={17} />
        Back to Meetings
      </button>


      {/* HEADER */}

      <div className="history-header">
        <p className="eyebrow">YOUR MEETINGS</p>

        <h1>Meeting History</h1>

        <p>
          Your conversations, all in one place.
        </p>
      </div>


      {/* LOADING */}

      {loading && (
        <div className="history-empty">
          <div className="history-loading-icon">
            <FileText size={28} />
          </div>

          <p>Loading your meetings...</p>
        </div>
      )}


      {/* ERROR */}

      {error && (
        <div className="history-error">
          {error}
        </div>
      )}


      {/* EMPTY STATE */}

      {!loading && !error && meetings.length === 0 && (
        <div className="history-empty">

          <div className="history-empty-icon">
            <FileText size={30} />
          </div>

          <h3>No meetings yet</h3>

          <p>
            Your processed meetings will appear here.
          </p>

          <button
            type="button"
            className="history-start-button"
            onClick={() => {
              window.location.href = "/meetings";
            }}
          >
            Process a meeting
            <ArrowRight size={16} />
          </button>

        </div>
      )}


      {/* MEETING LIST */}

      {!loading && !error && meetings.length > 0 && (
        <div className="meeting-list">

          {meetings.map((meeting) => {

            const decisionCount =
              meeting.decisions?.length || 0;

            const actionCount =
              meeting.action_items?.length || 0;

            const formattedDate =
              new Date(
                meeting.created_at
              ).toLocaleDateString(
                undefined,
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              );

            return (
              <div
                className="meeting-history-card"
                key={meeting.id}
              >

                {/* ICON */}

                <div className="history-icon">
                  <FileText size={20} />
                </div>


                {/* CONTENT */}

                <div className="meeting-history-info">

                  <div className="history-card-top">

                    <h3>
                      Meeting Notes
                    </h3>

                    <span className="meeting-date">
                      {formattedDate}
                    </span>

                  </div>


                  <p className="history-summary">
                    {meeting.summary}
                  </p>


                  {/* META */}

                  <div className="history-meta">

                    <span>
                      <CheckCircle2 size={14} />
                      {decisionCount}{" "}
                      {decisionCount === 1
                        ? "decision"
                        : "decisions"}
                    </span>

                    <span className="history-meta-divider">
                      •
                    </span>

                    <span>
                      <ListChecks size={14} />
                      {actionCount}{" "}
                      {actionCount === 1
                        ? "action item"
                        : "action items"}
                    </span>

                  </div>

                </div>


                {/* VIEW BUTTON */}

                <button
                  type="button"
                  className="view-meeting"
                  onClick={() => {
                    window.location.href =
                      `/meetings/${meeting.id}`;
                  }}
                >
                  <span>View</span>
                  <ArrowRight size={17} />
                </button>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default History;