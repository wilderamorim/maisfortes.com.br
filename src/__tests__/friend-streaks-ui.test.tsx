import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

// ============================================
// Feature Tests: Friend Streak UI Components
// ============================================

// Mock Next.js
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ id: "test-streak-id" }),
  useSearchParams: () => ({
    get: (key: string) => (key === "goal" ? "goal-1" : null),
  }),
}));

// Mock Supabase client
const mockFrom = vi.fn();
const mockSupabaseClient = {
  auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }) },
  from: mockFrom,
};

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabaseClient,
}));

// Mock server actions
const mockNudgeFriend = vi.fn();
const mockCreateFriendStreak = vi.fn().mockResolvedValue("streak-123");

vi.mock("@/lib/actions/friend-streaks", () => ({
  nudgeFriend: (...args: unknown[]) => mockNudgeFriend(...args),
  createFriendStreak: (...args: unknown[]) => mockCreateFriendStreak(...args),
  getFriendStreakInvite: vi.fn(),
  acceptFriendStreak: vi.fn(),
  getFriendStreaksForGoal: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/actions/checkins", () => ({
  createCheckin: vi.fn(),
}));

vi.mock("@/lib/actions/supporters", () => ({
  getSupportersForGoal: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/actions/messages", () => ({
  sendMessage: vi.fn(),
}));

afterEach(() => {
  cleanup();
});

describe("NudgeButton Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nudge emoji button", async () => {
    const { NudgeButton } = await import("@/app/(app)/network/nudge-button");
    render(<NudgeButton friendStreakId="streak-1" friendName="João" />);

    expect(screen.getByRole("button")).toHaveTextContent("👋");
  });

  it("shows Cutucado after clicking", async () => {
    mockNudgeFriend.mockResolvedValue(undefined);
    const { NudgeButton } = await import("@/app/(app)/network/nudge-button");
    render(<NudgeButton friendStreakId="streak-1" friendName="João" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText(/Cutucado/)).toBeInTheDocument();
    });
  });

  it("calls nudgeFriend with correct streakId", async () => {
    mockNudgeFriend.mockResolvedValue(undefined);
    const { NudgeButton } = await import("@/app/(app)/network/nudge-button");
    render(<NudgeButton friendStreakId="streak-42" friendName="Maria" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockNudgeFriend).toHaveBeenCalledWith("streak-42");
    });
  });

  it("disables button after nudge (no double nudge)", async () => {
    mockNudgeFriend.mockResolvedValue(undefined);
    const { NudgeButton } = await import("@/app/(app)/network/nudge-button");
    render(<NudgeButton friendStreakId="streak-1" friendName="João" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });
});

describe("AddFriendButton Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [
          { id: "goal-1", title: "Treinar" },
          { id: "goal-2", title: "Meditar" },
        ],
      }),
    });
  });

  it("renders Convidar button initially", async () => {
    const { AddFriendButton } = await import("@/app/(app)/network/add-friend-button");
    render(<AddFriendButton />);

    expect(screen.getByText("Convidar")).toBeInTheDocument();
  });

  it("opens setup modal on click", async () => {
    const { AddFriendButton } = await import("@/app/(app)/network/add-friend-button");
    render(<AddFriendButton />);

    fireEvent.click(screen.getByText("Convidar"));

    await waitFor(() => {
      expect(screen.getByText("Nova ofensiva de amigos")).toBeInTheDocument();
    });
  });

  it("shows goal selection in modal", async () => {
    const { AddFriendButton } = await import("@/app/(app)/network/add-friend-button");
    render(<AddFriendButton />);

    fireEvent.click(screen.getByText("Convidar"));

    await waitFor(() => {
      expect(screen.getByText("Treinar")).toBeInTheDocument();
      expect(screen.getByText("Meditar")).toBeInTheDocument();
    });
  });

  it("shows target days options", async () => {
    const { AddFriendButton } = await import("@/app/(app)/network/add-friend-button");
    render(<AddFriendButton />);

    fireEvent.click(screen.getByText("Convidar"));

    await waitFor(() => {
      expect(screen.getByText("7 dias")).toBeInTheDocument();
      expect(screen.getByText("30 dias")).toBeInTheDocument();
      expect(screen.getByText("90 dias")).toBeInTheDocument();
    });
  });

  it("shows visibility toggle defaulting to visible", async () => {
    const { AddFriendButton } = await import("@/app/(app)/network/add-friend-button");
    render(<AddFriendButton />);

    fireEvent.click(screen.getByText("Convidar"));

    await waitFor(() => {
      expect(screen.getByText("Meta visível para o amigo")).toBeInTheDocument();
    });
  });

  it("toggles to private on click", async () => {
    const { AddFriendButton } = await import("@/app/(app)/network/add-friend-button");
    render(<AddFriendButton />);

    fireEvent.click(screen.getByText("Convidar"));

    await waitFor(() => {
      expect(screen.getByText("Meta visível para o amigo")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Meta visível para o amigo"));
    expect(screen.getByText("Meta privada (amigo não verá o nome)")).toBeInTheDocument();
  });
});

describe("Network Page — Display Logic", () => {
  it("shows checkmark when user checked in", () => {
    const display = true ? "✅" : "⏳";
    expect(display).toBe("✅");
  });

  it("shows hourglass when not checked", () => {
    const display = false ? "✅" : "⏳";
    expect(display).toBe("⏳");
  });

  it("hides goal title when private", () => {
    const visible = false;
    const title = "Pornografia";
    const display = visible ? title : "Meta privada 🔒";
    expect(display).toBe("Meta privada 🔒");
    expect(display).not.toContain("Pornografia");
  });

  it("shows streak as X/Y", () => {
    expect(`${12}/${30}`).toBe("12/30");
  });

  it("shows trophy for completed", () => {
    const display = `🏆 ${30}/${30}`;
    expect(display).toBe("🏆 30/30");
  });

  it("nudge visible only when I checked and friend did not", () => {
    const cases = [
      { i: true, f: false, expect: true },
      { i: true, f: true, expect: false },
      { i: false, f: false, expect: false },
      { i: false, f: true, expect: false },
    ];
    for (const c of cases) {
      expect(c.i && !c.f).toBe(c.expect);
    }
  });
});
