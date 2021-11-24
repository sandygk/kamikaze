import { AnimatedSprite } from "pixi.js";
import { TAU } from "../../utils/math";
import { Vector2D, vectorPool } from "../../utils/Vector";

/** Airplane entity. */
export class Airplane {
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
}

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
  /** Amount of damage the airplane causes on impact. */
  damageOnImpact: number,
}

/**
Updates the rotation, position and sprite of the given airplane.
@param airplane The airplane to update.
@param params The airplane parameters to use.
@param rotationSign The sign of the rotation, `0` to not rotate,
`> 0` to rotate clockwise, and `< 0` to rotate counterclockwise.
@param dt The delta time from the previous tick of the main loop.
*/
export function updateAirplane(airplane: Airplane, params: AirplaneParams, rotationSign: number, dt: number) {
  /* update rotation */ {
    /* accelerate/decelerate rotation */ {
      if (rotationSign) {
        airplane.angularSpeed += rotationSign * params.angularAcceleration * dt;
      }
      else {
        const deltaRotationSpeed = Math.sign(airplane.angularSpeed) * params.angularDeceleration * dt;
        if (Math.abs(airplane.angularSpeed) < deltaRotationSpeed) airplane.angularSpeed = 0;
        else airplane.angularSpeed -= deltaRotationSpeed;
      }
    }
    /* clamp angular speed */ {
      if (Math.abs(airplane.angularSpeed) > params.maxAngularSpeed)
        airplane.angularSpeed = Math.sign(airplane.angularSpeed) * params.maxAngularSpeed;
    }
    /* update rotation*/ {
      airplane.rotation += airplane.angularSpeed * dt * TAU;
    }
  }
  /* update position */ {
    /* decelerate (apply drag force) */ {
      const deltaVelocity = params.deceleration * dt;
      if (Math.abs(airplane.velocity.x) <= deltaVelocity) airplane.velocity.x = 0;
      else airplane.velocity.x += -Math.sign(airplane.velocity.x) * deltaVelocity;
      if (Math.abs(airplane.velocity.y) <= deltaVelocity) airplane.velocity.y = 0;
      else airplane.velocity.y += -Math.sign(airplane.velocity.y) * deltaVelocity;
    }

    /* accelerate (apply engine force)*/ {
      const deltaVelocity = vectorPool
        .fromAngle(airplane.rotation)
        .multiplyScalar(params.acceleration * dt)

      airplane.velocity
        .add(deltaVelocity)
        .clamp(params.maxSpeed)
    }

    /* update position */ {
      const displacement = vectorPool
        .copy(airplane.velocity)
        .multiplyScalar(dt)
      airplane.position.add(displacement);
    }
  }
  /* update sprite */ {
    airplane.sprite!.rotation = airplane.rotation;
    airplane.sprite!.position.set(airplane.position.x, airplane.position.y);
  }
}

