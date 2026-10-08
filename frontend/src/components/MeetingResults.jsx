import { useState } from "react";
import {
  FileText,
  CheckCircle2,
  ListChecks,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function MeetingResults({ result }) {
  const [showTranscript, setShowTranscript] = useState(false);

  const analysis = result.analysis;

  return (
    <section className="meeting-results">

      {/* Header */}
      <div className="results-header">
        <div className="results-icon">
          <FileText size={24} />
        </div>

        <div>
          <p className="eyebrow">MEETING ANALYSIS</p>
          <h2>Your meeting notes</h2>
          <p className="results-filename">{result.filename}</p>
        </div>
      </div>


      {/* Summary */}
      <div className="result-card summary-card">
        <div className="result-title">
          <FileText size={19} />
          <h3>Summary</h3>
        </div>

        <p className="summary-text">
          {analysis.summary}
        </p>
      </div>


      {/* Key Decisions */}
      <div className="result-card">
        <div className="result-title">
          <CheckCircle2 size={19} />
          <h3>Key Decisions</h3>
        </div>

        {analysis.key_decisions?.length > 0 ? (
          <div className="simple-list">
            {analysis.key_decisions.map((decision, index) => (
              <div className="list-item" key={index}>
                <span className="bullet-icon">✓</span>
                <span>{decision}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-result">
            No key decisions identified.
          </p>
        )}
      </div>


      {/* Action Items */}
      <div className="result-card">
        <div className="result-title">
          <ListChecks size={19} />
          <h3>Action Items</h3>
        </div>

        {analysis.action_items?.length > 0 ? (
          <div className="simple-list">
            {analysis.action_items.map((item, index) => (
              <div className="list-item" key={index}>
                <span className="checkbox"></span>
                <span>{item.task}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-result">
            No action items identified.
          </p>
        )}
      </div>


      {/* Topics */}
      <div className="result-card">
        <div className="result-title">
          <Tag size={19} />
          <h3>Topics</h3>
        </div>

        {analysis.topics?.length > 0 ? (
          <div className="topic-list">
            {analysis.topics.map((topic, index) => (
              <span key={index}>{topic}</span>
            ))}
          </div>
        ) : (
          <p className="empty-result">
            No topics identified.
          </p>
        )}
      </div>


      {/* Optional Transcript */}
      <div
        className="transcript-card"
        onClick={() => setShowTranscript(!showTranscript)}
      >
        <div className="transcript-header">
          <div className="result-title">
            <FileText size={19} />
            <h3>Transcript</h3>
          </div>

          {showTranscript ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </div>

        {showTranscript && (
          <div className="transcript-content">
            {result.transcript}
          </div>
        )}
      </div>

    </section>
  );
}

export default MeetingResults;