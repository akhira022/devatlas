export type GitSimFileStatus = "untracked" | "clean" | "modified" | "staged";

export interface GitSimFile {
  name: string;
  status: GitSimFileStatus;
}

export interface GitSimCommit {
  id: string;
  message: string;
}

export interface GitSimRepo {
  /** Commits in order, oldest first. The simulator keeps history linear. */
  commits: GitSimCommit[];
  /** Branch name to commit id. A branch without commits is omitted. */
  branches: Record<string, string>;
}

export interface GitSimLocalRepo extends GitSimRepo {
  head: string;
}

export interface GitSimState {
  workingDir: GitSimFile[];
  staging: string[];
  local: GitSimLocalRepo | null;
  remote: GitSimRepo | null;
}

export type GitSimArea = "remote" | "local" | "staging" | "working";

export interface GitSimCommand {
  id: string;
  name: string;
  command: string;
  label: string;
  title: string;
  description: string;
  areas: GitSimArea[];
  conceptSlug: string;
  apply: (state: GitSimState) => GitSimState;
}
