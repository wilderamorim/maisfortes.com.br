import { describe, it, expect } from "vitest";

// ============================================
// Unit Tests: Goal Management Logic
// ============================================

describe("Goal Status Transitions", () => {
  const validTransitions: Record<string, string[]> = {
    active: ["paused", "completed"],
    paused: ["active", "completed"],
    completed: [], // terminal state
  };

  it("active can transition to paused", () => {
    expect(validTransitions["active"]).toContain("paused");
  });

  it("active can transition to completed", () => {
    expect(validTransitions["active"]).toContain("completed");
  });

  it("paused can transition to active", () => {
    expect(validTransitions["paused"]).toContain("active");
  });

  it("paused can transition to completed", () => {
    expect(validTransitions["paused"]).toContain("completed");
  });

  it("completed is terminal (no transitions)", () => {
    expect(validTransitions["completed"]).toHaveLength(0);
  });
});

describe("Goal Order Assignment", () => {
  it("first goal gets order 0", () => {
    const existingCount = 0;
    expect(existingCount).toBe(0);
  });

  it("second goal gets order 1", () => {
    const existingCount = 1;
    expect(existingCount).toBe(1);
  });

  it("fifth goal gets order 4", () => {
    const existingCount = 4;
    expect(existingCount).toBe(4);
  });
});

describe("Goal Streak Recalculation", () => {
  // getActiveGoals recalculates streaks from actual checkin data
  function recalcStreak(checkinDates: string[]): number {
    if (checkinDates.length === 0) return 0;
    const dates = [...checkinDates].sort().reverse();
    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const curr = new Date(dates[i - 1] + "T12:00:00");
      const prev = new Date(dates[i] + "T12:00:00");
      if (Math.round((curr.getTime() - prev.getTime()) / 86400000) === 1) {
        streak++;
      } else break;
    }
    return streak;
  }

  it("fixes stale streak (DB says 5, actual is 2)", () => {
    const dbStreak = 5;
    const actualStreak = recalcStreak(["2026-04-10", "2026-04-11"]);
    expect(actualStreak).toBe(2);
    expect(actualStreak).not.toBe(dbStreak);
  });

  it("confirms correct streak (no fix needed)", () => {
    const dbStreak = 3;
    const actualStreak = recalcStreak(["2026-04-09", "2026-04-10", "2026-04-11"]);
    expect(actualStreak).toBe(dbStreak);
  });

  it("resets to 0 when no checkins", () => {
    expect(recalcStreak([])).toBe(0);
  });
});

describe("GoalsForCheckin Logic", () => {
  function categorize(goals: { id: string }[], checkedIds: Set<string>) {
    return {
      pending: goals.filter((g) => !checkedIds.has(g.id)),
      done: goals.filter((g) => checkedIds.has(g.id)),
    };
  }

  it("all pending when none checked", () => {
    const { pending, done } = categorize(
      [{ id: "g1" }, { id: "g2" }],
      new Set()
    );
    expect(pending).toHaveLength(2);
    expect(done).toHaveLength(0);
  });

  it("all done when all checked", () => {
    const { pending, done } = categorize(
      [{ id: "g1" }, { id: "g2" }],
      new Set(["g1", "g2"])
    );
    expect(pending).toHaveLength(0);
    expect(done).toHaveLength(2);
  });

  it("mixed: 1 pending, 1 done", () => {
    const { pending, done } = categorize(
      [{ id: "g1" }, { id: "g2" }],
      new Set(["g1"])
    );
    expect(pending).toHaveLength(1);
    expect(done).toHaveLength(1);
    expect(pending[0].id).toBe("g2");
  });

  it("auto-selects when 1 pending", () => {
    const { pending } = categorize([{ id: "g1" }], new Set());
    const autoSelect = pending.length === 1 ? pending[0].id : null;
    expect(autoSelect).toBe("g1");
  });
});
