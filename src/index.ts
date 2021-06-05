import * as pixi from "pixi.js";
import { AnimatedSprite, Loader, Sprite, Texture } from "pixi.js";
import "./style.css";

const resolution = {
  width: 1920,
  height: 1080,
};

const app = new pixi.Application({
  backgroundColor: 0x63ace8,
  width: resolution.width,
  height: resolution.height,
  antialias: false,
});

const sprites: { plane?: AnimatedSprite } = {};

window.onload = async (): Promise<void> => {
  document.body.appendChild(app.view);
  updateCanvasSize();
  await loadGameAssets();

  app.stage.addChild(sprites.plane!);
};

function updateCanvasSize(): void {
  const handleResize = () => {
    const heightRatio = window.innerHeight / resolution.height;
    const widthRatio = window.innerWidth / resolution.width;
    const scale = Math.min(heightRatio, widthRatio);
    app.renderer.resize(resolution.width * scale, resolution.height * scale);
    app.stage.scale.x = scale;
    app.stage.scale.y = scale;
  };
  handleResize();
  window.addEventListener("resize", handleResize);

}

async function loadGameAssets(): Promise<void> {
  return new Promise((res, rej) => {
    const loader = Loader.shared;
    const atlasMapPath = "./assets/atlasMap.json";
    loader.add(atlasMapPath);

    loader.onComplete.once(() => {
      res();
    });

    loader.onError.once(() => {
      rej();
    });

    loader.load(() => {
      const texture = loader.resources[`${atlasMapPath}_image`].texture;
      if (texture) {
        texture.baseTexture.scaleMode = pixi.SCALE_MODES.NEAREST;
      }
      const plane = new AnimatedSprite([Texture.from("plane")]);
      plane.loop = true;
      plane.animationSpeed = 0.1;
      plane.play();
      plane.scale.set(5);
      plane.anchor.set(0.5, 0.5);
      plane.position.set(resolution.width / 2, resolution.height / 2);
      sprites.plane = plane;
    });
  });
}

