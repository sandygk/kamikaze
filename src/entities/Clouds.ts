import { Sprite, Texture } from "pixi.js";
import { resolution, stage } from "../main";

/**Handle the logic for the background clouds.*/
export class Cloud {
  /** Adds the clouds to the scene. */
  static spawnAll() {
    for (let i = 0; i < 20000; i++) {
      const cloudIndex = Math.floor(Math.random() * 6);
      const cloud = new Sprite(Texture.from(`cloud-${cloudIndex}`));
      cloud.position.set(
        (Math.random() - 0.5) * resolution.height * 80,
        (Math.random() - 0.5) * resolution.width * 80
      );
      stage.addChild(cloud);
    }
  }
}


