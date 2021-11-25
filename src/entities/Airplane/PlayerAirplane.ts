import { input } from "../../input";
import { stage } from "../../main";
import { AnimatedSprite, Texture } from "pixi.js";
import { UP } from "../../utils/math";
import { Vector2D } from "../../utils/Vector";
import { AirplaneParams, Airplane, updateAirplane } from ".";
import { attemptToFire } from "../../entities/Weapon"

/** Parameter values of the player. */
export const playerParams: AirplaneParams = {
  angularAcceleration: 2,
  angularDeceleration: 5,
  maxAngularSpeed: .8,
  acceleration: 800,
  maxSpeed: 300,
  deceleration: 250,
  fullHealth: 100,
  damageOnImpact: 50,
}

/** Adds the player airplane to the scene. */
export function addPlayerAirplane() {
    /* init sprite */{
    playerAirplane.sprite = new AnimatedSprite([Texture.from('falcon')]);
    playerAirplane.sprite.loop = true;
    playerAirplane.sprite.play();
    playerAirplane.sprite.anchor.set(0.5, 0.5);
  }
  stage.addChild(playerAirplane.sprite!);
}

/** Updates the player airplane each frame. */
export function updatePlayerAirplane(dt: number) {
  /* compute rotation sign */
  let rotationSign; {
    rotationSign = 0
    if (input.turnClockwise) rotationSign += 1;
    if (input.turnCounterclockwise) rotationSign -= 1;
  }
  /* fire bullets */ {
    if (input.fire) attemptToFire(playerAirplane, false);
  }
  updateAirplane(playerAirplane, playerParams, rotationSign, dt);
}

/** Player instance. */
export const playerAirplane: Airplane = {
  position: new Vector2D(),
  angularSpeed: 0,
  rotation: UP,
  velocity: new Vector2D().setToUp().multiplyScalar(playerParams.maxSpeed),
  lastBulletTimestamp: 0,
  health: 100,
};
