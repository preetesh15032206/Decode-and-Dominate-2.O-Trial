import { useEffect } from "react";

const STORAGE_KEY = "proctoring_logs";
const PROTECTOR_FLAG = "protector_mode";

type ViolationEntry = {
  id: string;
  teamId: string;
  type: string;
  timestamp: string;
};

function isProtectorEnabled() {
  return typeof window !== "undefined" && localStorage.getItem(PROTECTOR_FLAG) === "true";
}

function getTeamId() {
  if (typeof window === "undefined") return "UNKNOWN";
  const authJson = sessionStorage.getItem("auth_user");
  if (!authJson) return "UNKNOWN";
  try {
    const auth = JSON.parse(authJson);
    return auth.teamId || auth.teamID || auth.team || auth.role === "student" ? auth.teamId || "UNKNOWN" : "UNKNOWN";
  } catch {
    return "UNKNOWN";
  }
}

function saveViolation(type: string) {
  if (!isProtectorEnabled()) return;
  const teamId = getTeamId();
  const logsJson = localStorage.getItem(STORAGE_KEY);
  const logs: ViolationEntry[] = logsJson ? JSON.parse(logsJson) : [];
  logs.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    teamId,
    type,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function useAntiCheat() {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!isProtectorEnabled()) return;
      if (document.hidden) {
        saveViolation("tab_switch");
      }
    };

    const handleCopyCutPaste = (e: ClipboardEvent) => {
      if (!isProtectorEnabled()) return;
      e.preventDefault();
      saveViolation(e.type === "paste" ? "paste_attempt" : "copy_cut_attempt");
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (!isProtectorEnabled()) return;
      e.preventDefault();
      saveViolation("right_click");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isProtectorEnabled()) return;
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        e.preventDefault();
        saveViolation("screenshot_attempt");
      }
      if (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "x")) {
        e.preventDefault();
        saveViolation(e.key === "v" ? "paste_attempt" : "copy_cut_attempt");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("copy", handleCopyCutPaste);
    document.addEventListener("cut", handleCopyCutPaste);
    document.addEventListener("paste", handleCopyCutPaste);
    document.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("copy", handleCopyCutPaste);
      document.removeEventListener("cut", handleCopyCutPaste);
      document.removeEventListener("paste", handleCopyCutPaste);
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
