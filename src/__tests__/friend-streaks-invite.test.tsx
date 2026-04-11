import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

// ============================================
// Feature Tests: Invite Page & Checkin Feedback
// ============================================

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ id: "streak-abc" }),
  useSearchParams: () => ({ get: (k: string) => (k === "goal" ? "goal-1" : null) }),
}));

const mockFrom = vi.fn();
const mockGetUser = vi.fn();
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  }),
}));

const mockGetInvite = vi.fn();
const mockAccept = vi.fn();
const mockGetStreaksForGoal = vi.fn();
const mockNudge = vi.fn();

vi.mock("@/lib/actions/friend-streaks", () => ({
  getFriendStreakInvite: (...args: unknown[]) => mockGetInvite(...args),
  acceptFriendStreak: (...args: unknown[]) => mockAccept(...args),
  getFriendStreaksForGoal: (...args: unknown[]) => mockGetStreaksForGoal(...args),
  nudgeFriend: (...args: unknown[]) => mockNudge(...args),
  createFriendStreak: vi.fn(),
}));

vi.mock("@/lib/actions/checkins", () => ({
  createCheckin: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/actions/supporters", () => ({
  getSupportersForGoal: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/actions/messages", () => ({
  sendMessage: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Invite Page", () => {
  it("shows error for self-invite", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockGetInvite.mockResolvedValue({ error: "self" });

    const InvitePage = (await import("@/app/invite/friend/[id]/page")).default;
    render(<InvitePage />);

    await waitFor(() => {
      expect(screen.getByText("Você não pode aceitar seu próprio convite.")).toBeInTheDocument();
    });
  });

  it("shows error when invite not found", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-2" } } });
    mockGetInvite.mockResolvedValue(null);

    const InvitePage = (await import("@/app/invite/friend/[id]/page")).default;
    render(<InvitePage />);

    await waitFor(() => {
      expect(screen.getByText("Convite não encontrado ou já aceito.")).toBeInTheDocument();
    });
  });

  it("shows inviter name and target days", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-2" } } });
    mockGetInvite.mockResolvedValue({ id: "streak-abc", inviterName: "João", targetDays: 60 });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [{ id: "g1", title: "Meditar" }],
      }),
    });

    const InvitePage = (await import("@/app/invite/friend/[id]/page")).default;
    render(<InvitePage />);

    await waitFor(() => {
      expect(screen.getByText(/João/)).toBeInTheDocument();
      expect(screen.getByText(/60 dias/)).toBeInTheDocument();
    });
  });

  it("shows warning when user has no active goals", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-2" } } });
    mockGetInvite.mockResolvedValue({ id: "streak-abc", inviterName: "Maria", targetDays: 30 });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [] }),
    });

    const InvitePage = (await import("@/app/invite/friend/[id]/page")).default;
    render(<InvitePage />);

    await waitFor(() => {
      expect(screen.getByText(/criar uma meta primeiro/)).toBeInTheDocument();
    });
  });

  it("auto-selects when user has single goal", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-2" } } });
    mockGetInvite.mockResolvedValue({ id: "streak-abc", inviterName: "Ana", targetDays: 14 });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [{ id: "g1", title: "Treinar" }],
      }),
    });

    const InvitePage = (await import("@/app/invite/friend/[id]/page")).default;
    render(<InvitePage />);

    await waitFor(() => {
      // Accept button should be enabled (goal auto-selected)
      const acceptBtn = screen.getByText("Aceitar ofensiva");
      expect(acceptBtn).not.toBeDisabled();
    });
  });

  it("shows multiple goals for selection", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-2" } } });
    mockGetInvite.mockResolvedValue({ id: "streak-abc", inviterName: "Pedro", targetDays: 30 });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [
          { id: "g1", title: "Parar de fumar" },
          { id: "g2", title: "Exercício" },
        ],
      }),
    });

    const InvitePage = (await import("@/app/invite/friend/[id]/page")).default;
    render(<InvitePage />);

    await waitFor(() => {
      expect(screen.getByText("Parar de fumar")).toBeInTheDocument();
      expect(screen.getByText("Exercício")).toBeInTheDocument();
      expect(screen.getByText("Escolha sua meta para a ofensiva")).toBeInTheDocument();
    });
  });

  it("shows visibility toggle", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-2" } } });
    mockGetInvite.mockResolvedValue({ id: "streak-abc", inviterName: "X", targetDays: 30 });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [{ id: "g1", title: "Meta" }] }),
    });

    const InvitePage = (await import("@/app/invite/friend/[id]/page")).default;
    render(<InvitePage />);

    await waitFor(() => {
      expect(screen.getByText("Meta visível para o amigo")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Meta visível para o amigo"));
    expect(screen.getByText("Meta privada (amigo não verá o nome)")).toBeInTheDocument();
  });

  it("calls acceptFriendStreak on accept", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-2" } } });
    mockGetInvite.mockResolvedValue({ id: "streak-abc", inviterName: "Y", targetDays: 30 });
    mockAccept.mockResolvedValue(undefined);
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [{ id: "g1", title: "Meta" }] }),
    });

    const InvitePage = (await import("@/app/invite/friend/[id]/page")).default;
    render(<InvitePage />);

    await waitFor(() => {
      expect(screen.getByText("Aceitar ofensiva")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Aceitar ofensiva"));

    await waitFor(() => {
      expect(mockAccept).toHaveBeenCalledWith({
        friendStreakId: "streak-abc",
        goalId: "g1",
        goalVisible: true,
      });
    });
  });

  it("redirects to /network after accepting", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-2" } } });
    mockGetInvite.mockResolvedValue({ id: "streak-abc", inviterName: "Z", targetDays: 30 });
    mockAccept.mockResolvedValue(undefined);
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [{ id: "g1", title: "Meta" }] }),
    });

    const InvitePage = (await import("@/app/invite/friend/[id]/page")).default;
    render(<InvitePage />);

    await waitFor(() => screen.getByText("Aceitar ofensiva"));
    fireEvent.click(screen.getByText("Aceitar ofensiva"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/network");
    });
  });

  it("shows 'Agora não' link", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-2" } } });
    mockGetInvite.mockResolvedValue(null);

    const InvitePage = (await import("@/app/invite/friend/[id]/page")).default;
    render(<InvitePage />);

    await waitFor(() => {
      expect(screen.getByText("Agora não")).toBeInTheDocument();
    });
  });
});

describe("Checkin Page — Friend Streak Feedback", () => {
  beforeEach(() => {
    mockGetStreaksForGoal.mockResolvedValue([]);
  });

  it("shows friend streak after check-in when streaks exist", async () => {
    mockGetStreaksForGoal.mockResolvedValue([
      { id: "fs-1", friend_name: "João", friend_checked_today: false, current_streak: 8, target_days: 30 },
    ]);

    const CheckinPage = (await import("@/app/(app)/checkin/page")).default;
    render(<CheckinPage />);

    // Select score 4 (Bom)
    const buttons = screen.getAllByRole("button");
    const bomButton = buttons.find((b) => b.textContent?.includes("Bom"));
    if (bomButton) fireEvent.click(bomButton);

    // Submit
    const submitBtn = screen.getByText("Registrar check-in");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Ofensiva com João/)).toBeInTheDocument();
      expect(screen.getByText(/8\/30/)).toBeInTheDocument();
    });
  });

  it("shows nudge button when friend has not checked in", async () => {
    mockGetStreaksForGoal.mockResolvedValue([
      { id: "fs-1", friend_name: "Maria", friend_checked_today: false, current_streak: 3, target_days: 14 },
    ]);

    const CheckinPage = (await import("@/app/(app)/checkin/page")).default;
    render(<CheckinPage />);

    const buttons = screen.getAllByRole("button");
    const bomButton = buttons.find((b) => b.textContent?.includes("Bom"));
    if (bomButton) fireEvent.click(bomButton);

    fireEvent.click(screen.getByText("Registrar check-in"));

    await waitFor(() => {
      expect(screen.getByText("👋 Cutucar")).toBeInTheDocument();
    });
  });

  it("shows 'Fez!' when friend already checked in", async () => {
    mockGetStreaksForGoal.mockResolvedValue([
      { id: "fs-1", friend_name: "Pedro", friend_checked_today: true, current_streak: 5, target_days: 30 },
    ]);

    const CheckinPage = (await import("@/app/(app)/checkin/page")).default;
    render(<CheckinPage />);

    const buttons = screen.getAllByRole("button");
    const bomButton = buttons.find((b) => b.textContent?.includes("Bom"));
    if (bomButton) fireEvent.click(bomButton);

    fireEvent.click(screen.getByText("Registrar check-in"));

    await waitFor(() => {
      expect(screen.getByText(/Fez!/)).toBeInTheDocument();
    });
  });

  it("shows Continuar button when friend streaks exist", async () => {
    mockGetStreaksForGoal.mockResolvedValue([
      { id: "fs-1", friend_name: "Ana", friend_checked_today: false, current_streak: 1, target_days: 7 },
    ]);

    const CheckinPage = (await import("@/app/(app)/checkin/page")).default;
    render(<CheckinPage />);

    const buttons = screen.getAllByRole("button");
    const bomButton = buttons.find((b) => b.textContent?.includes("Bom"));
    if (bomButton) fireEvent.click(bomButton);

    fireEvent.click(screen.getByText("Registrar check-in"));

    await waitFor(() => {
      expect(screen.getByText("Continuar")).toBeInTheDocument();
    });
  });

  it("nudge button changes to Cutucado after click", async () => {
    mockGetStreaksForGoal.mockResolvedValue([
      { id: "fs-1", friend_name: "Carlos", friend_checked_today: false, current_streak: 2, target_days: 30 },
    ]);
    mockNudge.mockResolvedValue(undefined);

    const CheckinPage = (await import("@/app/(app)/checkin/page")).default;
    render(<CheckinPage />);

    const buttons = screen.getAllByRole("button");
    const bomButton = buttons.find((b) => b.textContent?.includes("Bom"));
    if (bomButton) fireEvent.click(bomButton);

    fireEvent.click(screen.getByText("Registrar check-in"));

    await waitFor(() => {
      expect(screen.getByText("👋 Cutucar")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("👋 Cutucar"));

    await waitFor(() => {
      expect(screen.getByText("👋 Cutucado!")).toBeInTheDocument();
    });
  });

  it("shows multiple friend streaks after check-in", async () => {
    mockGetStreaksForGoal.mockResolvedValue([
      { id: "fs-1", friend_name: "João", friend_checked_today: true, current_streak: 10, target_days: 30 },
      { id: "fs-2", friend_name: "Maria", friend_checked_today: false, current_streak: 5, target_days: 14 },
    ]);

    const CheckinPage = (await import("@/app/(app)/checkin/page")).default;
    render(<CheckinPage />);

    const buttons = screen.getAllByRole("button");
    const bomButton = buttons.find((b) => b.textContent?.includes("Bom"));
    if (bomButton) fireEvent.click(bomButton);

    fireEvent.click(screen.getByText("Registrar check-in"));

    await waitFor(() => {
      expect(screen.getByText(/Ofensiva com João/)).toBeInTheDocument();
      expect(screen.getByText(/Ofensiva com Maria/)).toBeInTheDocument();
    });
  });
});
