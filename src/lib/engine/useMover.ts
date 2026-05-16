import { useEffect, useMemo, useRef, type RefCallback } from "react";
import { Mover, type MoverOptions } from "./Mover";
import { useWorld } from "./World";

export interface UseMoverRes<T extends HTMLElement = HTMLDivElement> {
  ref: RefCallback<T>;
  mover: Mover;
}

export function useMover<T extends HTMLElement = HTMLDivElement>(
  options: MoverOptions = {},
): UseMoverRes<T> {
  const world = useWorld();

  // 최초 1회만 mover 생성
  const moverRef = useRef<Mover | null>(null);
  if (!moverRef.current) {
    moverRef.current = new Mover(options);
  }
  const mover = moverRef.current;

  // Register with the world for the lifetime of this component.
  useEffect(() => {
    const unregister = world.registerMover(mover);
    return unregister;
  }, [world, mover]);

  // ref callback: bind / unbind the DOM element.
  const ref = useMemo<RefCallback<T>>(() => {
    return (el) => {
      world.bindElement(mover, el);
    };
  }, [world, mover]);

  return { ref, mover };
}
