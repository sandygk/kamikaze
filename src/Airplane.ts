import { AnimatedSprite } from "pixi.js";
import { Game } from "./Game";
import { TAU } from "./utils/math";
import { Vector2D, vectorPool } from "./utils/Vector";
import { Weapon } from "./Weapon";

/** Parameters of an airplane */
export type AirplaneParams = {
  /** Angular acceleration. */
  angularAcceleration: number,
  /** Angular deceleration. */
  angularDeceleration: number,
  /** Maximum angular speed. */
  maxAngularSpeed: number,

  /** Acceleration.*/
  acceleration: number,
  /** Max speed. */
  maxSpeed: number,
  /** Deceleration force to simulate drag. */
  deceleration: number,

  /** Full health amount. */
  fullHealth: number,

  /** Whether the airplane is an enemy airplane or not*/
  isEnemyAirplane: boolean;
}

/** Airplane entity. */
export abstract class Airplane {
  /** Speed at which the airplane is rotating. */
  angularSpeed = 0;
  /** Angle of rotation of the airplane. */
  rotation = 0;
  /** The velocity at which the airplane is moving. */
  readonly velocity = new Vector2D();
  /** The position of the airplane. */
  readonly position = new Vector2D();
  /** The sprite of the airplane. */
  sprite?: AnimatedSprite;
  /** Time stamp of the last bullet shot by the airplane. */
  lastBulletTimestamp = 0;
  /** Current health of the airplane. */
  health = 0;
  /** The airplane weapon. */
  weapon?: Weapon;

  /** Parameters that define a set of airplanes*/
  abstract params: AirplaneParams;


  receiveDamage(damage: number) {
    this.health = Math.min(0, this.health - damage);
    if (this.health === 0)
      this.free();
  }

  abstract free(): void;

  /**
  Updates the rotation, position and sprite of the given airplane.
  @param rotationSign The sign of the rotation, `0` to not rotate,
  `> 0` to rotate clockwise, and `< 0` to rotate counterclockwise.
  */
  move(rotationSign: number) {
    /* update rotation */ {
      /* accelerate/decelerate rotation */ {
        if (rotationSign) {
          this.angularSpeed += rotationSign * this.params.angularAcceleration * Game.dt;
        }
        else {
          const deltaRotationSpeed = Math.sign(this.angularSpeed) * this.params.angularDeceleration * Game.dt;
          if (Math.abs(this.angularSpeed) < deltaRotationSpeed) this.angularSpeed = 0;
          else this.angularSpeed -= deltaRotationSpeed;
        }
      }
      /* clamp angular speed */ {
        if (Math.abs(this.angularSpeed) > this.params.maxAngularSpeed)
          this.angularSpeed = Math.sign(this.angularSpeed) * this.params.maxAngularSpeed;
      }
      /* update rotation*/ {
        this.rotation += this.angularSpeed * Game.dt * TAU;
      }
    }
    /* update position */ {
      /* decelerate (apply drag force) */ {
        const deltaVelocity = this.params.deceleration * Game.dt;
        if (Math.abs(this.velocity.x) <= deltaVelocity) this.velocity.x = 0;
        else this.velocity.x += -Math.sign(this.velocity.x) * deltaVelocity;
        if (Math.abs(this.velocity.y) <= deltaVelocity) this.velocity.y = 0;
        else this.velocity.y += -Math.sign(this.velocity.y) * deltaVelocity;
      }

      /* accelerate (apply engine force)*/ {
        const deltaVelocity = vectorPool
          .fromAngle(this.rotation)
          .multiplyScalar(this.params.acceleration * Game.dt)

        this.velocity
          .add(deltaVelocity)
          .clamp(this.params.maxSpeed)
      }

      /* update position */ {
        const displacement = vectorPool
          .copy(this.velocity)
          .multiplyScalar(Game.dt)
        this.position.add(displacement);
      }
    }
    /* update sprite */ {
      this.sprite!.rotation = this.rotation;
      this.sprite!.position.set(this.position.x, this.position.y);
    }
  }
}


