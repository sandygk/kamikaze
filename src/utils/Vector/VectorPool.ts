// This file contains an implementation of a TickPool class

import { Vector2D } from "./";

/**
Pool to manage the memory for vectors that are frequently
allocated and can be released on every tick of the main
game loop.

On every iteration (or tick) of the main loop,
the pool should be cleared by calling the `clear` method
to free the vectors of the pool to be reused on the
next iteration.
*/
export class VectorPool {
  /** Internal array to store the pool elements */
  private _pool: Vector2D[];
  /** Current number of active vectors */
  private _count = 0;

  /**
  Creates an instance of the VectorPool` class.
  @param initialPoolSize The initial internal size of the pool.
  */
  constructor(initialPoolSize = 0) {
    this._pool = new Array<Vector2D>(initialPoolSize);
    for (let i = 0; i < initialPoolSize; i++) {
      this._pool[i] = new Vector2D();
    }
  }

  /**
  @returns The total number of allocated vectors
  i.e. the internal size of the pool.
  */
  get size() {
    return this._pool.length
  }

  /**
  @returns The number of active vectors in the pool
  */
  get count() {
    return this._count
  }

  /**
  Gets a newly active vector to be used.
  The method only allocate new vectors when there are no inactive
  ones in the pool.
  @returns The newly active vector.
  */
  new(x = 0, y = 0) {
    this._count++
    if (this.size < this.count) {
      this._pool.push(new Vector2D());
    }
    return this._pool[this.count - 1].set(x, y);
  }

  /**
  Gets a newly active vector to be used initialized as a copy of
  the given vector.

  The method only allocates new vectors when there are no inactive
  ones in the pool.
  @returns The newly active vector.
  */
  copy(vector: Vector2D) {
    return this.new().copy(vector);
  }

  /**
  Clear the entire pool. The `size` of the pool remains the same
  but the `count` is reset to 0.
  */
  clear() {
    this._count = 0;
  }
}
