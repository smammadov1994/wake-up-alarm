export interface Alarm {
  time: string;
  photos: string[];
}

export function saveAlarm(alarm: Alarm): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("wake-up-alarm", JSON.stringify(alarm));
  }
}

export function loadAlarm(): Alarm | null {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("wake-up-alarm");
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return null;
}

export function clearAlarm(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("wake-up-alarm");
  }
}

export function savePhotos(photos: string[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("wake-up-photos", JSON.stringify(photos));
  }
}

export function loadPhotos(): string[] | null {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("wake-up-photos");
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return null;
}
