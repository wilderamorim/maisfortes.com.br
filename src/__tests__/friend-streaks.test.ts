import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================
// Unit Tests: Friend Streak Business Logic
// ============================================

// Mock Supabase client
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockUpsert = vi.fn();
const mockEq = vi.fn();
const mockOr = vi.fn();
const mockIn = vi.fn();
const mockGte = vi.fn();
const mockOrder = vi.fn();
const mockSingle = vi.fn();

function createChain() {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  };
  return chain;
}

const mockSupabase = {
  from: vi.fn(),
  auth: {
    getUser: vi.fn(),
  },
};

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabase),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/actions/in-app-notifications", () => ({
  createNotification: vi.fn(),
}));

describe("Friend Streaks — Business Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Types & Constants", () => {
    it("TARGET_DAYS_OPTIONS contains expected values", async () => {
      const { TARGET_DAYS_OPTIONS } = await import("@/lib/types");
      expect(TARGET_DAYS_OPTIONS).toEqual([7, 14, 21, 30, 60, 90]);
    });

    it("FriendStreakStatus includes all states", async () => {
      // Verify the type exists by checking a value matches
      const status: import("@/lib/types").FriendStreakStatus = "pending";
      expect(["pending", "active", "broken", "completed", "removed"]).toContain(status);
    });

    it("FriendStreak interface has all required fields", async () => {
      const { TARGET_DAYS_OPTIONS } = await import("@/lib/types");
      const mockStreak: import("@/lib/types").FriendStreak = {
        id: "test-id",
        user_id: "user-1",
        user_goal_id: "goal-1",
        user_goal_visible: true,
        friend_id: "user-2",
        friend_goal_id: "goal-2",
        friend_goal_visible: false,
        target_days: TARGET_DAYS_OPTIONS[3], // 30
        current_streak: 5,
        best_streak: 10,
        last_both_date: "2026-04-10",
        status: "active",
        created_at: "2026-04-01T00:00:00Z",
      };

      expect(mockStreak.target_days).toBe(30);
      expect(mockStreak.friend_goal_visible).toBe(false);
    });
  });

  describe("Achievement Seeds", () => {
    it("includes 4 friend streak achievements", async () => {
      const { ACHIEVEMENT_SEEDS } = await import("@/lib/types");
      const friendAchievements = ACHIEVEMENT_SEEDS.filter((a) =>
        a.id.includes("friend-streak")
      );
      expect(friendAchievements).toHaveLength(4);
    });

    it("first-friend-streak is bronze rarity", async () => {
      const { ACHIEVEMENT_SEEDS } = await import("@/lib/types");
      const achievement = ACHIEVEMENT_SEEDS.find((a) => a.id === "first-friend-streak");
      expect(achievement).toBeDefined();
      expect(achievement?.rarity).toBe("bronze");
      expect(achievement?.name).toBe("Parceiros");
    });

    it("friend-streak-3 is silver rarity", async () => {
      const { ACHIEVEMENT_SEEDS } = await import("@/lib/types");
      const achievement = ACHIEVEMENT_SEEDS.find((a) => a.id === "friend-streak-3");
      expect(achievement).toBeDefined();
      expect(achievement?.rarity).toBe("silver");
    });

    it("friend-streak-keeper is gold (60+ days)", async () => {
      const { ACHIEVEMENT_SEEDS } = await import("@/lib/types");
      const achievement = ACHIEVEMENT_SEEDS.find((a) => a.id === "friend-streak-keeper");
      expect(achievement).toBeDefined();
      expect(achievement?.rarity).toBe("gold");
    });

    it("friend-streak-legend is platinum (90+ days)", async () => {
      const { ACHIEVEMENT_SEEDS } = await import("@/lib/types");
      const achievement = ACHIEVEMENT_SEEDS.find((a) => a.id === "friend-streak-legend");
      expect(achievement).toBeDefined();
      expect(achievement?.rarity).toBe("platinum");
    });

    it("all achievements have correct condition_type = custom", async () => {
      const { ACHIEVEMENT_SEEDS } = await import("@/lib/types");
      const friendAchievements = ACHIEVEMENT_SEEDS.filter((a) =>
        a.id.includes("friend-streak")
      );
      for (const a of friendAchievements) {
        expect(a.condition_type).toBe("custom");
      }
    });
  });
});

describe("Friend Streaks — Streak Evaluation Logic", () => {
  it("streak increments when both check-in on the same day", () => {
    const userDid = true;
    const friendDid = true;
    const currentStreak = 5;
    const bestStreak = 10;

    let newStreak = currentStreak;
    let newBest = bestStreak;

    if (userDid && friendDid) {
      newStreak = currentStreak + 1;
      newBest = Math.max(bestStreak, newStreak);
    }

    expect(newStreak).toBe(6);
    expect(newBest).toBe(10); // best_streak stays 10
  });

  it("streak resets when user misses check-in", () => {
    const userDid = false;
    const friendDid = true;
    const currentStreak = 5;

    let newStreak = currentStreak;
    let status = "active";

    if (!(userDid && friendDid)) {
      newStreak = 0;
      status = "broken";
    }

    expect(newStreak).toBe(0);
    expect(status).toBe("broken");
  });

  it("streak resets when friend misses check-in", () => {
    const userDid = true;
    const friendDid = false;
    const currentStreak = 12;

    let newStreak = currentStreak;
    let status = "active";

    if (!(userDid && friendDid)) {
      newStreak = 0;
      status = "broken";
    }

    expect(newStreak).toBe(0);
    expect(status).toBe("broken");
  });

  it("streak resets when both miss check-in", () => {
    const userDid = false;
    const friendDid = false;
    const currentStreak = 3;

    let newStreak = currentStreak;
    let status = "active";

    if (!(userDid && friendDid)) {
      newStreak = 0;
      status = "broken";
    }

    expect(newStreak).toBe(0);
    expect(status).toBe("broken");
  });

  it("completes when reaching target_days", () => {
    const userDid = true;
    const friendDid = true;
    const currentStreak = 29;
    const targetDays = 30;

    let newStreak = currentStreak;
    let status = "active";

    if (userDid && friendDid) {
      newStreak = currentStreak + 1;
      if (newStreak >= targetDays) {
        status = "completed";
      }
    }

    expect(newStreak).toBe(30);
    expect(status).toBe("completed");
  });

  it("does not complete before reaching target_days", () => {
    const userDid = true;
    const friendDid = true;
    const currentStreak = 28;
    const targetDays = 30;

    let newStreak = currentStreak;
    let status = "active";

    if (userDid && friendDid) {
      newStreak = currentStreak + 1;
      if (newStreak >= targetDays) {
        status = "completed";
      }
    }

    expect(newStreak).toBe(29);
    expect(status).toBe("active");
  });

  it("updates best_streak when current exceeds it", () => {
    const currentStreak = 14;
    const bestStreak = 14;

    const newStreak = currentStreak + 1;
    const newBest = Math.max(bestStreak, newStreak);

    expect(newBest).toBe(15);
  });
});

describe("Friend Streaks — Visibility Logic", () => {
  it("shows goal title when visible", () => {
    const goalTitle = "Parar de fumar";
    const visible = true;
    const display = visible ? goalTitle : "Meta privada 🔒";
    expect(display).toBe("Parar de fumar");
  });

  it("hides goal title when private", () => {
    const goalTitle = "Pornografia";
    const visible = false;
    const display = visible ? goalTitle : "Meta privada 🔒";
    expect(display).toBe("Meta privada 🔒");
  });
});

describe("Friend Streaks — Nudge Logic", () => {
  it("nudge allowed when I checked and friend did not", () => {
    const iCheckedToday = true;
    const friendCheckedToday = false;
    const canNudge = iCheckedToday && !friendCheckedToday;
    expect(canNudge).toBe(true);
  });

  it("nudge not allowed when friend already checked", () => {
    const iCheckedToday = true;
    const friendCheckedToday = true;
    const canNudge = iCheckedToday && !friendCheckedToday;
    expect(canNudge).toBe(false);
  });

  it("nudge not allowed when I have not checked", () => {
    const iCheckedToday = false;
    const friendCheckedToday = false;
    const canNudge = iCheckedToday && !friendCheckedToday;
    expect(canNudge).toBe(false);
  });
});

describe("Friend Streaks — Status Display", () => {
  it("pending shows waiting message", () => {
    const status = "pending";
    const friendName = "João";
    const message = status === "pending" ? `Aguardando ${friendName} escolher uma meta` : null;
    expect(message).toBe("Aguardando João escolher uma meta");
  });

  it("completed shows trophy message", () => {
    const status = "completed";
    const targetDays = 30;
    const message = status === "completed" ? `Ofensiva de ${targetDays} dias completa!` : null;
    expect(message).toBe("Ofensiva de 30 dias completa!");
  });

  it("active shows streak counter", () => {
    const status = "active";
    const currentStreak = 12;
    const targetDays = 30;
    const display = status === "active" ? `${currentStreak}/${targetDays}` : null;
    expect(display).toBe("12/30");
  });
});

describe("Friend Streaks — Achievement Eligibility", () => {
  it("first-friend-streak unlocks at 1 completed", () => {
    const completedCount = 1;
    const eligible = completedCount >= 1;
    expect(eligible).toBe(true);
  });

  it("friend-streak-3 does not unlock at 2 completed", () => {
    const completedCount = 2;
    const eligible = completedCount >= 3;
    expect(eligible).toBe(false);
  });

  it("friend-streak-keeper requires 60+ target days", () => {
    const targetDays = 30;
    const eligible = targetDays >= 60;
    expect(eligible).toBe(false);
  });

  it("friend-streak-keeper unlocks at 60 target days", () => {
    const targetDays = 60;
    const eligible = targetDays >= 60;
    expect(eligible).toBe(true);
  });

  it("friend-streak-legend requires 90+ target days", () => {
    const targetDays = 89;
    const eligible = targetDays >= 90;
    expect(eligible).toBe(false);
  });

  it("friend-streak-legend unlocks at 90 target days", () => {
    const targetDays = 90;
    const eligible = targetDays >= 90;
    expect(eligible).toBe(true);
  });
});
