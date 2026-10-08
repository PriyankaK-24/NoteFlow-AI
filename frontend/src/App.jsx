import { useState } from "react";

import Navbar from "./components/Navbar";
import MeetingInput from "./components/MeetingInput";
import MeetingResults from "./components/MeetingResults";
import History from "./pages/History";
import MeetingDetails from "./pages/MeetingDetails";

import "./App.css";


function Intro() {
  const handleStart = () => {
    window.location.href = "/meetings";
  };

  return (
    <main className="intro-page">

      <div className="intro-glow intro-glow-one"></div>
      <div className="intro-glow intro-glow-two"></div>

      <div className="intro-content">

        <div className="intro-symbol">
          ✦
        </div>

        <p className="intro-eyebrow">
          AI MEETING INTELLIGENCE
        </p>

        <h1>
          Your meetings.
          <br />
          <span>Made actionable.</span>
        </h1>

        <p className="intro-description">
          NoteFlow AI transforms your meeting recordings into
          clear summaries, key decisions, and actionable notes —
          so you can focus on what actually matters.
        </p>

        <button
          type="button"
          className="intro-start-button"
          onClick={handleStart}
        >
          Let's Start
          <span>→</span>
        </button>

        <p className="intro-footer">
          Upload a recording · Get intelligent notes
        </p>

      </div>

    </main>
  );
}


function Home() {
  const [meetingResult, setMeetingResult] = useState(null);

  return (
    <main className="main-content">

      <section className="hero">

        <p className="eyebrow">
          AI MEETING INTELLIGENCE
        </p>

        <h1>
          Turn meetings into
          <span> action.</span>
        </h1>

        <p className="hero-description">
          Upload a recording or paste a meeting link.
          NoteFlow AI turns your conversations into clear
          summaries, decisions, and actionable tasks.
        </p>

      </section>

      <MeetingInput
        onResult={setMeetingResult}
      />

      {meetingResult && (
        <MeetingResults
          result={meetingResult}
        />
      )}

    </main>
  );
}


function App() {

  const path = window.location.pathname;

  /* Intro / Landing page */
  if (path === "/") {
    return (
      <div className="app intro-app">
        <Intro />
      </div>
    );
  }

  /* History page */
  if (path === "/history") {
    return (
      <div className="app">
        <Navbar />

        <main className="main-content">
          <History />
        </main>
      </div>
    );
  }

  /* Meeting details page */
  const meetingMatch = path.match(/^\/meetings\/(\d+)$/);

  if (meetingMatch) {

    const meetingId = meetingMatch[1];

    return (
      <div className="app">
        <Navbar />

        <main className="main-content">
          <MeetingDetails
            meetingId={meetingId}
          />
        </main>
      </div>
    );
  }

  /* Meeting workspace */
  if (path === "/meetings") {
    return (
      <div className="app">
        <Navbar />

        <Home />
      </div>
    );
  }

  /* Fallback */
  window.location.href = "/";

  return null;
}

export default App;