import { Input } from "../../Input";
import { Game } from "../../Game";
import { AnimatedSprite, Texture } from "pixi.js";
import { UP } from "../../utils/math";
import { Airplane, AirplaneParams } from ".";
import { Weapon } from "../Weapon";
import { PassThrough } from "stream";

export class PlayerAirplane extends Airplane {
  /** Parameters for the player airplanes */
  static readonly params: AirplaneParams = {
    angularAcceleration: 2,
    angularDeceleration: 5,
    maxAngularSpeed: .8,
    acceleration: 800,
    maxSpeed: 300,
    deceleration: 250,
    fullHealth: 100,
    damageOnImpact: 50,
    isEnemyAirplane: false,
  };
  /** Parameters for the player airplanes */
  readonly params = PlayerAirplane.params;

  /** Inits the player airplane and adds it to the scene. */
  spawn() {
    this.rotation = UP;
    this.velocity.setToUp().multiplyScalar(this.params.maxSpeed);
    this.health = 100;
    this.weapon = new Weapon(this);

    /* init sprite */{
      this.sprite = new AnimatedSprite([Texture.from('falcon')]);
      this.sprite.loop = true;
      this.sprite.play();
      this.sprite.anchor.set(0.5, 0.5);
    }
    Game.stage.addChild(this.sprite!);
  }

  /** Handles the logic when the player airplane is dies. */
  free() {
    console.log("game over")
  }

  /** Updates the player airplane each frame. */
  update() {
    /* compute rotation sign */
    let rotationSign; {
      rotationSign = 0
      if (Input.turnClockwise) rotationSign += 1;
      if (Input.turnCounterclockwise) rotationSign -= 1;
    }
    if (Input.fire) this.weapon!.attemptToFire();
    this.move(rotationSign);
  }
}

/** Player airplane instance */
export const playerAirplane = new PlayerAirplane();
