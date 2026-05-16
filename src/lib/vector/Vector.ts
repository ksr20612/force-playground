export class Vector2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector2(this.x, this.y);
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  // 벡터 덧셈
  add(other: Vector2) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  // 벡터 뺄셈
  sub(other: Vector2) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  // 벡터 곱셈
  mult(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  // 벡터 나눗셈
  div(scalar: number) {
    if (scalar === 0) {
      throw new Error("Scalar cannot be 0");
    }

    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  // 벡터 크기 계산
  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  // 벡터 정규화
  normalize() {
    const magnitude = this.mag();

    if (magnitude === 0) {
      throw new Error("Vector cannot be normalized if it has a magnitude of 0");
    }

    this.div(magnitude);
    return this;
  }

  // 크기가 mag인 벡터 설정
  setMag(mag: number): this {
    this.normalize().mult(mag);

    return this;
  }

  // 최대 벡터 크기 제한
  limit(max: number) {
    const magnitude = this.mag();

    if (magnitude > max) {
      this.normalize().mult(max);
    }
  }

  // 정적 메서드
  static add(a: Vector2, b: Vector2) {
    return a.copy().set(a.x + b.x, a.y + b.y);
  }

  static sub(a: Vector2, b: Vector2) {
    return a.copy().set(a.x - b.x, a.y - b.y);
  }

  static mult(a: Vector2, scalar: number) {
    return a.copy().set(a.x * scalar, a.y * scalar);
  }

  static div(a: Vector2, scalar: number) {
    return a.copy().set(a.x / scalar, a.y / scalar);
  }

  static normalize(a: Vector2) {
    return a.copy().normalize();
  }
}
