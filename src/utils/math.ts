
/** Represents 180 degrees in radians. */
export const PI = Math.PI;

/** Represents 360 degrees in radians. TAU = 2 * PI. */
export const TAU = 2 * PI;

/** Angle pointing to the right in radians. */
export const RIGHT = 0;

/** Angle pointing down in radians. */
export const DOWN = PI / 2;

/** Angle pointing to the left in radians. */
export const LEFT = PI;

/** Epsilon value to compare for approximate equality. */
export const EPSILON = 0.00001;

/** Angle pointing up in radians. */
export const UP = -PI / 2;

/** Converts radians to degrees. */
export const radiansToDegrees = (radians: number) => {
  return (radians * 180) / PI;
};

/** Converts degrees to radians. */
export const degreesToRadians = (degrees: number) => {
  return (degrees * PI) / 180;
};

/** Checks whether two numbers are almost equal i.e. within a given epsilon. */
export const almostEqual = (a: number, b: number, epsilon = EPSILON) => {
  return Math.abs(a - b) < epsilon;
};


