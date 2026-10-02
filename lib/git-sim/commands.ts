import type {
  GitSimCommand,
  GitSimCommit,
  GitSimFile,
  GitSimFileStatus,
  GitSimLocalRepo,
  GitSimRepo,
  GitSimState,
} from "@/lib/git-sim/types";

const FILES = ["app.js", "api.js", "ui.css"] as const;

export const INITIAL_STATE: GitSimState = {
  workingDir: FILES.map((name) => ({ name, status: "untracked" })),
  staging: [],
  local: null,
  remote: null,
};

function setFileStatus(files: GitSimFile[], name: string, status: GitSimFileStatus) {
  return files.map((file) => (file.name === name ? { ...file, status } : file));
}

function cloneRepo(repo: GitSimRepo): GitSimRepo {
  return { commits: [...repo.commits], branches: { ...repo.branches } };
}

function commitOn(local: GitSimLocalRepo, commit: GitSimCommit): GitSimLocalRepo {
  return {
    ...local,
    commits: [...local.commits, commit],
    branches: { ...local.branches, [local.head]: commit.id },
  };
}

function requireLocal(state: GitSimState): GitSimLocalRepo {
  if (!state.local) throw new Error("git-sim: command needs a local repository");
  return state.local;
}

export const GIT_SIM_COMMANDS: GitSimCommand[] = [
  {
    id: "init",
    name: "init",
    command: "git init",
    label: "เริ่ม repo ใหม่",
    title: "สร้าง repository ว่างในโฟลเดอร์นี้",
    description:
      "Git สร้างโฟลเดอร์ .git เพื่อเก็บประวัติ — ยังไม่มี commit ใดๆ HEAD ชี้ไปที่ branch main ที่ยังว่างอยู่ ไฟล์ในโฟลเดอร์ยังเป็น untracked",
    areas: ["local"],
    conceptSlug: "git-init",
    apply: (state) => ({
      ...state,
      local: { commits: [], branches: {}, head: "main" },
    }),
  },
  {
    id: "clone",
    name: "clone",
    command: "git clone https://github.com/team/app.git",
    label: "คัดลอก repo",
    title: "อีกวิธีที่พบบ่อย: คัดลอก repo ที่มีอยู่แล้วบน remote",
    description:
      "clone ดาวน์โหลดทุก commit จาก remote (origin) มาเป็น local repo และแตกไฟล์ล่าสุดลง working directory — ทั้งสองฝั่งจึงมีประวัติเหมือนกัน",
    areas: ["remote", "local", "working"],
    conceptSlug: "git-clone",
    apply: (state) => {
      const remote: GitSimRepo = {
        commits: [
          { id: "a1f", message: "init project" },
          { id: "b2c", message: "add api" },
        ],
        branches: { main: "b2c" },
      };
      return {
        ...state,
        workingDir: FILES.map((name) => ({ name, status: "clean" })),
        staging: [],
        remote,
        local: { ...cloneRepo(remote), head: "main" },
      };
    },
  },
  {
    id: "status",
    name: "status",
    command: "git status",
    label: "ดูว่าอะไรเปลี่ยน",
    title: "หลังแก้ app.js — ตรวจว่าไฟล์ไหนเปลี่ยน",
    description:
      "status ไม่เปลี่ยนอะไรใน repo แค่รายงานว่า app.js ถูกแก้ (modified) แต่ยังไม่ได้ stage — ควรรันบ่อยๆ ก่อน add และ commit",
    areas: ["working"],
    conceptSlug: "git-status",
    apply: (state) => ({
      ...state,
      workingDir: setFileStatus(state.workingDir, "app.js", "modified"),
    }),
  },
  {
    id: "add",
    name: "add",
    command: "git add app.js",
    label: "เตรียมไฟล์ (stage)",
    title: "ย้ายการแก้ไขของ app.js เข้า staging area",
    description:
      "staging area คือ 'ตะกร้า' ของสิ่งที่จะอยู่ใน commit ถัดไป — เลือกได้ว่าจะ commit ไฟล์ไหน ไม่จำเป็นต้องทั้งหมด",
    areas: ["working", "staging"],
    conceptSlug: "git-add",
    apply: (state) => ({
      ...state,
      workingDir: setFileStatus(state.workingDir, "app.js", "staged"),
      staging: [...new Set([...state.staging, "app.js"])],
    }),
  },
  {
    id: "commit",
    name: "commit",
    command: 'git commit -m "update app"',
    label: "บันทึก snapshot",
    title: "บันทึกสิ่งที่อยู่ใน staging เป็น commit ใหม่",
    description:
      "เกิดจุด commit ใหม่ใน local repo และ main เลื่อนไปชี้ commit นั้น — staging ว่างอีกครั้ง แต่ remote ยังไม่รู้เรื่องนี้",
    areas: ["staging", "local"],
    conceptSlug: "git-commit",
    apply: (state) => {
      const local = requireLocal(state);
      return {
        ...state,
        workingDir: state.workingDir.map((file) =>
          state.staging.includes(file.name) ? { ...file, status: "clean" } : file,
        ),
        staging: [],
        local: commitOn(local, { id: "c3d", message: "update app" }),
      };
    },
  },
  {
    id: "push",
    name: "push",
    command: "git push origin main",
    label: "อัปโหลด commit",
    title: "ส่ง commit ใหม่ขึ้น remote",
    description:
      "push อัปโหลด commit ที่ remote ยังไม่มี แล้วเลื่อน main บน origin ให้ตรงกับ local — ทีมจึงเห็นงานของเรา",
    areas: ["local", "remote"],
    conceptSlug: "git-push",
    apply: (state) => {
      const local = requireLocal(state);
      return { ...state, remote: cloneRepo(local) };
    },
  },
  {
    id: "pull",
    name: "pull",
    command: "git pull",
    label: "ดาวน์โหลด commit",
    title: "เพื่อนร่วมทีม push commit ใหม่ — ดึงมาที่เครื่องเรา",
    description:
      "pull = fetch + merge: ดาวน์โหลด commit ใหม่จาก origin (fix ui) มาต่อท้าย local และอัปเดตไฟล์ใน working directory",
    areas: ["remote", "local", "working"],
    conceptSlug: "git-pull",
    apply: (state) => {
      const local = requireLocal(state);
      const teammate: GitSimCommit = { id: "d4e", message: "fix ui" };
      const remote: GitSimRepo = {
        commits: [...local.commits, teammate],
        branches: { ...local.branches, main: teammate.id },
      };
      return {
        ...state,
        remote,
        local: { ...cloneRepo(remote), head: local.head },
      };
    },
  },
  {
    id: "branch",
    name: "branch",
    command: "git branch feat",
    label: "สร้าง branch",
    title: "สร้าง branch feat ที่ commit ปัจจุบัน",
    description:
      "branch เป็นแค่ป้ายชื่อที่ชี้ไปยัง commit — สร้างแล้วยังไม่ได้สลับไป HEAD จึงยังอยู่ที่ main",
    areas: ["local"],
    conceptSlug: "git-branch",
    apply: (state) => {
      const local = requireLocal(state);
      return {
        ...state,
        local: { ...local, branches: { ...local.branches, feat: local.branches[local.head] } },
      };
    },
  },
  {
    id: "checkout",
    name: "checkout",
    command: "git checkout feat",
    label: "สลับ branch",
    title: "ย้าย HEAD ไปที่ branch feat",
    description:
      "HEAD บอกว่าเรากำลังทำงานบน branch ไหน — commit ต่อจากนี้จะไปอยู่บน feat โดย main ไม่ขยับ",
    areas: ["local"],
    conceptSlug: "git-checkout",
    apply: (state) => {
      const local = requireLocal(state);
      return { ...state, local: { ...local, head: "feat" } };
    },
  },
  {
    id: "merge",
    name: "merge",
    command: "git merge feat",
    label: "รวม branch",
    title: "commit งานบน feat แล้วกลับมา main เพื่อรวม",
    description:
      "หลัง commit 'add feature' บน feat และ checkout main กลับมา merge จะนำงานจาก feat เข้า main — ในกรณีนี้ main ไม่มี commit ใหม่ จึงเป็น fast-forward (main เลื่อนตาม feat)",
    areas: ["local", "working"],
    conceptSlug: "git-merge",
    apply: (state) => {
      const local = requireLocal(state);
      const onFeat = commitOn({ ...local, head: "feat" }, { id: "e5f", message: "add feature" });
      return {
        ...state,
        local: {
          ...onFeat,
          head: "main",
          branches: { ...onFeat.branches, main: onFeat.branches.feat },
        },
      };
    },
  },
];

/** Returns the state after each command; index i is the state after command i. */
export function buildTimeline(
  commands: GitSimCommand[] = GIT_SIM_COMMANDS,
  initial: GitSimState = INITIAL_STATE,
): GitSimState[] {
  const states: GitSimState[] = [];
  let current = initial;
  for (const command of commands) {
    current = command.apply(current);
    states.push(current);
  }
  return states;
}
