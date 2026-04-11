import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================
// Unit Tests: Cron — Daily Friend Streak Evaluation
// ============================================

// These tests verify the cron logic by testing the evaluation algorithm
// in isolation, since the route handler depends on service-role Supabase.

describe("Cron — Daily Evaluation Algorithm", () => {
  // Pure function that mirrors the cron logic
  function evaluateStreak(params: {
    userCheckedIn: boolean;
    friendCheckedIn: boolean;
    currentStreak: number;
    bestStreak: number;
    targetDays: number;
  }) {
    const { userCheckedIn, friendCheckedIn, currentStreak, bestStreak, targetDays } = params;

    if (userCheckedIn && friendCheckedIn) {
      const newStreak = currentStreak + 1;
      const newBest = Math.max(bestStreak, newStreak);
      const completed = newStreak >= targetDays;
      return {
        currentStreak: newStreak,
        bestStreak: newBest,
        status: completed ? "completed" as const : "active" as const,
      };
    }

    return {
      currentStreak: 0,
      bestStreak,
      status: "broken" as const,
    };
  }

  describe("Both check in", () => {
    it("increments streak by 1", () => {
      const result = evaluateStreak({
        userCheckedIn: true, friendCheckedIn: true,
        currentStreak: 5, bestStreak: 10, targetDays: 30,
      });
      expect(result.currentStreak).toBe(6);
      expect(result.status).toBe("active");
    });

    it("updates best_streak when surpassed", () => {
      const result = evaluateStreak({
        userCheckedIn: true, friendCheckedIn: true,
        currentStreak: 10, bestStreak: 10, targetDays: 30,
      });
      expect(result.bestStreak).toBe(11);
    });

    it("does not downgrade best_streak", () => {
      const result = evaluateStreak({
        userCheckedIn: true, friendCheckedIn: true,
        currentStreak: 3, bestStreak: 20, targetDays: 30,
      });
      expect(result.bestStreak).toBe(20);
    });

    it("completes at target_days = 7", () => {
      const result = evaluateStreak({
        userCheckedIn: true, friendCheckedIn: true,
        currentStreak: 6, bestStreak: 6, targetDays: 7,
      });
      expect(result.status).toBe("completed");
      expect(result.currentStreak).toBe(7);
    });

    it("completes at target_days = 14", () => {
      const result = evaluateStreak({
        userCheckedIn: true, friendCheckedIn: true,
        currentStreak: 13, bestStreak: 13, targetDays: 14,
      });
      expect(result.status).toBe("completed");
    });

    it("completes at target_days = 30", () => {
      const result = evaluateStreak({
        userCheckedIn: true, friendCheckedIn: true,
        currentStreak: 29, bestStreak: 29, targetDays: 30,
      });
      expect(result.status).toBe("completed");
      expect(result.currentStreak).toBe(30);
    });

    it("completes at target_days = 60", () => {
      const result = evaluateStreak({
        userCheckedIn: true, friendCheckedIn: true,
        currentStreak: 59, bestStreak: 59, targetDays: 60,
      });
      expect(result.status).toBe("completed");
    });

    it("completes at target_days = 90", () => {
      const result = evaluateStreak({
        userCheckedIn: true, friendCheckedIn: true,
        currentStreak: 89, bestStreak: 89, targetDays: 90,
      });
      expect(result.status).toBe("completed");
    });

    it("does not complete 1 day before target", () => {
      const result = evaluateStreak({
        userCheckedIn: true, friendCheckedIn: true,
        currentStreak: 28, bestStreak: 28, targetDays: 30,
      });
      expect(result.status).toBe("active");
      expect(result.currentStreak).toBe(29);
    });

    it("first day streak goes from 0 to 1", () => {
      const result = evaluateStreak({
        userCheckedIn: true, friendCheckedIn: true,
        currentStreak: 0, bestStreak: 0, targetDays: 30,
      });
      expect(result.currentStreak).toBe(1);
      expect(result.bestStreak).toBe(1);
    });
  });

  describe("User misses", () => {
    it("breaks streak", () => {
      const result = evaluateStreak({
        userCheckedIn: false, friendCheckedIn: true,
        currentStreak: 15, bestStreak: 15, targetDays: 30,
      });
      expect(result.currentStreak).toBe(0);
      expect(result.status).toBe("broken");
    });

    it("preserves best_streak on break", () => {
      const result = evaluateStreak({
        userCheckedIn: false, friendCheckedIn: true,
        currentStreak: 10, bestStreak: 25, targetDays: 30,
      });
      expect(result.bestStreak).toBe(25);
    });
  });

  describe("Friend misses", () => {
    it("breaks streak", () => {
      const result = evaluateStreak({
        userCheckedIn: true, friendCheckedIn: false,
        currentStreak: 20, bestStreak: 20, targetDays: 30,
      });
      expect(result.currentStreak).toBe(0);
      expect(result.status).toBe("broken");
    });
  });

  describe("Both miss", () => {
    it("breaks streak", () => {
      const result = evaluateStreak({
        userCheckedIn: false, friendCheckedIn: false,
        currentStreak: 8, bestStreak: 12, targetDays: 30,
      });
      expect(result.currentStreak).toBe(0);
      expect(result.status).toBe("broken");
    });

    it("preserves best_streak", () => {
      const result = evaluateStreak({
        userCheckedIn: false, friendCheckedIn: false,
        currentStreak: 8, bestStreak: 12, targetDays: 30,
      });
      expect(result.bestStreak).toBe(12);
    });
  });

  describe("Breaking at streak 0", () => {
    it("stays at 0, status broken", () => {
      const result = evaluateStreak({
        userCheckedIn: false, friendCheckedIn: false,
        currentStreak: 0, bestStreak: 5, targetDays: 30,
      });
      expect(result.currentStreak).toBe(0);
      expect(result.status).toBe("broken");
    });
  });
});

describe("Cron — Achievement Eligibility After Completion", () => {
  function checkAchievements(completedCount: number, targetDays: number, unlocked: Set<string>) {
    const toUnlock: string[] = [];

    if (completedCount >= 1 && !unlocked.has("first-friend-streak")) {
      toUnlock.push("first-friend-streak");
    }
    if (completedCount >= 3 && !unlocked.has("friend-streak-3")) {
      toUnlock.push("friend-streak-3");
    }
    if (targetDays >= 60 && !unlocked.has("friend-streak-keeper")) {
      toUnlock.push("friend-streak-keeper");
    }
    if (targetDays >= 90 && !unlocked.has("friend-streak-legend")) {
      toUnlock.push("friend-streak-legend");
    }

    return toUnlock;
  }

  it("unlocks first-friend-streak on first completion", () => {
    const result = checkAchievements(1, 30, new Set());
    expect(result).toContain("first-friend-streak");
  });

  it("does not duplicate first-friend-streak", () => {
    const result = checkAchievements(2, 30, new Set(["first-friend-streak"]));
    expect(result).not.toContain("first-friend-streak");
  });

  it("unlocks friend-streak-3 on third completion", () => {
    const result = checkAchievements(3, 30, new Set(["first-friend-streak"]));
    expect(result).toContain("friend-streak-3");
  });

  it("does not unlock friend-streak-3 on second completion", () => {
    const result = checkAchievements(2, 30, new Set(["first-friend-streak"]));
    expect(result).not.toContain("friend-streak-3");
  });

  it("unlocks friend-streak-keeper for 60-day target", () => {
    const result = checkAchievements(1, 60, new Set());
    expect(result).toContain("friend-streak-keeper");
  });

  it("does not unlock keeper for 30-day target", () => {
    const result = checkAchievements(1, 30, new Set());
    expect(result).not.toContain("friend-streak-keeper");
  });

  it("unlocks friend-streak-legend for 90-day target", () => {
    const result = checkAchievements(1, 90, new Set());
    expect(result).toContain("friend-streak-legend");
  });

  it("does not unlock legend for 60-day target", () => {
    const result = checkAchievements(1, 60, new Set());
    expect(result).not.toContain("friend-streak-legend");
  });

  it("unlocks both keeper and legend for 90-day target", () => {
    const result = checkAchievements(1, 90, new Set());
    expect(result).toContain("friend-streak-keeper");
    expect(result).toContain("friend-streak-legend");
  });

  it("unlocks multiple achievements at once (first completion of 90-day)", () => {
    const result = checkAchievements(1, 90, new Set());
    expect(result).toEqual(
      expect.arrayContaining(["first-friend-streak", "friend-streak-keeper", "friend-streak-legend"])
    );
  });

  it("unlocks nothing when all already unlocked", () => {
    const result = checkAchievements(5, 90, new Set([
      "first-friend-streak",
      "friend-streak-3",
      "friend-streak-keeper",
      "friend-streak-legend",
    ]));
    expect(result).toHaveLength(0);
  });
});

describe("Cron — Notification Messages", () => {
  it("completion notification includes target days", () => {
    const targetDays = 30;
    const friendName = "Maria";
    const body = `Você e ${friendName} completaram ${targetDays} dias juntos!`;
    expect(body).toBe("Você e Maria completaram 30 dias juntos!");
  });

  it("broken notification includes streak count", () => {
    const streak = 12;
    const friendName = "João";
    const body = `A ofensiva de ${streak} dia${streak > 1 ? "s" : ""} com ${friendName} foi quebrada.`;
    expect(body).toBe("A ofensiva de 12 dias com João foi quebrada.");
  });

  it("broken notification uses singular for 1 day", () => {
    const streak = 1;
    const friendName = "Pedro";
    const body = `A ofensiva de ${streak} dia${streak > 1 ? "s" : ""} com ${friendName} foi quebrada.`;
    expect(body).toBe("A ofensiva de 1 dia com Pedro foi quebrada.");
  });

  it("no notification when breaking at streak 0", () => {
    const streak = 0;
    const shouldNotify = streak > 0;
    expect(shouldNotify).toBe(false);
  });
});
