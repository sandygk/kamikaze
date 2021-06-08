import { Vector } from '../types';

export const set = (vector: Vector, x: number, y: number) => {
  vector.x = x;
  vector.y = y;
  return vector;
};

export const setToLeft = (vector: Vector) => {
  return set(vector, -1, 0);
};

export const setToRight = (vector: Vector) => {
  return set(vector, 1, 0);
};

export const setToUp = (vector: Vector) => {
  return set(vector, 0, 1);
};

export const setToDown = (vector: Vector) => {
  return set(vector, 0, -1);
};

export const add = (a: Vector, b: Vector) => {
  a.x += b.x;
  a.y += b.y;
  return a;
};

export const addScalar = (vector: Vector, scalar: number) => {
  vector.x += scalar;
  vector.y += scalar;
  return vector;
};

export const subtract = (a: Vector, b: Vector) => {
  a.x -= b.x;
  a.y -= b.y;
  return a;
};
export const subtractScalar = (vector: Vector, scalar: number) => {
  vector.x -= scalar;
  vector.y -= scalar;
  return vector;
};

export const multiply = (a: Vector, b: Vector) => {
  a.x *= b.x;
  a.y *= b.y;
  return a;
};

export const multiplyScalar = (vector: Vector, scalar: number) => {
  vector.x *= scalar;
  vector.y *= scalar;
  return vector;
};

export const divide = (a: Vector, b: Vector) => {
  a.x /= b.x;
  a.y /= b.y;
  return a;
};
export const divideScalar = (vector: Vector, scalar: number) => {
  if (scalar !== 0) {
    vector.x /= scalar;
    vector.y /= scalar;
  } else {
    vector.x = 0;
    vector.y = 0;
  }
  return vector;
};

export const negate = (vector: Vector) => {
  vector.x = -vector.x;
  vector.y = -vector.y;
  return vector;
};

export const clamp = (vector: Vector, n: number) => {
  if (length(vector) > n) {
    normalize(vector);
    multiplyScalar(vector, n);
  }
  return vector;
};

export const dot = (a: Vector, b: Vector) => {
  return a.x * b.x + a.y * b.y;
};

export const cross = (a: Vector, b: Vector) => {
  return a.x * b.y - a.y * b.x;
};

export const projectOnto = (a: Vector, b: Vector) => {
  const coefficient = (a.x * b.x + a.y * b.y) / (b.x * b.x + b.y * b.y);
  a.x = coefficient * b.x;
  a.y = coefficient * b.y;
  return a;
};

export const projectLengthOnto = (a: Vector, b: Vector) => {
  return dot(a, b) / length(b);
};

export const getAngle = (vector: Vector) => {
  return Math.atan2(vector.y, vector.x);
};

export const rotate = (vector: Vector, angle: number) => {
  const newX = vector.x * Math.cos(angle) - vector.y * Math.sin(angle);
  const newY = vector.x * Math.sin(angle) + vector.y * Math.cos(angle);

  vector.x = newX;
  vector.y = newY;
  return vector;
};

export const rotateTo = (vector: Vector, rotation: number) => {
  return rotate(vector, rotation - getAngle(vector));
};

export const rotateBy = (vector: Vector, rotation: number) => {
  const newAngle = getAngle(vector) + rotation;
  return rotate(vector, newAngle);
};

export const setLength = (vector: Vector, length: number) => {
  const angle = getAngle(vector);
  vector.x = Math.cos(angle) * length;
  vector.y = Math.sin(angle) * length;
};

export const length = (vector: Vector) => {
  return Math.sqrt(lengthSq(vector));
};

export const lengthSq = (vector: Vector) => {
  return vector.x * vector.x + vector.y * vector.y;
};

export const distance = (a: Vector, b: Vector) => {
  return Math.sqrt(distanceSq(a, b));
};

export const distanceSq = (a: Vector, b: Vector) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
};

export const normalize = (vector: Vector) => {
  const len = length(vector);

  if (len === 0) {
    vector.x = 1;
    vector.y = 0;
  } else {
    divideScalar(vector, len);
  }
  return vector;
};
