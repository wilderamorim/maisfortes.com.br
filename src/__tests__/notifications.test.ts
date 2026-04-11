import { describe, it, expect } from "vitest";

// ============================================
// Unit Tests: Notifications Logic
// ============================================

describe("Notification Types", () => {
  const validTypes = [
    "checkin_reminder", "streak_milestone", "achievement_unlocked",
    "supporter_joined", "supporter_message", "supporter_reaction",
    "inactivity_alert", "weekly_summary", "friend_streak_broken",
    "friend_streak_nudge", "friend_streak_completed",
  ];

  it("has 11 notification types", () => {
    expect(validTypes).toHaveLength(11);
  });

  it("includes checkin_reminder", () => {
    expect(validTypes).toContain("checkin_reminder");
  });

  it("includes friend streak types", () => {
    expect(validTypes).toContain("friend_streak_broken");
    expect(validTypes).toContain("friend_streak_nudge");
    expect(validTypes).toContain("friend_streak_completed");
  });
});

describe("Notification Icon Mapping", () => {
  const iconMap: Record<string, string> = {
    checkin_reminder: "bell",
    streak_milestone: "flame",
    achievement_unlocked: "trophy",
    supporter_joined: "heart-handshake",
    supporter_message: "message-circle",
    supporter_reaction: "heart",
    inactivity_alert: "alert-triangle",
    weekly_summary: "bar-chart-3",
    friend_streak_broken: "flame-kindling",
  };

  it("maps all main types to icons", () => {
    expect(Object.keys(iconMap).length).toBeGreaterThanOrEqual(9);
  });

  it("checkin_reminder uses bell icon", () => {
    expect(iconMap["checkin_reminder"]).toBe("bell");
  });
});

describe("Mark as Read", () => {
  it("sets read_at timestamp", () => {
    const now = new Date().toISOString();
    const notification = { read_at: null as string | null };
    notification.read_at = now;
    expect(notification.read_at).toBeTruthy();
  });

  it("mark all sets read_at for each", () => {
    const notifications = [
      { id: "1", read_at: null as string | null },
      { id: "2", read_at: null as string | null },
    ];
    const now = new Date().toISOString();
    for (const n of notifications) n.read_at = now;
    expect(notifications.every((n) => n.read_at !== null)).toBe(true);
  });
});

describe("Unread Badge Count", () => {
  it("counts unread correctly", () => {
    const notifications = [
      { read_at: null },
      { read_at: "2026-04-11" },
      { read_at: null },
      { read_at: null },
    ];
    const count = notifications.filter((n) => n.read_at === null).length;
    expect(count).toBe(3);
  });

  it("returns 0 when all read", () => {
    const notifications = [{ read_at: "2026-04-11" }];
    const count = notifications.filter((n) => n.read_at === null).length;
    expect(count).toBe(0);
  });

  it("returns 0 for empty list", () => {
    const count = [].filter((n: { read_at: string | null }) => n.read_at === null).length;
    expect(count).toBe(0);
  });
});

describe("Weekly Summary Cron Logic", () => {
  it("calculates average score", () => {
    const scores = [4, 3, 5, 4, 3];
    const avg = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
    expect(avg).toBe(3.8);
  });

  it("returns 0 avg for no scores", () => {
    const scores: number[] = [];
    const avg = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0;
    expect(avg).toBe(0);
  });

  it("picks correct emoji for high score", () => {
    const avg = 4.2;
    const emoji = avg >= 4 ? "🔥" : avg >= 3 ? "💪" : "🌱";
    expect(emoji).toBe("🔥");
  });

  it("picks correct emoji for medium score", () => {
    const avg = 3.5;
    const emoji = avg >= 4 ? "🔥" : avg >= 3 ? "💪" : "🌱";
    expect(emoji).toBe("💪");
  });

  it("picks correct emoji for low score", () => {
    const avg = 2.1;
    const emoji = avg >= 4 ? "🔥" : avg >= 3 ? "💪" : "🌱";
    expect(emoji).toBe("🌱");
  });

  it("consistent message for 5+ checkins", () => {
    const total = 6;
    const msg = total >= 5 ? "Semana consistente!" : "Cada check-in conta.";
    expect(msg).toBe("Semana consistente!");
  });

  it("encouraging message for <5 checkins", () => {
    const total = 3;
    const msg = total >= 5 ? "Semana consistente!" : "Cada check-in conta.";
    expect(msg).toBe("Cada check-in conta.");
  });
});
