import { Sprite, Texture } from "pixi.js";
import { dt, stage } from "../../main";
import { EntityPool } from "../../utils/EntityPool";
import { Vector2D, vectorPool } from "../../utils/Vector";
import { Airplane } from "../Airplane";
import { EnemyAirplane } from "../Airplane/EnemyAirplane";
import { playerAirplane } from "../Airplane/PlayerAirplane";
import { Collisions } from "../../Collisions";

/** Parameters of a bullet. */
export type BulletParams = {
  /** The speed at which the bullet moves. */
  speed: number,
  /** Amount of damage bullet cause on impact. */
  damageOnImpact: number,
  /** Name of the bullet sprite. */
  spriteName: string,
  /** Is this an enemy or a player bullet. */
  isEnemyBullet: boolean,
}

/** Bullet entity. */
export class Bullet {
  /** Life span in milliseconds of a bullet. */
  static readonly lifeSpan = 4000;
  /** The radius of a bullet*/
  static radius = 10;
  /** Pool to manage the memory of the bullet entities. */
  static pool = new EntityPool<Bullet>(() => new Bullet());
  /** Parameters of the enemy bullets. */
  static enemyParams: BulletParams = {
    speed: 450,
    damageOnImpact: 50,
    spriteName: 'round-fire-with-border',
    isEnemyBullet: true,
  }
  /** Parameters of the enemy bullets. */
  static playerParams = {
    speed: 700,
    damageOnImpact: 50,
    spriteName: 'round-fire-no-border',
    isEnemyBullet: false,
  }

  /** Direction in which the bullet is moving. */
  direction = 0;
  /** Position of the bullet. */
  position = new Vector2D();
  /** Sprite used to render the bullet. */
  sprite: Sprite = new Sprite();
  /** Amount of damage the bullet causes on impact. */
  damageOnImpact = 0;
  /** Params for the given type of bullet. */
  params?: BulletParams;
  /** Timestamp when the bullet was spawned. */
  creationTimestamp = 0;

  /** Initializes an instance of the Bullet class*/
  constructor() {
    this.sprite.anchor.set(0.5, 0.5);
  }

  /**
  Init and adds the bullet to the scene.
  @param position The position where the bullet should be spawned.
  @param direction The direction of the bullet.
  @param isEnemyBullet Whether the bullet is an enemy's or a player's bullet.
  */
  static spawn(position: Vector2D, direction: number, isEnemyBullet: boolean) {
    const bulletParams = isEnemyBullet ? Bullet.enemyParams : Bullet.playerParams;
    const bullet = Bullet.pool.get();

    bullet.direction = direction;
    bullet.position.copy(position);
    bullet.sprite.texture = Texture.from(bulletParams.spriteName);
    bullet.params = bulletParams;
    bullet.creationTimestamp = Date.now();

    stage.addChild(bullet.sprite);
  }

  /**
  Frees and remove the bullet from the scene.
  It must be called only when iterating the bullet pool
  since it frees the current bullet in the iteration
  */
  free() {
    Bullet.pool.freeCurrent();
    stage.removeChild(this.sprite);
  }

  /** Updates the bullets each frame. */
  static updateAll() {
    Bullet.pool.startIteration();
    let bullet: Bullet | null;
    while (bullet = Bullet.pool.next()) {
      /* update position */ {
        const displacement = vectorPool
          .fromAngle(bullet.direction)
          .multiplyScalar(dt * bullet.params!.speed);
        bullet.position.add(displacement);
      }

      /* update sprite */ {
        bullet.sprite.rotation = bullet.direction;
        bullet.sprite.position.set(bullet.position.x, bullet.position.y);
      }
      /* remove expired bullets */ {
        if (Date.now() - bullet.creationTimestamp > Bullet.lifeSpan) {
          bullet.free();
          continue;
        }
      }
      /* check collision */ {
        if (bullet.params!.isEnemyBullet &&
          Collisions.bulletAirplane(bullet, playerAirplane)) {
          continue;
        }
        else if (!bullet.params!.isEnemyBullet) {
          let collisionFound = false;
          EnemyAirplane.pool.startIteration()
          let enemyAirplane: Airplane | null;
          while (enemyAirplane = EnemyAirplane.pool.next()) {
            if (Collisions.bulletAirplane(bullet, enemyAirplane)) {
              collisionFound = true;
              break;
            }
          }
          if (collisionFound)
            continue;
        }
      }
    }
  }
}


