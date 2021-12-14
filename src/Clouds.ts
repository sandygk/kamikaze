import { Sprite, Texture } from "pixi.js";
import { Game } from "./Game";

/**Handle the logic for the background clouds.*/
export class Cloud {
  /** Adds the clouds to the scene. */
  static spawnAll() {
    for (let i = 0; i < 20000; i++) {
      const cloudIndex = Math.floor(Math.random() * 6);
      const cloud = new Sprite(Texture.from(`cloud-${cloudIndex}`));
      cloud.position.set(
        (Math.random() - 0.5) * Game.resolution.height * 80,
        (Math.random() - 0.5) * Game.resolution.width * 80
      );
      Game.stage.addChild(cloud);
    }
  }
}


