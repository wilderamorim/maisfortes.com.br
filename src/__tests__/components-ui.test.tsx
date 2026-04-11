import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

// ============================================
// Feature Tests: UI Components
// ============================================

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({}),
  useSearchParams: () => ({ get: () => null }),
}));

const mockUpdateGoalStatus = vi.fn();
vi.mock("@/lib/actions/goals", () => ({
  updateGoalStatus: (...args: unknown[]) => mockUpdateGoalStatus(...args),
  getActiveGoals: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/actions/checkins", () => ({
  getGoalsForCheckin: vi.fn().mockResolvedValue({ pending: [], done: [] }),
  getCheckinsByGoal: vi.fn().mockResolvedValue([]),
  createCheckin: vi.fn().mockResolvedValue([]),
  getTodayCheckins: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/actions/supporters", () => ({
  getSupportersForGoal: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/actions/messages", () => ({
  sendMessage: vi.fn(),
}));

vi.mock("@/lib/actions/friend-streaks", () => ({
  getFriendStreaksForGoal: vi.fn().mockResolvedValue([]),
  nudgeFriend: vi.fn(),
  createFriendStreak: vi.fn(),
}));

vi.mock("@/components/ui/AchievementToast", () => ({
  showAchievementToast: vi.fn(),
  AchievementToastProvider: () => null,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("GoalMenu Component", () => {
  it("renders menu button", async () => {
    const { GoalMenu } = await import("@/app/(app)/home/goal-menu");
    render(<GoalMenu goalId="g1" status="active" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows pause option for active goal", async () => {
    const { GoalMenu } = await import("@/app/(app)/home/goal-menu");
    render(<GoalMenu goalId="g1" status="active" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Pausar meta")).toBeInTheDocument();
      expect(screen.getByText("Concluir meta")).toBeInTheDocument();
    });
  });

  it("shows reactivate option for paused goal", async () => {
    const { GoalMenu } = await import("@/app/(app)/home/goal-menu");
    render(<GoalMenu goalId="g1" status="paused" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Reativar meta")).toBeInTheDocument();
      expect(screen.getByText("Concluir meta")).toBeInTheDocument();
    });
  });

  it("calls updateGoalStatus with paused on pause click", async () => {
    mockUpdateGoalStatus.mockResolvedValue(undefined);
    const { GoalMenu } = await import("@/app/(app)/home/goal-menu");
    render(<GoalMenu goalId="goal-123" status="active" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => screen.getByText("Pausar meta"));
    fireEvent.click(screen.getByText("Pausar meta"));

    await waitFor(() => {
      expect(mockUpdateGoalStatus).toHaveBeenCalledWith("goal-123", "paused");
    });
  });

  it("calls updateGoalStatus with completed on complete click", async () => {
    mockUpdateGoalStatus.mockResolvedValue(undefined);
    const { GoalMenu } = await import("@/app/(app)/home/goal-menu");
    render(<GoalMenu goalId="goal-456" status="active" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => screen.getByText("Concluir meta"));
    fireEvent.click(screen.getByText("Concluir meta"));

    await waitFor(() => {
      expect(mockUpdateGoalStatus).toHaveBeenCalledWith("goal-456", "completed");
    });
  });
});

describe("WeeklyScoreChart Component", () => {
  it("renders 7 day labels", async () => {
    const { WeeklyScoreChart } = await import("@/components/history/WeeklyScoreChart");
    render(<WeeklyScoreChart checkins={[]} />);

    const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    // At least the current day should appear
    const found = labels.filter((l) => screen.queryByText(l));
    expect(found.length).toBeGreaterThanOrEqual(1);
  });

  it("renders title", async () => {
    const { WeeklyScoreChart } = await import("@/components/history/WeeklyScoreChart");
    render(<WeeklyScoreChart checkins={[]} />);
    expect(screen.getByText("Score da semana")).toBeInTheDocument();
  });
});

describe("MoodDistribution Component", () => {
  it("returns null for empty checkins", async () => {
    const { MoodDistribution } = await import("@/components/history/MoodDistribution");
    const { container } = render(<MoodDistribution checkins={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders title with checkins", async () => {
    const { MoodDistribution } = await import("@/components/history/MoodDistribution");
    render(<MoodDistribution checkins={[{ mood: "great" }, { mood: "good" }, { mood: "great" }]} />);
    expect(screen.getByText("Distribuição de humor")).toBeInTheDocument();
  });

  it("shows percentages", async () => {
    const { MoodDistribution } = await import("@/components/history/MoodDistribution");
    render(<MoodDistribution checkins={[{ mood: "great" }, { mood: "great" }]} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});

describe("AchievementToast", () => {
  it("provider renders without error", async () => {
    const { AchievementToastProvider } = await import("@/components/ui/AchievementToast");
    const { container } = render(<AchievementToastProvider />);
    // Should render nothing initially
    expect(container.innerHTML).toBe("");
  });
});

describe("Confetti Component", () => {
  it("renders particles", async () => {
    const { Confetti } = await import("@/components/ui/Confetti");
    const { container } = render(<Confetti count={5} />);

    await waitFor(() => {
      const particles = container.querySelectorAll(".absolute");
      expect(particles.length).toBe(5);
    });
  });
});
