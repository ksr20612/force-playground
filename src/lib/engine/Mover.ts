import { Vector2 } from "@/lib/vector/Vector";
import type { Vector2Like } from "./types";

export interface MoverOptions {
  position?: Vector2Like;
  velocity?: Vector2Like;
  acceleration?: Vector2Like;
  mass?: number;
  label?: string;
  radius?: number;
}

export class Mover {
  position: Vector2; // 위치
  velocity: Vector2; // 속도: 위치의 변화량
  acceleration: Vector2; // 가속도: 속도의 변화량
  mass: number; // 질량
  label?: string; // 물체 설명
  radius: number; // 물체 크기

  // 적용된 Force 목록
  readonly _appliedForces: Vector2[] = [];

  constructor(options: MoverOptions = {}) {
    const {
      position,
      velocity,
      acceleration,
      mass = 1,
      label,
      radius = 12,
    } = options;
    if (mass <= 0) throw new Error("Body.mass must be > 0");

    this.position = position
      ? new Vector2(position.x, position.y)
      : new Vector2(0, 0);
    this.velocity = velocity
      ? new Vector2(velocity.x, velocity.y)
      : new Vector2(0, 0);
    this.acceleration = acceleration
      ? new Vector2(acceleration.x, acceleration.y)
      : new Vector2(0, 0);

    this.mass = mass;
    this.label = label;
    this.radius = radius;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
  }

  /**
   * Apply a force vector. F = m * a, so we add `force / mass` to acceleration.
   * The acceleration is cleared at the start of each frame by the engine.
   */
  applyForce(force: Vector2Like): void {
    this.acceleration.x += force.x / this.mass;
    this.acceleration.y += force.y / this.mass;
    this._appliedForces.push(new Vector2(force.x, force.y));
  }

  setPosition(p: Vector2Like): void {
    this.position.x = p.x;
    this.position.y = p.y;
  }

  stop(): void {
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.acceleration.x = 0;
    this.acceleration.y = 0;
  }
}
