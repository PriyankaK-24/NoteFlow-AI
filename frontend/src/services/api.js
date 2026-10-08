const API_BASE_URL = "http://127.0.0.1:8000";


export async function uploadMeeting(file) {

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/meetings/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to upload meeting");
  }

  return response.json();
}


export async function processMeeting(filename) {

  const response = await fetch(
    `${API_BASE_URL}/meetings/${encodeURIComponent(filename)}/process`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to process meeting");
  }

  return response.json();
}


export async function processMeetingUrl(url) {

  const response = await fetch(
    `${API_BASE_URL}/meetings/process-url`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        url: url,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to process meeting URL");
  }

  return response.json();
}

export async function getMeetings() {
  const response = await fetch(
    `${API_BASE_URL}/meetings/`
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      error || "Failed to fetch meetings"
    );
  }

  return response.json();
}

export async function getMeetingById(id) {
  const response = await fetch(
    `${API_BASE_URL}/meetings/${id}`
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      error || "Failed to fetch meeting"
    );
  }

  return response.json();
}