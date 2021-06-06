import { AnimatedSprite, Loader, SCALE_MODES, Texture } from 'pixi.js';
import { sprites } from './store';

export async function loadSprites(): Promise<void> {
  return new Promise((res, rej) => {
    const loader = Loader.shared;
    const atlasMapPath = './assets/atlasMap.json';
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
        texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
      }
      const plane = new AnimatedSprite([Texture.from('plane')]);
      plane.loop = true;
      plane.animationSpeed = 0.1;
      plane.play();
      plane.scale.set(5);
      plane.anchor.set(0.5, 0.5);
      sprites.plane = plane;
    });
  });
}
