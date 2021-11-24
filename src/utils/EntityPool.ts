// This file contains the implementation of the EntityPool<T> class

/**
Generic pool to allow for recycling game entities
to avoid unnecessary memory garbage generation.

Iteration over the pool is implemented on a very specific
way for performance reason. Notice there could only
be one iteration over the pool at a given time.

The following is an example of how to iterate and free
elements in the pool.

@example
const bulletPool = nwe EntityPool<Bullet>();

//iterate over the pool
bulletPool.startIteration();
let bullet: Bullet | null;
while(bullet = bulletPool.next()) {
  if (isBulletOutsideScreen(bullet)) bulletPool.freeCurrent();
}
*/
export class EntityPool<T> {
  /**
  Internal array to store the entities.
  The first `count` bullets are active
  (i.e. currently used in the game scene),
  the rest are inactive.
  */
  private readonly _pool: T[] = [];
  /** Current number of active entities*/
  private _count = 0;
  /** Index of the current item in the current iteration over the pool*/
  private _index = -1;
  /** Function to create new entities as needed*/
  private readonly _createNewEntity: () => T;

  /**
  Creates and initializes a new instance of the EntityPool class.
  @param createNewEntity Function to create a new entities as needed.
  */
  constructor(createNewEntity: () => T) {
    this._createNewEntity = createNewEntity;
  }

  /**
  Gets an entity, either from the pool if available
  or from the provided constructor if the pool has no
  inactive entities to recycle.
  @returns A recycled or new entity.
  */
  get() {
    if (this._pool.length === this.activeCount) {
      this._pool.push(this._createNewEntity());
    }
    return this._pool[this._count++];
  }

  /**
  @returns The total number of allocated entities,
  i.e. the internal size of the pool.
  */
  get totalLength() {
    return this._pool.length;
  }

  /**
  @returns The number of active entities in the pool.
  */
  get activeCount() {
    return this._count;
  }

  /**
  Frees all the entities in the pool.
  The `totalLength` of the pool remains the same, but the `activeCount` is reset to 0.
  */
  freeAll() {
    this._count = 0;
  }

  /**
  Starts a new iteration over the active entities in the pool.

  See the `EntityPool<T>` class documentation for an explanation
  on how to iterate over the pool.
  */
  startIteration() {
    this._index = -1;
  }

  /**
  Gets the next item of active item in the pool or `null` if the end of the pool was reached.

  See the `EntityPool<T>` class documentation for an explanation
  on how to iterate over the pool.

  @return The next item of active item in the pool or `null` if the end of the pool was reached..
  */
  next() {
    if(++this._index === this._count)
      return null;
    return this._pool[this._index];
  }

  /**
  Frees the entity returned by the last call to `next`.
  If `next` hasn't been call in the current iteration or
  the last call returned `null`, calling `freeCurrent`
  would have no effect.

  See the `EntityPool<T>` class documentation for an explanation
  on how to iterate over the pool.
  */
  freeCurrent() {
    if(this._index < 0  || this._index === this.activeCount) return;
    const aux = this._pool[this.activeCount-1];
    this._pool[this.activeCount-1] = this._pool[this._index];
    this._pool[this._index] = aux;
    this._count--;
  }
}
