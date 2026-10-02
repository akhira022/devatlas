import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { GIT_SIM_COMMANDS, INITIAL_STATE, buildTimeline } from "@/lib/git-sim/commands";

const timeline = buildTimeline();
const stateAfter = (id: string) => timeline[GIT_SIM_COMMANDS.findIndex((c) => c.id === id)];
const headCommit = (id: string) => {
  const local = stateAfter(id).local!;
  return local.branches[local.head];
};

describe("git-sim commands", () => {
  it("covers the top 10 commands in order", () => {
    expect(GIT_SIM_COMMANDS.map((c) => c.name)).toEqual([
      "init",
      "clone",
      "status",
      "add",
      "commit",
      "push",
      "pull",
      "branch",
      "checkout",
      "merge",
    ]);
    expect(timeline).toHaveLength(10);
  });

  it("links every command to an existing concept", () => {
    for (const command of GIT_SIM_COMMANDS) {
      const file = path.join(process.cwd(), "data/concepts", `${command.conceptSlug}.json`);
      expect(existsSync(file), command.conceptSlug).toBe(true);
    }
  });

  it("does not mutate the initial state", () => {
    expect(INITIAL_STATE.local).toBeNull();
    expect(INITIAL_STATE.workingDir.every((f) => f.status === "untracked")).toBe(true);
  });

  it("init creates an empty repo with HEAD on main", () => {
    const { local, remote } = stateAfter("init");
    expect(local).toEqual({ commits: [], branches: {}, head: "main" });
    expect(remote).toBeNull();
  });

  it("clone copies remote history into local", () => {
    const { local, remote, workingDir } = stateAfter("clone");
    expect(remote?.commits).toHaveLength(2);
    expect(local?.commits).toEqual(remote?.commits);
    expect(workingDir.every((f) => f.status === "clean")).toBe(true);
  });

  it("status reports the modified file without touching the repo", () => {
    const before = stateAfter("clone");
    const after = stateAfter("status");
    expect(after.workingDir.find((f) => f.name === "app.js")?.status).toBe("modified");
    expect(after.local).toEqual(before.local);
  });

  it("add moves the file into staging", () => {
    expect(stateAfter("add").staging).toEqual(["app.js"]);
  });

  it("commit empties staging and advances main", () => {
    const state = stateAfter("commit");
    expect(state.staging).toEqual([]);
    expect(state.local?.commits).toHaveLength(3);
    expect(headCommit("commit")).toBe("c3d");
    expect(state.remote?.branches.main).toBe("b2c");
  });

  it("push syncs remote with local", () => {
    const { local, remote } = stateAfter("push");
    expect(remote?.commits).toEqual(local?.commits);
    expect(remote?.branches.main).toBe("c3d");
  });

  it("pull brings the teammate commit into local", () => {
    const { local, remote } = stateAfter("pull");
    expect(remote?.branches.main).toBe("d4e");
    expect(local?.branches.main).toBe("d4e");
  });

  it("branch creates feat without moving HEAD", () => {
    const local = stateAfter("branch").local!;
    expect(local.branches.feat).toBe("d4e");
    expect(local.head).toBe("main");
  });

  it("checkout moves HEAD to feat", () => {
    expect(stateAfter("checkout").local?.head).toBe("feat");
  });

  it("merge fast-forwards main to the feature commit", () => {
    const local = stateAfter("merge").local!;
    expect(local.head).toBe("main");
    expect(local.branches.main).toBe("e5f");
    expect(local.branches.feat).toBe("e5f");
    expect(stateAfter("merge").remote?.branches.main).toBe("d4e");
  });
});
