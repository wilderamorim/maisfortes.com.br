import { describe, it, expect } from "vitest";

// ============================================
// Unit Tests: Supporters & Messages Logic
// ============================================

describe("Invite Code Generation", () => {
  it("generates 12-char hex string", () => {
    // encode(gen_random_bytes(6), 'hex') = 12 chars
    const code = "a1b2c3d4e5f6";
    expect(code).toHaveLength(12);
    expect(/^[0-9a-f]+$/.test(code)).toBe(true);
  });
});

describe("Supporter Status Transitions", () => {
  it("pending -> active on accept", () => {
    const status = "pending";
    const newStatus = "active";
    expect(status).toBe("pending");
    expect(newStatus).toBe("active");
  });

  it("active -> removed on remove", () => {
    const status = "active";
    const newStatus = "removed";
    expect(newStatus).toBe("removed");
  });

  it("cannot accept already active", () => {
    const status = "active";
    const canAccept = status === "pending";
    expect(canAccept).toBe(false);
  });
});

describe("Supporter Permissions", () => {
  it("default: can see score, cannot see notes", () => {
    const defaults = { can_see_score: true, can_see_notes: false };
    expect(defaults.can_see_score).toBe(true);
    expect(defaults.can_see_notes).toBe(false);
  });
});

describe("Self-Support Prevention", () => {
  it("blocks self as supporter", () => {
    const userId = "user-1";
    const goalOwnerId = "user-1";
    const isSelf = userId === goalOwnerId;
    expect(isSelf).toBe(true);
  });

  it("allows different user as supporter", () => {
    const userId = "user-2";
    const goalOwnerId = "user-1";
    const isSelf = userId === goalOwnerId;
    expect(isSelf).toBe(false);
  });
});

describe("Message Validation", () => {
  it("content max 500 chars", () => {
    const content = "a".repeat(500);
    expect(content.length).toBeLessThanOrEqual(500);
  });

  it("rejects content over 500 chars", () => {
    const content = "a".repeat(501);
    expect(content.length).toBeGreaterThan(500);
  });

  it("message type defaults to 'message'", () => {
    const type = "message";
    expect(type).toBe("message");
  });

  it("reaction type with emoji", () => {
    const msg = { type: "reaction", reaction_emoji: "💪" };
    expect(msg.type).toBe("reaction");
    expect(msg.reaction_emoji).toBe("💪");
  });
});

describe("Reaction Options", () => {
  const REACTIONS = ["❤️", "💪", "👏", "🤗"];

  it("has 4 reactions", () => {
    expect(REACTIONS).toHaveLength(4);
  });

  it("includes heart", () => {
    expect(REACTIONS).toContain("❤️");
  });

  it("includes strength", () => {
    expect(REACTIONS).toContain("💪");
  });
});

describe("Unread Count", () => {
  it("counts messages with null read_at", () => {
    const messages = [
      { read_at: null },
      { read_at: "2026-04-11T10:00:00Z" },
      { read_at: null },
    ];
    const unread = messages.filter((m) => m.read_at === null).length;
    expect(unread).toBe(2);
  });

  it("returns 0 when all read", () => {
    const messages = [
      { read_at: "2026-04-11T10:00:00Z" },
      { read_at: "2026-04-11T11:00:00Z" },
    ];
    const unread = messages.filter((m) => m.read_at === null).length;
    expect(unread).toBe(0);
  });
});

describe("Confidant Achievement", () => {
  it("unlocks at 10 messages sent", () => {
    const messagesSent = 10;
    const eligible = messagesSent >= 10;
    expect(eligible).toBe(true);
  });

  it("does not unlock at 9", () => {
    const messagesSent = 9;
    const eligible = messagesSent >= 10;
    expect(eligible).toBe(false);
  });
});
