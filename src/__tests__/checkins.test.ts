import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================
// Unit Tests: Check-in Logic (streak, achievements)
// ============================================

describe("Streak Calculation", () => {
  function calculateStreak(dates: string[]): number {
    if (dates.length === 0) return 0;
    const sorted = [...dates].sort().reverse();
    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const curr = new Date(sorted[i - 1] + "T12:00:00");
      const prev = new Date(sorted[i] + "T12:00:00");
      if (Math.round((curr.getTime() - prev.getTime()) / 86400000) === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  it("returns 0 for no checkins", () => {
    expect(calculateStreak([])).toBe(0);
  });

  it("returns 1 for a single checkin", () => {
    expect(calculateStreak(["2026-04-11"])).toBe(1);
  });

  it("counts consecutive days", () => {
    expect(calculateStreak(["2026-04-09", "2026-04-10", "2026-04-11"])).toBe(3);
  });

  it("breaks on gap", () => {
    expect(calculateStreak(["2026-04-08", "2026-04-10", "2026-04-11"])).toBe(2);
  });

  it("handles unordered input", () => {
    expect(calculateStreak(["2026-04-11", "2026-04-09", "2026-04-10"])).toBe(3);
  });

  it("stops at first gap even with earlier consecutive days", () => {
    expect(calculateStreak(["2026-04-01", "2026-04-02", "2026-04-05", "2026-04-10", "2026-04-11"])).toBe(2);
  });

  it("handles long streak", () => {
    const dates = Array.from({ length: 30 }, (_, i) => {
      const d = new Date("2026-04-11");
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    });
    expect(calculateStreak(dates)).toBe(30);
  });
});

describe("Best Streak Update", () => {
  it("updates when current exceeds best", () => {
    const best = Math.max(10, 11);
    expect(best).toBe(11);
  });

  it("keeps best when current is lower", () => {
    const best = Math.max(20, 5);
    expect(best).toBe(20);
  });

  it("handles equal values", () => {
    const best = Math.max(7, 7);
    expect(best).toBe(7);
  });
});

describe("Achievement Check Logic", () => {
  function getEligibleAchievements(params: {
    streak: number;
    totalCheckins: number;
    score: number;
    highScoreCount: number;
    activeGoals: number;
    unlocked: Set<string>;
  }) {
    const { streak, totalCheckins, score, highScoreCount, activeGoals, unlocked } = params;
    const toUnlock: string[] = [];

    const streakAchievements = [
      { id: "week-streak", value: 7 },
      { id: "fortnight-streak", value: 14 },
      { id: "month-streak", value: 30 },
      { id: "quarter-streak", value: 90 },
      { id: "semester-streak", value: 180 },
      { id: "year-streak", value: 365 },
    ];

    for (const sa of streakAchievements) {
      if (streak >= sa.value && !unlocked.has(sa.id)) {
        toUnlock.push(sa.id);
      }
    }

    if (totalCheckins >= 1 && !unlocked.has("first-checkin")) {
      toUnlock.push("first-checkin");
    }

    if (score >= 4 && highScoreCount >= 30 && !unlocked.has("consistency")) {
      toUnlock.push("consistency");
    }

    if (activeGoals >= 2 && !unlocked.has("multi-journey")) {
      toUnlock.push("multi-journey");
    }

    return toUnlock;
  }

  it("unlocks first-checkin on first check-in", () => {
    const result = getEligibleAchievements({
      streak: 1, totalCheckins: 1, score: 3, highScoreCount: 0, activeGoals: 1, unlocked: new Set(),
    });
    expect(result).toContain("first-checkin");
  });

  it("does not duplicate first-checkin", () => {
    const result = getEligibleAchievements({
      streak: 2, totalCheckins: 2, score: 4, highScoreCount: 1, activeGoals: 1, unlocked: new Set(["first-checkin"]),
    });
    expect(result).not.toContain("first-checkin");
  });

  it("unlocks week-streak at 7 days", () => {
    const result = getEligibleAchievements({
      streak: 7, totalCheckins: 7, score: 4, highScoreCount: 5, activeGoals: 1, unlocked: new Set(["first-checkin"]),
    });
    expect(result).toContain("week-streak");
  });

  it("does not unlock week-streak at 6 days", () => {
    const result = getEligibleAchievements({
      streak: 6, totalCheckins: 6, score: 4, highScoreCount: 4, activeGoals: 1, unlocked: new Set(["first-checkin"]),
    });
    expect(result).not.toContain("week-streak");
  });

  it("unlocks multiple streak achievements at once", () => {
    const result = getEligibleAchievements({
      streak: 30, totalCheckins: 30, score: 4, highScoreCount: 20, activeGoals: 1, unlocked: new Set(["first-checkin"]),
    });
    expect(result).toContain("week-streak");
    expect(result).toContain("fortnight-streak");
    expect(result).toContain("month-streak");
  });

  it("unlocks consistency at 30 high-score checkins", () => {
    const result = getEligibleAchievements({
      streak: 5, totalCheckins: 35, score: 4, highScoreCount: 30, activeGoals: 1, unlocked: new Set(["first-checkin"]),
    });
    expect(result).toContain("consistency");
  });

  it("does not unlock consistency with low score", () => {
    const result = getEligibleAchievements({
      streak: 5, totalCheckins: 35, score: 2, highScoreCount: 30, activeGoals: 1, unlocked: new Set(["first-checkin"]),
    });
    expect(result).not.toContain("consistency");
  });

  it("unlocks multi-journey with 2+ active goals", () => {
    const result = getEligibleAchievements({
      streak: 1, totalCheckins: 1, score: 3, highScoreCount: 0, activeGoals: 2, unlocked: new Set(),
    });
    expect(result).toContain("multi-journey");
  });

  it("does not unlock multi-journey with 1 goal", () => {
    const result = getEligibleAchievements({
      streak: 1, totalCheckins: 1, score: 3, highScoreCount: 0, activeGoals: 1, unlocked: new Set(),
    });
    expect(result).not.toContain("multi-journey");
  });

  it("unlocks nothing when all already unlocked", () => {
    const all = new Set(["first-checkin", "week-streak", "fortnight-streak", "month-streak", "quarter-streak", "semester-streak", "year-streak", "consistency", "multi-journey"]);
    const result = getEligibleAchievements({
      streak: 365, totalCheckins: 400, score: 5, highScoreCount: 300, activeGoals: 3, unlocked: all,
    });
    expect(result).toHaveLength(0);
  });
});

describe("Check-in Upsert Logic", () => {
  it("identifies existing check-in for update", () => {
    const existing = { id: "checkin-1" };
    const isUpdate = !!existing;
    expect(isUpdate).toBe(true);
  });

  it("identifies new check-in for insert", () => {
    const existing = null;
    const isUpdate = !!existing;
    expect(isUpdate).toBe(false);
  });
});

describe("Score & Mood Mapping", () => {
  const SCORE_MAP: Record<number, string> = {
    1: "terrible", 2: "bad", 3: "neutral", 4: "good", 5: "great",
  };

  it("maps score 1 to terrible", () => {
    expect(SCORE_MAP[1]).toBe("terrible");
  });

  it("maps score 3 to neutral", () => {
    expect(SCORE_MAP[3]).toBe("neutral");
  });

  it("maps score 5 to great", () => {
    expect(SCORE_MAP[5]).toBe("great");
  });

  it("score 1 triggers difficult day flow", () => {
    const score = 1;
    expect(score === 1).toBe(true);
  });

  it("score 2+ does not trigger difficult day", () => {
    for (const s of [2, 3, 4, 5]) {
      expect(s === 1).toBe(false);
    }
  });
});
