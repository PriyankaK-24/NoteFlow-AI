import { useRef, useState } from "react";
import {
  Upload,
  Link,
  FileAudio,
  X,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

import {
  uploadMeeting,
  processMeeting,
  processMeetingUrl,
} from "../services/api";


function MeetingInput({ onResult }) {

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [url, setUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");


  const handleFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };


  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    handleFile(file);
  };


  const removeFile = () => {

    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const handleGenerate = async () => {

    console.log("🔥 GENERATE BUTTON CLICKED");

    if (!selectedFile && !url.trim()) {
      console.log("❌ No file or URL selected");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {

      let result;

      if (selectedFile) {

        console.log("1️⃣ Starting upload:", selectedFile.name);

        const uploadResult = await uploadMeeting(selectedFile);

        console.log(
          "2️⃣ Upload response:",
          JSON.stringify(uploadResult, null, 2)
        );

        const filename = uploadResult?.file?.saved_filename;

        console.log("3️⃣ Saved filename:", filename);

        if (!filename) {
          throw new Error(
            "Upload succeeded, but no saved filename was returned."
          );
        }

        console.log("4️⃣ Starting processing:", filename);

        result = await processMeeting(filename);

        console.log("5️⃣ PROCESS RESPONSE:", result);

      } else {

        console.log("1️⃣ Processing URL:", url.trim());

        result = await processMeetingUrl(url.trim());

        console.log("2️⃣ URL PROCESS RESPONSE:", result);
      }

      console.log("🎉 FINAL RESULT:", result);

      onResult(result);

    } catch (error) {

      console.error("❌ PROCESSING ERROR:", error);

      setError(
        error.message ||
        "Something went wrong while processing the meeting."
      );

    } finally {

      console.log("🏁 Processing finished");

      setIsProcessing(false);
    }
  };


  return (
    <section className="meeting-input">

      {/* =========================
          UPLOAD AREA
          ========================= */}

      <div
        className={`upload-card ${isDragging ? "dragging" : ""} ${
          selectedFile ? "has-file" : ""
        }`}

        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}

        onDragLeave={() => setIsDragging(false)}

        onDrop={handleDrop}

        onClick={() => {
          if (!selectedFile) {
            fileInputRef.current?.click();
          }
        }}
      >

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileChange}
          hidden
        />


        {!selectedFile ? (

          <div className="upload-empty">

            <div className="upload-icon">
              <Upload size={25} strokeWidth={1.8} />
            </div>

            <div className="upload-copy">

              <h3>
                Drop your meeting recording here
              </h3>

              <p>
                or <span>browse from your computer</span>
              </p>

            </div>

            <div className="file-types">
              MP3
              <i />
              WAV
              <i />
              M4A
              <i />
              MP4
              <i />
              MOV
            </div>

          </div>

        ) : (

          <div className="selected-file">

            <div className="file-icon">
              <FileAudio size={23} />
            </div>

            <div className="file-info">

              <strong>
                {selectedFile.name}
              </strong>

              <small>
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </small>

            </div>

            <div className="file-ready">
              Ready
            </div>

            <button
              type="button"
              className="remove-file"

              onClick={(event) => {
                event.stopPropagation();
                removeFile();
              }}
            >
              <X size={17} />
            </button>

          </div>

        )}

      </div>


      {/* =========================
          DIVIDER
          ========================= */}

      <div className="input-divider">
        <span>OR</span>
      </div>


      {/* =========================
          URL INPUT
          ========================= */}

      <div className="url-section">

        <label>
          <span className="url-label-icon">
            <Link size={15} />
          </span>

          Paste a meeting recording URL
        </label>


        <div className="url-input-wrapper">

          <input
            type="url"
            placeholder="https://your-meeting-recording.com/..."
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />

          <ArrowUpRight
            className="url-arrow"
            size={17}
          />

        </div>


        <p className="url-hint">
          Supported meeting recording links
        </p>

      </div>


      {/* =========================
          ERROR
          ========================= */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* =========================
          GENERATE BUTTON
          ========================= */}

      <button
        type="button"
        className={`generate-button ${
          isProcessing ? "processing" : ""
        }`}

        onClick={handleGenerate}

        disabled={
          isProcessing ||
          (!selectedFile && !url.trim())
        }
      >

        <span className="generate-icon">
          <Sparkles size={17} />
        </span>

        <span>
          {isProcessing
            ? "Turning your meeting into notes..."
            : "Generate Notes"}
        </span>

        {!isProcessing && (
          <span className="generate-arrow">
            →
          </span>
        )}

      </button>


      {/* =========================
          PROCESSING MESSAGE
          ========================= */}

      {isProcessing && (
        <div className="processing-status">

          <span className="processing-dot" />

          AI is listening to your meeting...

        </div>
      )}

    </section>
  );
}


export default MeetingInput;