/** 2d Vector class with support for vector operations */
export class Vector {
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
  Creates a new vector with the same `x` and `y` components as `this.`
  @return The cloned vector.
  */
  clone() {
    return new Vector(this.x, this.y);
  }

  /**
  Utility function to conveniently set the values of the fields `x` and `y` of `this` vector.
  @returns the modified `this` vector.
  */
  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
  Utility function to conveniently set the values of the fields `x` and `y`
  of `this` vector from another vector.
  @params The vector to copy from.
  @returns The modified `this` vector.
  */
  copyFrom(vector: Vector) {
    this.x = vector.x;
    this.y = vector.y;
    return this;
  }

  /**
  Sets `x` and `y` of `this` vector to make it a unit vector pointing to the left.
  @returns the modified `this` vector.
  */
  setToLeft() {
    return this.set(-1, 0);
  }

  /**
  Sets `x` and `y` of `this` vector  to make it a unit vector pointing to the right.
  @returns the modified `this` vector.
  */
  setToRight() {
    return this.set(1, 0);
  }

  /**
  Sets `x` and `y` of `this` vector  to make it a unit vector pointing upwards.
  @returns the modified `this` vector.
  */
  setToUp() {
    return this.set(0, 1);
  }

  /**
  Sets `x` and `y` of `this` vector  to make it a unit vector pointing downwards.
  @returns the modified `this` vector.
  */
  setToDown() {
    return this.set(0, -1);
  }

  /**
  Adds another vector to `this`. `this` vector is modified and returned.
  @param vector The vector to add.
  @returns `this` vector modified by the operation.
  */
  add(vector: Vector) {
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
  subtract(vector: Vector) {
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
  Multiplies another vector to `this`. `this` vector is modified and returned.
  @param vector The vector to multiply.
  @returns `this` vector modified by the operation.
  */
  multiply(vector: Vector) {
    this.x *= vector.x;
    this.y *= vector.y;
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
  Multiplies another vector to `this`. `this` vector is modified and returned.
  @param vector The vector to divide.
  @returns `this` vector modified by the operation.
  */
  divide(vector: Vector) {
    this.x /= vector.x;
    this.y /= vector.y;
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
    this.x = -this.x;
    this.y = -this.y;
    return this;
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
  Multiplies `this` vector by another using the *dot* product. The result is stored in `this` vector.
  @param vector the vector to multiply.
  @returns The modified `this` vector.
  */
  dot(vector: Vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  /**
  Multiplies `this` vector by another using the *cross* product. The result is stored in `this` vector.
  @param vector the vector to multiply.
  @returns The modified `this` vector.
  */
  cross(vector: Vector) {
    return this.x * vector.y - this.y * vector.x;
  }

  /**
  Returns the angle of the vector in radians.
  @returns The angle of the vector.
  */
  getAngle() {
    return Math.atan2(this.y, this.x);
  }

  /**
  Rotates `this` vector by a given angle.
  @param angle angle to use for the rotation.
  @return The rotated `this` vector.
  */
  rotate(angle: number) {
    const newX = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    const newY = this.x * Math.sin(angle) + this.y * Math.cos(angle);

    this.x = newX;
    this.y = newY;
    return this;
  }

  /**
  Rotates `this` vector to a given angle.
  @param angle angle to rotate to.
  @return The rotated `this` vector.
  */
  rotateTo(rotation: number) {
    return this.rotate(rotation - this.getAngle());
  }

  /**
  Sets the length of `this` vector to a given value.
  @param length Then new length of the vector
  @returns The modified `this` vector with the new length.
  */
  setLength(length: number) {
    const angle = this.getAngle();
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
  distance(vector: Vector) {
    return Math.sqrt(this.distanceSq(vector));
  }

  /**
  Computes the squared distance from `this` vector to another.
  @param vector the other vector.
  @returns The distance between the two vectors.
  */
  distanceSq(vector: Vector) {
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
}
