// This file contains an implementation of a Vector2D class

import { ObservablePoint } from "@pixi/math";
import { almostEqual, EPSILON } from "../math";
import { VectorPool } from "./VectorPool"

/**
2d Vector class with support for vector operations.

The class is designed with memory efficiency in mind,
to avoid polluting the heap with vector instances.
For this reason the only method that creates a new
vector instance is the constructor and all the
changes occur in place, i.e. the `this` vector is
modified instead of creating a new instance for each
operation.

All methods return the modified vector to allow for
chaining.

For the methods that need the creation of auxiliary
vectors, the class uses an instance of the VectorPool
class that should be cleared on every iteration of
the main loop.
*/
export class Vector2D {
  /** `x` component of the vector.*/
  x: number;
  /** `y` component of the vector.*/
  y: number;

  /** Creates and initialize and instance of the vector class.*/
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
  Set the values of the
  fields `x` and `y` of `this` vector.
  @returns the modified `this` vector.
  */
  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
  Copy the values of the fields `x` and `y` from another vector.
  of `this` vector from another vector.
  @params The vector to copy from.
  @returns The modified `this` vector.
  */
  copy(vector: Vector2D) {
    this.x = vector.x;
    this.y = vector.y;
    return this;
  }

  /**
  Checks whether two vectors are almost equal i.e. within a given epsilon.
  @param vector The other vector tho compare to.
  @param epsilon The value of epsilon to use for the comparison.
  @returns Whether the vectors are almost equal or not.
  */
  almostEqual(vector: Vector2D, epsilon = EPSILON) {
    return (
      almostEqual(this.x, vector.x, epsilon) &&
      almostEqual(this.y, vector.y, epsilon)
    );
  }

  /**
  Copies the `x` and `y` fields to an ObservablePoint.
  @argument vector The vector to copy from.
  @argument point The point to copy to.
  @returns The modified ObservablePoint.
  */
  toObservablePoint(point: ObservablePoint) {
    return point.set(this.x, this.y);
  }

  /**
  Copies the `x` and `y` fields from an ObservablePoint.
  @argument vector The vector to copy from.
  @argument point The point to copy to.
  @returns The modified point.
  */
  fromObservablePoint(point: ObservablePoint) {
    this.x = point.x;
    this.y = point.y;
    return this;
  }

  /**
  Modifies `this` vector to be the unit size vector pointing to the given angle.
  @argument angle the angle in radians to point `this` vector at.
  @returns the modified `this` vector.
  */
  fromAngle(angle: number) {
    this.x = Math.cos(angle);
    this.y = Math.sin(angle);
    return this;
  }

  /**
  Sets `x` and `y` of `this` vector to make it a unit vector pointing to the left.
  @returns the modified `this` vector set to (-1, 0).
  */
  setToLeft() {
    return this.set(-1, 0);
  }

  /**
  Sets `x` and `y` of `this` vector  to make it a unit vector pointing to the right.
  @returns the modified `this` vector set to (1, 0).
  */
  setToRight() {
    return this.set(1, 0);
  }

  /**
  Sets `x` and `y` of `this` vector  to make it a unit vector pointing upwards.

  @returns the modified `this` vector set to (0, -1). Notice the Y axis points down in 2D.
  */
  setToUp() {
    return this.set(0, -1);
  }

  /**
  Sets `x` and `y` of `this` vector  to make it a unit vector pointing downwards.
  @returns the modified `this` vector set to (0, -1). Notice the Y axis points down in 2D.
  */
  setToDown() {
    return this.set(0, 1);
  }

  /**
  Adds another vector to `this`. `this` vector is modified and returned.
  @param vector The vector to add.
  @returns `this` vector modified by the operation.
  */
  add(vector: Vector2D) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  /**
  Adds a scalar to `this`. `this` vector is modified and returned.
  @param scalar The scalar to add.
  @returns `this` vector modified by the operation.
  */
  addScalar(scalar: number) {
    this.x += scalar;
    this.y += scalar;
    return this;
  }

  /**
  Subtracts another vector to `this`. `this` vector is modified and returned.
  @param vector The vector to subtract.
  @returns `this` vector modified by the operation.
  */
  subtract(vector: Vector2D) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  /**
  Subtracts a scalar to `this`. `this` vector is modified and returned.
  @param scalar The scalar to subtract.
  @returns `this` vector modified by the operation.
  */
  subtractScalar(scalar: number) {
    this.x -= scalar;
    this.y -= scalar;
    return this;
  }

  /**
  Multiplies a scalar to `this`. `this` vector is modified and returned.
  @param scalar The scalar to multiply.
  @returns `this` vector modified by the operation.
  */
  multiplyScalar(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
  Multiplies a scalar to `this`. `this` vector is modified and returned.
  If scalar is `0`, sets `x` and `y` to `0`
  @param scalar The scalar to divide.
  @returns `this` vector modified by the operation.
  */
  divideScalar(scalar: number) {
    if (scalar !== 0) {
      this.x /= scalar;
      this.y /= scalar;
    } else {
      this.x = 0;
      this.y = 0;
    }
    return this;
  }

  /**
  Negates `this` vector by negating `x` and `y`.
  @returns The negated `this` vector.
  */
  negate() {
    this.multiplyScalar(-1);
  }

  /**
  Clamps `this` vector to a maximum length.
  @param maxLength
  @returns The clamped `this` vector.
  */
  clamp(maxLength: number) {
    if (this.length() > maxLength) {
      this.normalize();
      this.multiplyScalar(maxLength);
    }
    return this;
  }

  /**
  Multiplies `this` vector by another using the *dot* product.
  @param vector the vector to multiply.
  @returns The value of the *dot* product.
  */
  dot(vector: Vector2D) {
    return this.x * vector.x + this.y * vector.y;
  }

  /**
  Multiplies `this` vector by another using the *cross* product.
  @param vector the vector to multiply.
  @returns The value of the *cross* product.
  */
  cross(vector: Vector2D) {
    return this.x * vector.y - this.y * vector.x;
  }

  /**
  Returns the angle of the vector in radians.
  If the vector has no length returns 0.
  @returns The angle of the vector.
  */
  angle() {
    return Math.atan2(this.y, this.x);
  }

  /**
  Returns the angle to the given vector, in radians.
  @param vector The other vector.
  @returns The angle to the vector.
  */
  angleTo(vector: Vector2D) {
    return Math.atan2(this.cross(vector), this.dot(vector));
  }

  /**
  Returns the angle between the line connecting the two
  points and the X axis, in radians.
  @param point The other point.
  @returns The computed angle.
  */
  angleToPoint(point: Vector2D) {
    return Math.atan2(this.y - point.y, this.x - point.x);
  }

  /**
  Rotates `this` vector by a given angle.
  @param angle angle to use for the rotation.
  @return The rotated `this` vector.
  */
  rotate(angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return this.set(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  /**
  Rotates `this` vector to a given angle.
  @param angle angle to rotate to.
  @return The rotated `this` vector.
  */
  rotateTo(rotation: number) {
    return this.rotate(rotation - this.angle());
  }

  /**
  Sets the length of `this` vector to a given value.
  If the vector has no length assumes and angle of 0 degrees.
  @param length Then new length of the vector
  @returns The modified `this` vector with the new length.
  */
  setLength(length: number) {
    const angle = this.angle();
    this.x = Math.cos(angle) * length;
    this.y = Math.sin(angle) * length;
  }

  /**
  Gets the length of the vector.
  @returns The length of the vector.
  */
  length() {
    return Math.sqrt(this.lengthSq());
  }

  /**
  Gets the squared length of the vector.
  @returns The squared length of the vector.
  */
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }

  /**
  Computes the distance from `this` vector to another.
  @param vector the other vector.
  @returns The distance between the two vectors.
  */
  distance(vector: Vector2D) {
    return Math.sqrt(this.distanceSq(vector));
  }

  /**
  Computes the squared distance from `this` vector to another.
  @param vector the other vector.
  @returns The distance between the two vectors.
  */
  distanceSq(vector: Vector2D) {
    const dx = this.x - vector.x;
    const dy = this.y - vector.y;
    return dx * dx + dy * dy;
  }

  /**
  Sets the length of `this` the vector to 1. If the length of
  the vector is 0, no modification takes place
  @returns The normalized `this` vector.
  */
  normalize() {
    const length = this.length();

    if (length !== 0) {
      this.divideScalar(length);
    }
    return this;
  }

  /**
  Checks if the vector is normalized, i.e. it's lengths equals 1.
  @param epsilon The value of epsilon to use for the comparison.
  @returns Wether or not the `this` vector is normalized.
  */
  isNormalize(epsilon = EPSILON) {
    return almostEqual(this.length(), 1, epsilon);
  }

  /**
  Modifies `this` vector to be the normalized vector pointing from
  `this` vector to the other.
  @param vector The other vector.
  @return The modified `this` vector.
  */
  directionTo(vector: Vector2D) {
    return this.copy(
      vectorPool.getCopy(vector).subtract(this).normalize()
    )
  }

  /**
  Modifies `this` vector to be the vector reflected from
  a plane defined by the given normal. The normal doesn't have
  to be normalized.
  @param normal The normal that defines the reflection plane.
  It doesn't have to be normalized.
  @returns The modified `this` vector.
  */
  reflect(normal: Vector2D) {
    const normalizedNormal = vectorPool.getCopy(normal).normalize();
    return this.copy(
      normalizedNormal.
        multiplyScalar(2 * this.dot(normalizedNormal))
        .subtract(this));
  }

  /**
  Modifies `this` vector to be the vector "bounced off" from
  a plane defined by the given normal.
  @param normal The normal that defines the reflection plane.
  It doesn't have to be normalized.
  @returns The modified `this` vector.
  */
  bounce(normal: Vector2D) {
    this.reflect(normal).negate();
  }

  /**
  Returns the result of the linear interpolation between
  `this` vector and another by amount `weight`. `weight` is on the range of 0.0 to 1.0,
  representing the amount of interpolation.
  @param vector The other vector.
  @param weight The interpolation weight.
  @result The modified `this` vector.
  */
  lerp(vector: Vector2D, weight: number) {
    return this.set(
      this.x + (weight * (vector.x - this.x)),
      this.y + (weight * (vector.y - this.y))
    );
  }

  /**
  Moves `this` vector toward another by the fixed `delta` amount.
  @param vector The other vector.
  @param delta The amount to move `this` vector by.
  @result The modified `this` vector.
  */
  moveToward(vector: Vector2D, delta: number) {
    const distanceVector = vectorPool.getCopy(vector).subtract(this);

    if (distanceVector.length() < delta)
      return this.copy(vector);

    return this.add(
      distanceVector.normalize().multiplyScalar(delta)
    );
  }

  /**
  Project this vector onto another.
  @param vector The other vector.
  @return The modified `this` vector.
  */
  project(vector: Vector2D) {
    return this.copy(
      vectorPool.getCopy(vector).multiplyScalar(this.dot(vector) / vector.lengthSq())
    );
  }

  /**
  Modifies `this` vector to be perpendicular vector (rotated 90 degrees counter-clockwise)
  compared to the original, with the same length.
  @return The modified `this` vector
  */
  orthogonal() {
    return this.set(this.y, -this.x);
  }
}

/** Global vector pool to manage the memory allocation of vectors*/
export const vectorPool = new VectorPool(10);



