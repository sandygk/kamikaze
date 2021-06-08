import { Vector } from '../types';

const getLeftVector = () => {
  return { x: -1, y: 0 };
};

const getRightVector = () => {
  return { x: 1, y: 0 };
};

const getUpVector = () => {
  return { x: 0, y: 1 };
};

const getDownVector = () => {
  return { x: 0, y: -1 };
};

const add = (a: Vector, b: Vector) => {
  a.x += b.x;
  a.y += b.y;
  return a;
};

const addScalar = (vector: Vector, scalar: number) => {
  vector.x += scalar;
  vector.y += scalar;
  return vector;
};

const subtract = (a: Vector, b: Vector) => {
  a.x -= b.x;
  a.y -= b.y;
  return a;
};
const subtractScalar = (vector: Vector, scalar: number) => {
  vector.x -= scalar;
  vector.y -= scalar;
  return vector;
};

const multiply = (a: Vector, b: Vector) => {
  a.x *= b.x;
  a.y *= b.y;
  return a;
};

const multiplyScalar = (vector: Vector, scalar: number) => {
  vector.x *= scalar;
  vector.y *= scalar;
  return vector;
};

const divide = (a: Vector, b: Vector) => {
  a.x /= b.x;
  a.y /= b.y;
  return a;
};
const divideScalar = (vector: Vector, scalar: number) => {
  if (scalar !== 0) {
    vector.x /= scalar;
    vector.y /= scalar;
  } else {
    vector.x = 0;
    vector.y = 0;
  }
  return vector;
};

const negate = (vector: Vector) => {
  vector.x = -vector.x;
  vector.y = -vector.y;
  return vector;
};

const clamp = (vector: Vector, n: number) => {
  if (length(vector) > n) {
    normalize(vector);
    multiplyScalar(vector, n);
  }
  return vector;
};

const dot = (a: Vector, b: Vector) => {
  return a.x * b.x + a.y * b.y;
};

const cross = (a: Vector, b: Vector) => {
  return a.x * b.y - a.y * b.x;
};

const projectOnto = (a: Vector, b: Vector) => {
  const coefficient = (a.x * b.x + a.y * b.y) / (b.x * b.x + b.y * b.y);
  a.x = coefficient * b.x;
  a.y = coefficient * b.y;
  return a;
};

const projectLengthOnto = (a: Vector, b: Vector) => {
  return dot(a, b) / length(b);
};

const getAngle = (vector: Vector) => {
  return Math.atan2(vector.y, vector.x);
};

const rotate = (vector: Vector, angle: number) => {
  const newX = vector.x * Math.cos(angle) - vector.y * Math.sin(angle);
  const newY = vector.x * Math.sin(angle) + vector.y * Math.cos(angle);

  vector.x = newX;
  vector.y = newY;
  return vector;
};

const rotateTo = (vector: Vector, rotation: number) => {
  rotate(vector, rotation - getAngle(vector));
};

const rotateBy = (vector: Vector, rotation: number) => {
  const newAngle = getAngle(vector) + rotation;

  return rotate(vector, newAngle);
};

const setLength = (vector: Vector, length: number) => {
  const angle = getAngle(vector);
  vector.x = Math.cos(angle) * length;
  vector.y = Math.sin(angle) * length;
};

const length = (vector: Vector) => {
  return Math.sqrt(lengthSq(vector));
};

const lengthSq = (vector: Vector) => {
  return vector.x * vector.x + vector.y * vector.y;
};

const distance = (a: Vector, b: Vector) => {
  return Math.sqrt(distanceSq(a, b));
};

const distanceSq = (a: Vector, b: Vector) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
};

const normalize = (vector: Vector) => {
  const len = length(vector);

  if (len === 0) {
    vector.x = 1;
    vector.y = 0;
  } else {
    divideScalar(vector, len);
  }
  return vector;
};

export default {
  getLeftVector,
  getRightVector,
  getUpVector,
  getDownVector,
  add,
  addScalar,
  subtract,
  subtractScalar,
  multiply,
  multiplyScalar,
  divide,
  divideScalar,
  negate,
  clamp,
  dot,
  cross,
  projectOnto,
  projectLengthOnto,
  getAngle,
  rotate,
  rotateTo,
  rotateBy,
  setLength,
  length,
  lengthSq,
  distance,
  distanceSq,
  normalize,
};
