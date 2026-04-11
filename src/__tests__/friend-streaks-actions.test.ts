import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================
// Unit Tests: Server Actions (with Supabase mocks)
// ============================================

// Build a chainable mock that records calls
function createQueryChain(finalResult: unknown = { data: null, error: null }) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  const methods = ["select", "insert", "update", "upsert", "delete", "eq", "or", "in", "gte", "is", "order", "limit", "single", "maybeSingle"];
  for (const m of methods) {
    chain[m] = vi.fn().mockReturnValue(chain);
  }
  chain.single.mockResolvedValue(finalResult);
  // Make insert/update/upsert also resolve by default (for non-single calls)
  chain.insert.mockReturnValue({ ...chain, select: chain.select, error: null, data: null });
  chain.select.mockReturnValue(chain);
  return chain;
}

let mockChains: Record<string, ReturnType<typeof createQueryChain>> = {};
const mockAuth = { getUser: vi.fn() };

const mockSupabase = {
  from: vi.fn((table: string) => {
    if (!mockChains[table]) mockChains[table] = createQueryChain();
    return mockChains[table];
  }),
  auth: mockAuth,
};

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(new Proxy({}, {
    get: (_t, prop) => (mockSupabase as Record<string, unknown>)[prop as string],
  })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const mockCreateNotification = vi.fn();
vi.mock("@/lib/actions/in-app-notifications", () => ({
  createNotification: (...args: unknown[]) => mockCreateNotification(...args),
}));

describe("createFriendStreak", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockChains = {};
  });

  it("throws when user is not authenticated", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: null } });
    const { createFriendStreak } = await import("@/lib/actions/friend-streaks");

    await expect(
      createFriendStreak({ goalId: "g1", goalVisible: true, targetDays: 30 })
    ).rejects.toThrow("Não autenticado");
  });

  it("inserts friend_streak with correct data", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const fsChain = createQueryChain();
    fsChain.insert.mockReturnValue(fsChain);
    fsChain.select.mockReturnValue(fsChain);
    fsChain.single.mockResolvedValue({ data: { id: "streak-99" }, error: null });
    mockChains["friend_streaks"] = fsChain;

    const { createFriendStreak } = await import("@/lib/actions/friend-streaks");
    const result = await createFriendStreak({ goalId: "goal-1", goalVisible: false, targetDays: 60 });

    expect(result).toBe("streak-99");
    expect(fsChain.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "user-1",
        user_goal_id: "goal-1",
        user_goal_visible: false,
        target_days: 60,
        friend_id: "user-1", // placeholder
        status: "pending",
      })
    );
  });

  it("throws on insert error", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const fsChain = createQueryChain();
    fsChain.insert.mockReturnValue(fsChain);
    fsChain.select.mockReturnValue(fsChain);
    fsChain.single.mockResolvedValue({ data: null, error: { message: "DB error" } });
    mockChains["friend_streaks"] = fsChain;

    const { createFriendStreak } = await import("@/lib/actions/friend-streaks");
    await expect(
      createFriendStreak({ goalId: "g1", goalVisible: true, targetDays: 30 })
    ).rejects.toThrow("DB error");
  });
});

describe("acceptFriendStreak", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockChains = {};
  });

  it("throws when user is not authenticated", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: null } });
    const { acceptFriendStreak } = await import("@/lib/actions/friend-streaks");

    await expect(
      acceptFriendStreak({ friendStreakId: "s1", goalId: "g1", goalVisible: true })
    ).rejects.toThrow("Não autenticado");
  });

  it("throws when streak not found", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "user-2" } } });

    const fsChain = createQueryChain();
    fsChain.single.mockResolvedValue({ data: null, error: null });
    mockChains["friend_streaks"] = fsChain;

    const { acceptFriendStreak } = await import("@/lib/actions/friend-streaks");
    await expect(
      acceptFriendStreak({ friendStreakId: "s1", goalId: "g1", goalVisible: true })
    ).rejects.toThrow("Convite não encontrado ou já aceito");
  });

  it("throws when accepting own invite", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const fsChain = createQueryChain();
    // First single() call returns the streak (select)
    fsChain.single
      .mockResolvedValueOnce({ data: { user_id: "user-1", friend_id: "user-1", target_days: 30, status: "pending" }, error: null });
    mockChains["friend_streaks"] = fsChain;

    const { acceptFriendStreak } = await import("@/lib/actions/friend-streaks");
    await expect(
      acceptFriendStreak({ friendStreakId: "s1", goalId: "g1", goalVisible: true })
    ).rejects.toThrow("Você não pode aceitar seu próprio convite");
  });

  it("updates streak and creates bidirectional friendships", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "user-2" } } });

    const fsChain = createQueryChain();
    fsChain.single
      .mockResolvedValueOnce({ data: { user_id: "user-1", friend_id: "user-1", target_days: 30, status: "pending" }, error: null })
      .mockResolvedValue({ data: { name: "TestUser" }, error: null });
    fsChain.update.mockReturnValue(fsChain);
    mockChains["friend_streaks"] = fsChain;

    const friendshipChain = createQueryChain();
    friendshipChain.upsert.mockReturnValue({ error: null });
    mockChains["friendships"] = friendshipChain;

    const usersChain = createQueryChain();
    usersChain.single.mockResolvedValue({ data: { name: "Inviter" }, error: null });
    mockChains["users"] = usersChain;

    const { acceptFriendStreak } = await import("@/lib/actions/friend-streaks");
    await acceptFriendStreak({ friendStreakId: "s1", goalId: "goal-2", goalVisible: false });

    // Should update the streak
    expect(fsChain.update).toHaveBeenCalledWith(
      expect.objectContaining({
        friend_id: "user-2",
        friend_goal_id: "goal-2",
        friend_goal_visible: false,
        status: "active",
      })
    );

    // Should create friendships
    expect(friendshipChain.upsert).toHaveBeenCalledTimes(2);
  });
});

describe("removeFriendStreak", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockChains = {};
  });

  it("throws when not authenticated", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: null } });
    const { removeFriendStreak } = await import("@/lib/actions/friend-streaks");
    await expect(removeFriendStreak("s1")).rejects.toThrow("Não autenticado");
  });

  it("updates status to removed", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const fsChain = createQueryChain();
    fsChain.update.mockReturnValue(fsChain);
    mockChains["friend_streaks"] = fsChain;

    const { removeFriendStreak } = await import("@/lib/actions/friend-streaks");
    await removeFriendStreak("streak-1");

    expect(fsChain.update).toHaveBeenCalledWith({ status: "removed" });
  });
});

describe("nudgeFriend", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockChains = {};
  });

  it("throws when not authenticated", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: null } });
    const { nudgeFriend } = await import("@/lib/actions/friend-streaks");
    await expect(nudgeFriend("s1")).rejects.toThrow("Não autenticado");
  });

  it("throws when streak not found", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const fsChain = createQueryChain();
    fsChain.single.mockResolvedValue({ data: null, error: null });
    mockChains["friend_streaks"] = fsChain;

    const { nudgeFriend } = await import("@/lib/actions/friend-streaks");
    await expect(nudgeFriend("s1")).rejects.toThrow("Ofensiva não encontrada");
  });

  it("does not nudge if already nudged today", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const fsChain = createQueryChain();
    fsChain.single.mockResolvedValue({
      data: { user_id: "user-1", friend_id: "user-2", status: "active" },
      error: null,
    });
    mockChains["friend_streaks"] = fsChain;

    // Notifications chain — already nudged (count > 0)
    const notifChain = createQueryChain();
    notifChain.select.mockReturnValue(notifChain);
    notifChain.eq.mockReturnValue(notifChain);
    notifChain.gte.mockResolvedValue({ count: 1 });
    mockChains["notifications"] = notifChain;

    const { nudgeFriend } = await import("@/lib/actions/friend-streaks");
    await nudgeFriend("s1");

    // Should NOT call createNotification
    expect(mockCreateNotification).not.toHaveBeenCalled();
  });

  it("sends nudge notification when not yet nudged today", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const fsChain = createQueryChain();
    fsChain.single.mockResolvedValue({
      data: { user_id: "user-1", friend_id: "user-2", status: "active" },
      error: null,
    });
    mockChains["friend_streaks"] = fsChain;

    // Notifications — not yet nudged
    const notifChain = createQueryChain();
    notifChain.select.mockReturnValue(notifChain);
    notifChain.eq.mockReturnValue(notifChain);
    notifChain.gte.mockResolvedValue({ count: 0 });
    mockChains["notifications"] = notifChain;

    // Users chain for getting name
    const usersChain = createQueryChain();
    usersChain.single.mockResolvedValue({ data: { name: "Wilder" }, error: null });
    mockChains["users"] = usersChain;

    const { nudgeFriend } = await import("@/lib/actions/friend-streaks");
    await nudgeFriend("s1");

    expect(mockCreateNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-2",
        title: "👋 Cutucada!",
      })
    );
  });

  it("nudges friend_id when inviter nudges", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const fsChain = createQueryChain();
    fsChain.single.mockResolvedValue({
      data: { user_id: "user-1", friend_id: "user-2", status: "active" },
      error: null,
    });
    mockChains["friend_streaks"] = fsChain;

    const notifChain = createQueryChain();
    notifChain.select.mockReturnValue(notifChain);
    notifChain.eq.mockReturnValue(notifChain);
    notifChain.gte.mockResolvedValue({ count: 0 });
    mockChains["notifications"] = notifChain;

    const usersChain = createQueryChain();
    usersChain.single.mockResolvedValue({ data: { name: "User1" }, error: null });
    mockChains["users"] = usersChain;

    const { nudgeFriend } = await import("@/lib/actions/friend-streaks");
    await nudgeFriend("s1");

    // Should notify friend (user-2), not inviter
    expect(mockCreateNotification).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-2" })
    );
  });

  it("nudges user_id when friend nudges", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "user-2" } } });

    const fsChain = createQueryChain();
    fsChain.single.mockResolvedValue({
      data: { user_id: "user-1", friend_id: "user-2", status: "active" },
      error: null,
    });
    mockChains["friend_streaks"] = fsChain;

    const notifChain = createQueryChain();
    notifChain.select.mockReturnValue(notifChain);
    notifChain.eq.mockReturnValue(notifChain);
    notifChain.gte.mockResolvedValue({ count: 0 });
    mockChains["notifications"] = notifChain;

    const usersChain = createQueryChain();
    usersChain.single.mockResolvedValue({ data: { name: "User2" }, error: null });
    mockChains["users"] = usersChain;

    const { nudgeFriend } = await import("@/lib/actions/friend-streaks");
    await nudgeFriend("s1");

    // Should notify inviter (user-1)
    expect(mockCreateNotification).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-1" })
    );
  });
});

describe("getFriendStreakInvite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockChains = {};
  });

  it("returns null when not authenticated", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: null } });
    const { getFriendStreakInvite } = await import("@/lib/actions/friend-streaks");
    const result = await getFriendStreakInvite("s1");
    expect(result).toBeNull();
  });

  it("returns null when streak not found", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "user-2" } } });

    const fsChain = createQueryChain();
    fsChain.single.mockResolvedValue({ data: null, error: null });
    mockChains["friend_streaks"] = fsChain;

    const { getFriendStreakInvite } = await import("@/lib/actions/friend-streaks");
    const result = await getFriendStreakInvite("s1");
    expect(result).toBeNull();
  });

  it("returns null when streak not pending", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "user-2" } } });

    const fsChain = createQueryChain();
    fsChain.single.mockResolvedValue({
      data: { id: "s1", user_id: "user-1", target_days: 30, status: "active" },
      error: null,
    });
    mockChains["friend_streaks"] = fsChain;

    const { getFriendStreakInvite } = await import("@/lib/actions/friend-streaks");
    const result = await getFriendStreakInvite("s1");
    expect(result).toBeNull();
  });

  it("returns error:self when user is inviter", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const fsChain = createQueryChain();
    fsChain.single.mockResolvedValue({
      data: { id: "s1", user_id: "user-1", target_days: 30, status: "pending" },
      error: null,
    });
    mockChains["friend_streaks"] = fsChain;

    const { getFriendStreakInvite } = await import("@/lib/actions/friend-streaks");
    const result = await getFriendStreakInvite("s1");
    expect(result).toEqual({ error: "self" });
  });

  it("returns invite data for valid invite", async () => {
    mockAuth.getUser.mockResolvedValue({ data: { user: { id: "user-2" } } });

    const fsChain = createQueryChain();
    fsChain.single.mockResolvedValue({
      data: { id: "s1", user_id: "user-1", target_days: 60, status: "pending" },
      error: null,
    });
    mockChains["friend_streaks"] = fsChain;

    const usersChain = createQueryChain();
    usersChain.single.mockResolvedValue({ data: { name: "João" }, error: null });
    mockChains["users"] = usersChain;

    const { getFriendStreakInvite } = await import("@/lib/actions/friend-streaks");
    const result = await getFriendStreakInvite("s1");
    expect(result).toEqual({
      id: "s1",
      inviterName: "João",
      targetDays: 60,
    });
  });
});
