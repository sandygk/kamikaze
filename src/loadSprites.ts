import { AnimatedSprite, Loader, SCALE_MODES, Sprite, Texture } from 'pixi.js';
import { cloudSprites, player } from './store';

export async function loadSprites(): Promise<void> {
  return new Promise((res, rej) => {
    const loader = Loader.shared;
    const airplanesPath = './assets/airplanes.json';
    const cloudsPath = './assets/clouds.json';

    loader.add([airplanesPath, cloudsPath]);

    loader.onComplete.once(() => {
      res();
    });

    loader.onError.once(() => {
      rej();
    });

    loader.load(() => {
      setScaleModeToNearest(loader, airplanesPath);
      setScaleModeToNearest(loader, cloudsPath);

      const airplaneSprite = new AnimatedSprite([Texture.from('airplane')]);
      airplaneSprite.loop = true;
      airplaneSprite.animationSpeed = 0.1;
      airplaneSprite.play();
      airplaneSprite.scale.set(5);
      airplaneSprite.anchor.set(0.5, 0.5);
      player.sprite = airplaneSprite;

      const cloudSprite = new Sprite(Texture.from('cloud'));
      cloudSprite.scale.set(5);
      cloudSprite.alpha = 0.5;
      cloudSprites.push(cloudSprite);
    });
  });

  function setScaleModeToNearest(loader: Loader, path: string) {
    const texture = loader.resources[`${path}_image`].texture;
    if (texture) {
      texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
    }
  }
}
