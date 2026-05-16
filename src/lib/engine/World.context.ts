import { createContext } from "react";
import { Mover } from "./Mover";
import { DebugState, ForceFn, Vector2Like } from "./types";

export interface WorldContextValue {
  registerMover: (body: Mover) => () => void;
  bindElement: (body: Mover, el: HTMLElement | null) => void;
  registerForce: (body: Mover, force: ForceFn) => () => void;
  getBodies: () => Mover[];

  // --- reactive controls (debug panel binds to these) ---
  paused: boolean;
  setPaused: (paused: boolean) => void;
  step: () => void;
  reset: () => void;
  timeScale: number;
  setTimeScale: (scale: number) => void;
  fps: number;

  debug: DebugState;
  setDebug: (patch: Partial<DebugState>) => void;

  // --- mouse, in stage-local pixels ---
  mouse: Vector2Like | null;
  setMouse: (m: Vector2Like | null) => void;
  bounds: { width: number; height: number };
  setBounds: (b: { width: number; height: number }) => void;
}

const WorldContext = createContext<WorldContextValue | null>(null);

export default WorldContext;
