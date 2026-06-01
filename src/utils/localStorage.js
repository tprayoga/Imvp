const APP_STATE_KEY = "ibk-mvp-state";
const SESSION_KEY = "ibk-mvp-session";

export function getStoredState() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(APP_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Failed to parse state:", error);
    return null;
  }
}

export function setStoredState(state) {
  if (typeof window === "undefined") return;
  localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
}

export function getStoredSession() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Failed to parse session:", error);
    return null;
  }
}

export function setStoredSession(session) {
  if (typeof window === "undefined") return;
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
