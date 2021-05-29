import * as PIXI from "pixi.js";
import "./style.css";

const resolution = {
  width: 800,
  height: 600,
};

const app = new PIXI.Application({
  backgroundColor: 0x000000,
  width: resolution.width,
  height: resolution.height,
 
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
    const loader = PIXI.Loader.shared;
    loader.add("rabbit", "./assets/simpleSpriteSheet.json");

    loader.onComplete.once(() => {
      res();
    });

    loader.onError.once(() => {
      rej();
    });

    loader.load();
  });
}

function resizeCanvas(): void {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  const heightRatio = window.innerHeight / resolution.height;
  const widthRatio = window.innerWidth / resolution.width;
  const scale = Math.min(heightRatio, widthRatio);
  app.stage.scale.x = scale;
  app.stage.scale.y = scale;
}

function getBird(): PIXI.AnimatedSprite {
  const bird = new PIXI.AnimatedSprite([
    PIXI.Texture.from("birdUp.png"),
    PIXI.Texture.from("birdMiddle.png"),
    PIXI.Texture.from("birdDown.png"),
  ]);

    bird.loop = true;
  bird.animationSpeed = 0.1;
  bird.play();
  bird.scale.set(3);

  return bird;
}
