export type SupportPhase = "closed" | "following" | "evading" | "returning" | "stable";

export type SupportMachine = { phase: SupportPhase; evasions: 0 | 1 | 2 };

export const closedSupport: SupportMachine = { phase: "closed", evasions: 0 };

export function openFollowing(state: SupportMachine): SupportMachine {
  return state.phase === "closed" ? { ...state, phase: "following" } : state;
}

export function openStable(state: SupportMachine): SupportMachine {
  return { ...state, phase: "stable" };
}

export function beginEvasion(state: SupportMachine): SupportMachine {
  if (state.phase !== "following" || state.evasions >= 2) return state;
  return { evasions: (state.evasions + 1) as 1 | 2, phase: "evading" };
}

export function beginReturn(state: SupportMachine): SupportMachine {
  return state.phase === "evading" ? { ...state, phase: "returning" } : state;
}

export function finishReturn(state: SupportMachine): SupportMachine {
  if (state.phase !== "returning") return state;
  return { ...state, phase: state.evasions >= 2 ? "stable" : "following" };
}
