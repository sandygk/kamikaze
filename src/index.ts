import * as pixi from "pixi.js";
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

const stage = app.stage;

window.onload = async (): Promise<void> => {
  await loadGameAssets();

  document.body.appendChild(app.view);

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const birdFromSprite = getBird();
  birdFromSprite.anchor.set(0.5, 0.5);
  birdFromSprite.position.set(resolution.width / 2, resolution.height / 2);
  stage.addChild(birdFromSprite);
};

async function loadGameAssets(): Promise<void> {
  return new Promise((res, rej) => {
    const loader = pixi.Loader.shared;
    const resourceName = "sprites"
    loader.add(resourceName, "./assets/sprites.json");

    loader.onComplete.once(() => {
      const texture = loader.resources[`${resourceName}_image`].texture;
      if (texture) {
        texture.baseTexture.scaleMode = pixi.SCALE_MODES.NEAREST;
      }
      res();
    });

    loader.onError.once(() => {
      rej();
    });

    loader.load();
  });
}

function resizeCanvas(): void {
  const heightRatio = window.innerHeight / resolution.height;
  const widthRatio = window.innerWidth / resolution.width;
  const scale = Math.min(heightRatio, widthRatio);
  app.renderer.resize(resolution.width * scale, resolution.height * scale);
  app.stage.scale.x = scale;
  app.stage.scale.y = scale;
}

function getBird(): pixi.AnimatedSprite {
  const bird = new pixi.AnimatedSprite([
    pixi.Texture.from("birdUp.png"),
    pixi.Texture.from("birdMiddle.png"),
    pixi.Texture.from("birdDown.png"),
  ]);

  bird.loop = true;
  bird.animationSpeed = 0.1;
  bird.play();
  bird.scale.set(5);
  bird.scale;

  return bird;
}
